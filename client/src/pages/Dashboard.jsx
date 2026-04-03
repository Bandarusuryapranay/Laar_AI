import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaPlus, 
    FaBolt, 
    FaArrowRight, 
    FaTrophy, 
    FaCalendarAlt, 
    FaUserTie,
    FaRobot,
    FaBrain,
    FaCode
} from "react-icons/fa";
import ScoreTrendChart from "../components/ScoreTrendChart";
import SummaryCard from "../components/SummaryCard";
import InterviewList from "../components/InterviewList";
import ActivityCalendar from "../components/ActivityCalendar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getActivityCounts } from "../utils/activityTracker";

export default function Dashboard() {
    const [interviews, setInterviews] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [aiInsight, setAiInsight] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return; // Guard clause

            try {
                setIsLoading(true);
                
                /** * FIX 1: Always get a fresh token. 
                 * This ensures the backend identifies the user by their UID inside the JWT,
                 * regardless of what their current "DisplayName" is.
                 */
                const token = await user.getIdToken(true); 
                
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [intResponse, reportResponse, insightResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/interview`, config),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/report`, config),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/report/insight`, config).catch(() => ({ data: { insight: null } }))
                ]);

                setInterviews(intResponse.data);
                if (insightResponse.data?.insight) {
                    setAiInsight(insightResponse.data.insight);
                }
                
                // Format chart data for Recharts
                const formattedChartData = reportResponse.data.map(r => ({
                    date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    score: Number(r.finalScore) || 0,
                    interviewName: r.interviewId?.interview_name || "Mock Session",
                }));
                setChartData(formattedChartData);

                const scores = reportResponse.data.map((i) => i.finalScore || 0);
                const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

                // ✅ Pull aptitude + coding counts from localStorage
                const { aptitude, coding } = getActivityCounts();
                
                setSummaryData([
                    { title: "Mock Interviews", value: intResponse.data.length, icon: <FaCalendarAlt />, color: "text-blue-600 dark:text-cyan-400" },
                    { title: "Peak Score", value: bestScore.toFixed(0) + "%", icon: <FaTrophy />, color: "text-amber-500" },
                    { title: "Aptitude Tests", value: aptitude, icon: <FaBrain />, color: "text-violet-500" },
                    { title: "Coding Challenges", value: coding, icon: <FaCode />, color: "text-emerald-500" },
                ]);
            } catch (error) {
                console.error("Dashboard Sync Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center transition-colors duration-500">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-500/20 dark:border-cyan-500/20 border-t-blue-500 dark:border-t-cyan-500 rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 dark:selection:bg-cyan-500/30 font-sans overflow-x-hidden transition-colors duration-700">
            {/* --- Designer Background Ambient Glow --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full transition-opacity" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 dark:bg-cyan-500/10 blur-[100px] rounded-full transition-opacity" />
            </div>

            <main className="relative max-w-[1400px] mx-auto px-6 py-10 lg:py-16 z-10">
                
                {/* --- Bento Header Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    {/* Welcome Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8 bg-white dark:bg-gradient-to-br dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#020617] border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl"
                    >
                        <div className="relative z-10">
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-100 dark:border-cyan-500/20 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-cyan-400 mb-6"
                            >
                                <FaRobot className="animate-pulse" /> Platform Active
                            </motion.div>
                            
                            {/** * FIX 2: Check for displayName (Firebase) or name (Backend) 
                             */}
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight text-slate-900 dark:text-white">
                                Sharpen your skills, <br/>{user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Candidate'}.
                            </h1>
                            
                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md font-medium mb-10 leading-relaxed">
                                You've completed {interviews.length} sessions. Your confidence metrics are trending upward.
                            </p>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/interview/setup")}
                                className="bg-blue-600 dark:bg-[#2563EB] text-white px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-blue-500/20 transition-all"
                            >
                                <FaPlus className="text-sm" /> Start New Interview
                            </motion.button>
                        </div>
                        <FaUserTie className="absolute -bottom-10 -right-10 text-[22rem] text-slate-100 dark:text-white/5 -rotate-12 pointer-events-none transition-colors" />
                    </motion.div>

                    {/* Stats Bento Box */}
                    <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                        {summaryData.map((data, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-blue-500 dark:hover:border-cyan-500/50 transition-all duration-500 shadow-sm dark:shadow-none"
                            >
                                <div>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{data.title}</p>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">{data.value}</h3>
                                </div>
                                <div className={`text-2xl ${data.color} bg-slate-50 dark:bg-white/5 p-5 rounded-[1.5rem] group-hover:scale-110 transition-transform duration-500`}>
                                    {data.icon}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- Main Analytics Row --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Performance Chart Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-7 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-10 flex flex-col shadow-xl dark:shadow-2xl transition-colors"
                    >
                        <ScoreTrendChart chartData={chartData} />
                    </motion.div>

                    {/* Activity List Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-5 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-10 flex flex-col shadow-xl dark:shadow-2xl transition-colors"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Sessions</h2>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Activity Log</p>
                            </div>
                            <button 
                            onClick={() => navigate("/dashboard?tab=history")}
                            className="text-blue-600 dark:text-cyan-400 text-xs font-black flex items-center gap-2 hover:gap-3 transition-all group">
                                VIEW ALL <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                            <InterviewList interviews={interviews} itemsPerPage={4} />
                        </div>

                        {/* AI Strategy Widget */}
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="mt-8 p-6 bg-blue-50 dark:bg-cyan-500/5 rounded-[2rem] border border-blue-100 dark:border-cyan-500/10 flex items-start gap-4 transition-colors"
                        >
                            <div className="p-3 bg-blue-600 dark:bg-cyan-500/20 rounded-xl text-white dark:text-cyan-400">
                                <FaBolt className="animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">AI Strategy Note</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                                    {aiInsight || <>Your "Technical Depth" surged recently. Focus on articulation in your next session to reach <span className="text-blue-600 dark:text-cyan-400 font-bold">Peak Performance</span>.</>}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

            {/* --- Activity Calendar --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
            >
                <ActivityCalendar interviews={interviews} />
            </motion.div>
        </main>
        </div>
    );
}