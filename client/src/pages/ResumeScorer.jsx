import { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileAlt, FaUpload, FaTimes, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaShieldAlt, FaLightbulb } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";

export default function ResumeScorer() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    setDrag(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setResume(file);
  };
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") setResume(file);
  };

  const handleSubmit = async () => {
    if (!resume || jd.trim().length < 50) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jd);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/resume/ats-score`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Analyzing your resume against the job description..." />;

  const scoreColor = result
    ? result.atsScore >= 75 ? "text-emerald-500" : result.atsScore >= 50 ? "text-amber-500" : "text-red-500"
    : "";
  const scoreGradient = result
    ? result.atsScore >= 75 ? "from-emerald-500 to-teal-500" : result.atsScore >= 50 ? "from-amber-500 to-orange-500" : "from-red-500 to-rose-500"
    : "";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pt-24 pb-16 transition-colors duration-700">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 z-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6">
            <FaShieldAlt className="animate-pulse" /> ATS Resume Scorer
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight text-slate-900 dark:text-white">
            Beat the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">ATS Filter</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Upload your resume and paste the job description. AI will analyze keyword match, missing skills, and give you actionable tips.
          </p>
        </motion.div>

        {!result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-6">
            {/* Resume Upload */}
            <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Step 1: Upload Your Resume</h2>
              {!resume ? (
                <div
                  onDragEnter={handleDrag} onDragLeave={handleDrag}
                  onDragOver={handleDrag} onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    drag ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-slate-300 dark:border-white/20 hover:border-blue-400 dark:hover:border-blue-500"
                  }`}
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl shadow-lg">
                    <FaUpload />
                  </div>
                  <p className="font-black text-slate-900 dark:text-white mb-1">Drop your resume PDF here</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse • PDF only • max 10MB</p>
                  <input ref={fileRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
                </div>
              ) : (
                <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white text-xl"><FaFileAlt /></div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">{resume.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{(resume.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setResume(null)} className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 flex items-center justify-center hover:bg-red-200 transition-all">
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            {/* JD Input */}
            <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Step 2: Paste Job Description</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Copy the full JD from the company's careers page</p>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={8}
                placeholder="Paste the complete job description here..."
                className="w-full px-5 py-4 border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none resize-none font-medium transition-all placeholder-slate-400"
              />
              <p className="text-xs text-slate-400 mt-2">{jd.length} characters (minimum 50)</p>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-500/30 rounded-2xl text-sm text-red-700 dark:text-red-400">
                <FaExclamationTriangle className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!resume || jd.trim().length < 50}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Analyze Resume <FaArrowRight />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Score Card */}
            <div className="bg-white dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/10 p-10 text-center shadow-xl">
              <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">ATS Compatibility Score</h2>
              <div className="relative w-44 h-44 mx-auto mb-6">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" className="dark:stroke-white/10" strokeWidth="3" />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="url(#ats)" strokeWidth="3" strokeLinecap="round"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${result.atsScore} 100` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="ats" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={result.atsScore >= 75 ? "#10b981" : result.atsScore >= 50 ? "#f59e0b" : "#ef4444"} />
                      <stop offset="100%" stopColor={result.atsScore >= 75 ? "#14b8a6" : result.atsScore >= 50 ? "#f97316" : "#f43f5e"} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-black ${scoreColor}`}>{result.atsScore}</span>
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaCheckCircle className="text-emerald-500" />
                  <h3 className="font-black text-slate-900 dark:text-white">Matched Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaExclamationTriangle className="text-amber-500" />
                  <h3 className="font-black text-slate-900 dark:text-white">Missing Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-700 dark:text-red-400">
                      ✗ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaLightbulb className="text-amber-500" />
                <h3 className="font-black text-slate-900 dark:text-white">AI Suggestions</h3>
              </div>
              <ul className="space-y-3">
                {result.suggestions?.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { setResult(null); setResume(null); setJd(""); }}
              className="w-full py-5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
            >
              Analyze Another Resume
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
