import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode, FaLightbulb, FaClock, FaArrowLeft, FaChevronDown, FaCheckCircle, FaTrophy, FaHome } from "react-icons/fa";
import CodeEditor from "../components/CodeEditor";
import LoadingScreen from "../components/LoadingScreen";
import { saveActivity } from "../utils/activityTracker";

const DIFF_COLORS = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};

export default function CodingChallenge() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [showApproach, setShowApproach] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("codingChallenge");
    if (!stored) {
      navigate("/coding-practice");
      return;
    }
    const parsed = JSON.parse(stored);
    setChallenge(parsed);
    setCode(parsed.starterCode?.[language] || "// Start coding...");
  }, [navigate]);

  useEffect(() => {
    if (challenge?.starterCode) {
      setCode(challenge.starterCode[language] || "// Start coding...");
    }
  }, [language, challenge]);

  useEffect(() => {
    if (!timerActive) return;
    const t = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [timerActive]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  };

  const getHint = async () => {
    if (!challenge) return;
    setLoadingHint(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/coding/hint`, {
        problem: `${challenge.title}\n\n${challenge.description}`,
        userCode: code,
        language,
      });
      setHint(res.data.hint);
    } catch {
      setHint("Think step by step — break the problem into smaller parts and consider edge cases.");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleSubmit = () => {
    setTimerActive(false);
    // ✅ Track coding session on the calendar
    saveActivity("coding", `${challenge.topic} (${challenge.difficulty})`, null);
    setSubmitted(true);
  };

  if (!challenge) return <LoadingScreen message="Loading challenge..." />;

  // ── Completion Screen ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex items-center justify-center font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4 bg-white dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/10 p-10 text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
          >
            <FaTrophy className="text-5xl text-emerald-500" />
          </motion.div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Challenge Complete!</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">
            {challenge.title}
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${DIFF_COLORS[challenge.difficulty] || DIFF_COLORS.Easy}`}>
              {challenge.difficulty}
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
              ⏱ Time: {formatTime(elapsed)}
            </span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Your session has been recorded and will appear on your activity calendar. 
            Keep up the practice — consistency is key to placement success!
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/coding-practice")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-lg"
            >
              Practice Another Challenge
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-black rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <FaHome /> Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main Challenge Screen ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pt-20">
      <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel — Problem */}
        <div className="lg:w-[45%] flex flex-col border-r border-slate-200 dark:border-white/10 overflow-hidden">
          {/* Problem Header */}
          <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#0f172a] flex-shrink-0">
            <button
              onClick={() => navigate("/coding-practice")}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-bold"
            >
              <FaArrowLeft /> Back
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${DIFF_COLORS[challenge.difficulty] || DIFF_COLORS.Easy}`}>
                {challenge.difficulty}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono font-bold bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full">
                <FaClock /> {formatTime(elapsed)}
              </span>
            </div>
          </div>

          {/* Problem Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#0f172a]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{challenge.topic}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">{challenge.title}</h1>

            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{challenge.description}</p>
            </div>

            {/* Examples */}
            {challenge.examples?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">Examples</h3>
                {challenge.examples.map((ex, i) => (
                  <div key={i} className="mb-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Example {i + 1}</p>
                    <p className="font-mono text-xs text-slate-800 dark:text-slate-200"><span className="text-slate-500">Input:</span> {ex.input}</p>
                    <p className="font-mono text-xs text-slate-800 dark:text-slate-200"><span className="text-slate-500">Output:</span> {ex.output}</p>
                    {ex.explanation && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ex.explanation}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {challenge.constraints?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">Constraints</h3>
                <ul className="space-y-1">
                  {challenge.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-emerald-500 mt-0.5">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Approach Toggle */}
            <button
              onClick={() => setShowApproach((p) => !p)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-500/20 text-sm font-bold text-violet-700 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all mb-4"
            >
              <span>💡 View Approach (No Spoilers)</span>
              <FaChevronDown className={`transition-transform ${showApproach ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showApproach && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {challenge.approach}
                    <div className="flex gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>⏱ {challenge.timeComplexity}</span>
                      <span>💾 {challenge.spaceComplexity}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Hint */}
            <button
              onClick={getHint}
              disabled={loadingHint}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black transition-all disabled:opacity-70 shadow-lg mb-4"
            >
              {loadingHint ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              ) : (
                <FaLightbulb />
              )}
              {loadingHint ? "Getting hint..." : "Get AI Hint"}
            </button>

            <AnimatePresence>
              {hint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-500/20 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  <span className="font-black text-amber-600 dark:text-amber-400">AI Hint:</span> {hint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel — Editor */}
        <div className="lg:w-[55%] flex flex-col overflow-hidden">
          {/* Editor Header */}
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#0f172a] flex-shrink-0">
            <div className="flex items-center gap-2">
              <FaCode className="text-emerald-500" />
              <span className="font-black text-slate-900 dark:text-white text-sm">Code Editor</span>
            </div>
            <div className="flex items-center gap-3">
              <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(challenge.starterCode?.[e.target.value] || "// Start coding...");
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none transition-all cursor-pointer"
            >
              <option value="javascript" className="dark:bg-slate-900">JavaScript</option>
              <option value="python" className="dark:bg-slate-900">Python</option>
            </select>

              {/* ✅ Submit Solution Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <FaCheckCircle /> Submit
              </motion.button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              language={language}
              value={code}
              onChange={setCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
