import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBrain, FaLightbulb, FaBook, FaChartBar, FaArrowRight, FaClock, FaTrophy } from "react-icons/fa";

const CATEGORIES = [
  {
    id: "Quantitative Aptitude",
    label: "Quantitative Aptitude",
    icon: <FaBrain />,
    description: "Numbers, percentages, ratios, time & work, profit & loss",
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/30",
    border: "border-violet-500/20",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    textColor: "text-violet-700 dark:text-violet-300",
    iconColor: "text-violet-500",
    avgTime: "20 min",
  },
  {
    id: "Logical Reasoning",
    label: "Logical Reasoning",
    icon: <FaLightbulb />,
    description: "Syllogisms, blood relations, coding-decoding, puzzles",
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/30",
    border: "border-amber-500/20",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    textColor: "text-amber-700 dark:text-amber-300",
    iconColor: "text-amber-500",
    avgTime: "20 min",
  },
  {
    id: "Verbal Ability",
    label: "Verbal Ability",
    icon: <FaBook />,
    description: "Reading comprehension, grammar, vocabulary, sentence correction",
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/30",
    border: "border-emerald-500/20",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    textColor: "text-emerald-700 dark:text-emerald-300",
    iconColor: "text-emerald-500",
    avgTime: "15 min",
  },
  {
    id: "Data Interpretation",
    label: "Data Interpretation",
    icon: <FaChartBar />,
    description: "Tables, bar charts, pie charts, line graphs, data analysis",
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/30",
    border: "border-blue-500/20",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-500",
    avgTime: "25 min",
  },
];

export default function AptitudePage() {
  const navigate = useNavigate();
  const [selectedCount, setSelectedCount] = useState(10);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-700">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/5 dark:bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-amber-500/5 dark:bg-amber-500/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20 z-10">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-6">
            <FaBrain className="animate-pulse" /> Aptitude Training
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight text-slate-900 dark:text-white">
            Crack the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-600">Aptitude</span> Round
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
            AI-generated MCQ tests tailored for campus placements. Practice by category and track your accuracy.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-12 p-6 bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10"
        >
          {[
            { label: "Categories", value: "4", icon: <FaBrain className="text-violet-500" /> },
            { label: "AI Generated", value: "∞", icon: <FaLightbulb className="text-amber-500" /> },
            { label: "Placement Ready", value: "100%", icon: <FaTrophy className="text-emerald-500" /> },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Question Count Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Questions per test:</span>
          <div className="flex gap-2">
            {[5, 10, 15].map((n) => (
              <button
                key={n}
                onClick={() => setSelectedCount(n)}
                className={`w-12 h-10 rounded-xl text-sm font-black transition-all border-2 ${
                  selectedCount === n
                    ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/30"
                    : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-violet-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`group bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 hover:shadow-xl cursor-pointer`}
              onClick={() => navigate(`/aptitude/test?category=${encodeURIComponent(cat.id)}&count=${selectedCount}`)}
            >
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} text-white text-2xl shadow-lg ${cat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${cat.bg} border ${cat.border}`}>
                  <FaClock className={`text-xs ${cat.iconColor}`} />
                  <span className={`text-xs font-bold ${cat.textColor}`}>{cat.avgTime}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                  {selectedCount} Questions • AI Generated
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-violet-600 transition-colors duration-300">
                  <FaArrowRight className="text-slate-400 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10 p-8 bg-gradient-to-br from-violet-500/10 to-purple-500/5 rounded-[2.5rem] border border-violet-500/20"
        >
          <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
            <FaLightbulb className="text-amber-500" /> Pro Tips for Aptitude
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Practice mental math daily — speed beats accuracy in timed tests.",
              "Learn shortcut formulas for percentages, ratios, and time-work problems.",
              "For logical reasoning, read each question twice before answering.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600 dark:bg-violet-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
