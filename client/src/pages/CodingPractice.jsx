import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCode, FaArrowRight, FaBolt, FaLightbulb, FaTrophy } from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";

const TOPICS = [
  "Arrays", "Strings", "Linked Lists", "Trees", "Graphs",
  "Dynamic Programming", "Recursion", "Sorting", "Stacks & Queues", "Hashing"
];

const DIFFICULTIES = [
  { label: "Easy", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
  { label: "Medium", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
  { label: "Hard", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", dot: "bg-red-500" },
];

const CHALLENGE_CARDS = [
  { topic: "Arrays", difficulty: "Easy", desc: "Two Sum, Max Subarray, Rotate Array", time: "~20 min" },
  { topic: "Strings", difficulty: "Easy", desc: "Palindrome, Anagram, Reverse Words", time: "~15 min" },
  { topic: "Dynamic Programming", difficulty: "Medium", desc: "Fibonacci, 0/1 Knapsack, LCS", time: "~40 min" },
  { topic: "Trees", difficulty: "Medium", desc: "Level Order, Diameter, LCA", time: "~35 min" },
  { topic: "Graphs", difficulty: "Hard", desc: "BFS/DFS, Topological Sort, Dijkstra", time: "~50 min" },
  { topic: "Linked Lists", difficulty: "Easy", desc: "Reverse, Detect Cycle, Merge", time: "~25 min" },
  { topic: "Sorting", difficulty: "Medium", desc: "Quick Sort, Merge Sort, Count Sort", time: "~30 min" },
  { topic: "Hashing", difficulty: "Easy", desc: "Frequency Count, Group Anagrams", time: "~20 min" },
];

export default function CodingPractice() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [loading, setLoading] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState("Easy");

  const filteredCards = CHALLENGE_CARDS.filter(
    (c) =>
      (selectedTopic === "All" || c.topic === selectedTopic) &&
      (selectedDifficulty === "All" || c.difficulty === selectedDifficulty)
  );

  const startChallenge = async (topic, difficulty) => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/coding/generate`, { topic, difficulty });
      sessionStorage.setItem("codingChallenge", JSON.stringify(res.data));
      navigate("/coding-practice/challenge");
    } catch (err) {
      console.error("Error generating challenge:", err);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Generating your coding challenge with AI..." />;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-700">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 dark:bg-emerald-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20 z-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6">
            <FaCode className="animate-pulse" /> Coding Practice
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight text-slate-900 dark:text-white">
            Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Coding</span> Problems
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto font-medium">
            AI-generated coding problems with hints. Practice topics that appear in campus placement drives.
          </p>
        </motion.div>

        {/* Custom AI Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-[2.5rem] border border-emerald-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaBolt className="text-emerald-500 text-xl" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Generate Custom Challenge</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="" className="dark:bg-slate-900">Select a Topic</option>
              {TOPICS.map((t) => <option key={t} value={t} className="dark:bg-slate-900">{t}</option>)}
            </select>
            <select
              value={customDifficulty}
              onChange={(e) => setCustomDifficulty(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              {["Easy", "Medium", "Hard"].map((d) => <option key={d} value={d} className="dark:bg-slate-900">{d}</option>)}
            </select>
            <button
              onClick={() => customTopic && startChallenge(customTopic, customDifficulty)}
              disabled={!customTopic}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Generate <FaArrowRight />
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedDifficulty("All")}
            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${selectedDifficulty === "All" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent" : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"}`}
          >
            All Levels
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.label}
              onClick={() => setSelectedDifficulty(d.label)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${selectedDifficulty === d.label ? `${d.color} border-current` : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCards.map((card, i) => {
            const diff = DIFFICULTIES.find((d) => d.label === card.difficulty);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => startChallenge(card.topic, card.difficulty)}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-lg">
                    <FaCode />
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${diff.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`}></span>
                    {card.difficulty}
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{card.topic}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{card.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-400 font-bold">{card.time}</span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                    <FaArrowRight className="text-xs text-slate-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-6 bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/10 flex items-start gap-4"
        >
          <FaLightbulb className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-1">Pro Tip</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Click "Get AI Hint" inside a challenge if you're stuck. The AI will guide you without giving away the full answer — just like a real coding interview coach.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
