import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaArrowRight, FaCheckCircle, FaTimesCircle, FaBrain, FaSpinner } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { saveActivity } from "../utils/activityTracker";

export default function AptitudeTest() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "Quantitative Aptitude";
  const count = parseInt(searchParams.get("count") || "10");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState({}); // { qIdx: optionIdx }
  const [timeLeft, setTimeLeft] = useState(count * 90); // 90 seconds per question
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/aptitude/generate`,
          { category, count },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(res.data.questions);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to generate test. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTest();
  }, [user, category, count]);

  // Countdown timer
  useEffect(() => {
    if (loading || !questions.length) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, questions]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSelect = (optionIdx) => {
    setSelected((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    // Calculate results
    const results = questions.map((q, i) => ({
      question: q.question,
      options: q.options,
      correct: q.correct,
      userAnswer: selected[i] !== undefined ? selected[i] : -1,
      explanation: q.explanation,
      isCorrect: selected[i] === q.correct,
    }));
    const score = results.filter((r) => r.isCorrect).length;
    const percentage = Math.round((score / count) * 100);

    // ✅ Track activity so the Dashboard calendar marks today
    saveActivity("aptitude", category, percentage);

    // Store in sessionStorage and navigate
    sessionStorage.setItem("aptitudeResult", JSON.stringify({ results, score, category, total: count }));
    navigate("/aptitude/result");
  };

  if (loading) return <LoadingScreen message="Generating your aptitude test with AI..." />;
  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center p-10">
          <FaTimesCircle className="text-red-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Generation Failed</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <button onClick={() => navigate("/aptitude")} className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black">
            ← Back to Aptitude
          </button>
        </div>
      </div>
    );
  }
  if (submitting) return <LoadingScreen message="Calculating your score..." />;

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selected).length;

  const timePercent = (timeLeft / (count * 90)) * 100;
  const timerColor = timePercent > 50 ? "text-emerald-400" : timePercent > 25 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pt-24">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaBrain className="text-violet-500" />
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">{category}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">{answeredCount}/{questions.length} answered</div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 font-mono font-black text-2xl ${timerColor}`}>
            <FaClock />
            {formatTime(timeLeft)}
          </div>
        </motion.div>

        {/* Progress */}
        <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden mb-8">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 md:p-10 mb-6"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-black flex items-center justify-center flex-shrink-0">
                {currentIdx + 1}
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                {q.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {q.options.map((option, optIdx) => {
                const isSelected = selected[currentIdx] === optIdx;
                return (
                  <motion.button
                    key={optIdx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(optIdx)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all font-medium ${
                      isSelected
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-500/20 text-violet-800 dark:text-violet-200"
                        : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-colors ${
                      isSelected ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                    }`}>
                      {["A", "B", "C", "D"][optIdx]}
                    </div>
                    <span className="leading-relaxed pt-0.5">{option}</span>
                    {isSelected && <FaCheckCircle className="ml-auto text-violet-500 mt-0.5 flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
            disabled={currentIdx === 0}
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
          >
            ← Previous
          </button>

          {/* Question dots */}
          <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                  i === currentIdx
                    ? "bg-violet-600 text-white"
                    : selected[i] !== undefined
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx((p) => p + 1)}
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-all flex items-center gap-2"
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
            >
              Submit Test
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
