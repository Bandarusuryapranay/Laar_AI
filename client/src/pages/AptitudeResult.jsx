import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaRedo, FaChevronDown, FaChevronUp, FaBrain, FaHome } from "react-icons/fa";

export default function AptitudeResult() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("aptitudeResult");
    if (!stored) {
      navigate("/aptitude");
      return;
    }
    setData(JSON.parse(stored));
  }, [navigate]);

  if (!data) return null;

  const { results, score, category, total } = data;
  const percentage = Math.round((score / total) * 100);
  const grade =
    percentage >= 80 ? { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-500/30" }
    : percentage >= 60 ? { label: "Good", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-500/30" }
    : percentage >= 40 ? { label: "Average", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-500/30" }
    : { label: "Needs Work", color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-500/30" };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pt-24 pb-16">
      <main className="max-w-3xl mx-auto px-4">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/10 p-10 text-center mb-8 shadow-xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-6">
            <FaBrain /> {category}
          </div>

          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#e2e8f0" className="dark:stroke-white/10" strokeWidth="3" />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#pg)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${percentage} 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{percentage}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{score}/{total}</span>
            </div>
          </div>

          <div className={`inline-block px-6 py-2 rounded-full ${grade.bg} border ${grade.border} mb-4`}>
            <span className={`text-lg font-black ${grade.color}`}>{grade.label}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-base font-medium max-w-sm mx-auto">
            You answered {score} out of {total} questions correctly.
            {percentage >= 70 ? " Great performance! You are placement-ready in this section." : " Keep practicing to improve your placement readiness."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={() => navigate(`/aptitude/test?category=${encodeURIComponent(category)}&count=${total}`)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 text-white rounded-2xl font-black hover:bg-violet-700 transition-all shadow-lg"
            >
              <FaRedo /> Try Again
            </button>
            <button
              onClick={() => navigate("/aptitude")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
            >
              All Categories
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg"
            >
              <FaHome /> Dashboard
            </button>
          </div>
        </motion.div>

        {/* Question Review */}
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Question Review</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tap each question to see the explanation</p>
        </div>

        <div className="space-y-4">
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border-2 overflow-hidden transition-all ${
                r.isCorrect
                  ? "border-emerald-500/30 dark:border-emerald-500/20"
                  : "border-red-500/30 dark:border-red-500/20"
              }`}
            >
              <button
                className={`w-full p-5 text-left flex items-start gap-4 ${
                  r.isCorrect ? "bg-emerald-50 dark:bg-emerald-500/5" : "bg-red-50 dark:bg-red-500/5"
                }`}
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {r.isCorrect
                    ? <FaCheckCircle className="text-emerald-500 text-xl" />
                    : <FaTimesCircle className="text-red-500 text-xl" />
                  }
                </div>
                <div className="flex-1 text-left">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Q{i + 1}</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">{r.question}</p>
                  {!r.isCorrect && r.userAnswer !== -1 && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">
                      Your answer: {r.options[r.userAnswer]}
                    </p>
                  )}
                  {r.userAnswer === -1 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">Not answered</p>
                  )}
                </div>
                {expandedIdx === i ? <FaChevronUp className="flex-shrink-0 text-slate-400 mt-1" /> : <FaChevronDown className="flex-shrink-0 text-slate-400 mt-1" />}
              </button>

              <AnimatePresence>
                {expandedIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/10"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20">
                        <FaCheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1">Correct Answer</p>
                          <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{r.options[r.correct]}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Explanation</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
