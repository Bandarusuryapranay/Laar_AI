import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ContentSection from "../components/ContentSection";
import ReviewQuestion from "../components/QuestionReview";
import downloadPDF from "../utils/pdfDownload";
import { motion } from "framer-motion";
import { 
    FaDownload, 
    FaRedo, 
    FaChartBar, 
    FaLightbulb, 
    FaCheckCircle, 
    FaTrophy,
    FaBullseye,
    FaRocket,
    FaStar,
    FaChartLine,
    FaFileAlt,
    FaHome
} from "react-icons/fa";

export default function InterviewReport() {
    const navigate = useNavigate();
    const { interviewId } = useParams();
    const [report, setReport] = useState(null);
    const [interview, setInterview] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/report/${interviewId}`);
                setReport(response.data);
                const interviewResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/interview/${interviewId}`);
                setInterview(interviewResponse.data);
            } catch (error) {
                console.error("Error fetching report:", error);
            }
        };
        fetchReport();
    }, [interviewId]);

    const finalScore = report?.finalScore || 0;
    const summary = report?.summary || report?.aiSummary || "Analysis in progress...";

    const improvementAreas = Array.isArray(report?.areaOfImprovement) 
        ? report.areaOfImprovement 
        : (report?.improvements || report?.improvementAreas || []);

    const strengths = Array.isArray(report?.strengths) 
        ? report.strengths 
        : (report?.keyStrengths || []);
    
    const reviewQuestions = report?.answers || [];

    // Get performance level based on score
    const getPerformanceLevel = (score) => {
        if (score >= 90) return { label: "Exceptional", color: "emerald", icon: <FaTrophy /> };
        if (score >= 75) return { label: "Strong", color: "blue", icon: <FaStar /> };
        if (score >= 60) return { label: "Good", color: "violet", icon: <FaCheckCircle /> };
        if (score >= 40) return { label: "Fair", color: "amber", icon: <FaBullseye /> };
        return { label: "Needs Work", color: "orange", icon: <FaRocket /> };
    };

    const performance = getPerformanceLevel(finalScore);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    if (!report) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-semibold">Loading your report...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
            <motion.main 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-6xl mx-auto space-y-8"
            >
                
                {/* Header Section - Redesigned */}
                <motion.div 
                    variants={fadeInUp}
                    className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700"
                >
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl" />
                    
                    <div className="relative p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex-1">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                        Completed
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                    Interview Analysis
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                                    {interview?.role} • Practice Session
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => downloadPDF({ report, interview })}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                                >
                                    <FaDownload /> Export PDF
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Score Hero Section - Completely New */}
                <motion.div 
                    variants={fadeInUp}
                    className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl border border-slate-700"
                >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                            backgroundSize: '32px 32px'
                        }} />
                    </div>

                    <div className="relative p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                            {/* Score Circle */}
                            <div className="lg:col-span-1 flex justify-center">
                                <div className="relative">
                                    {/* Outer glow ring */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-${performance.color}-500 to-${performance.color}-600 blur-2xl opacity-40 animate-pulse`} />
                                    
                                    {/* Score circle */}
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle 
                                                cx="96" 
                                                cy="96" 
                                                r="88" 
                                                stroke="currentColor" 
                                                strokeWidth="12" 
                                                fill="transparent" 
                                                className="text-slate-700" 
                                            />
                                            <motion.circle 
                                                cx="96" 
                                                cy="96" 
                                                r="88" 
                                                stroke="currentColor" 
                                                strokeWidth="12" 
                                                fill="transparent" 
                                                strokeDasharray="552.92" 
                                                initial={{ strokeDashoffset: 552.92 }}
                                                animate={{ strokeDashoffset: 552.92 - (552.92 * finalScore) / 100 }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                                className={`text-${performance.color}-500`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.span 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                                className="text-5xl font-black text-white"
                                            >
                                                {finalScore}%
                                            </motion.span>
                                            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">
                                                Score
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-${performance.color}-500/10 border border-${performance.color}-500/20 mb-4`}>
                                        <span className={`text-2xl text-${performance.color}-400`}>
                                            {performance.icon}
                                        </span>
                                        <span className={`text-xl font-black text-${performance.color}-400`}>
                                            {performance.label} Performance
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-3">
                                        Great job on completing the interview!
                                    </h2>
                                    <p className="text-slate-300 text-lg leading-relaxed">
                                        You've demonstrated solid preparation and communication skills. 
                                        Review the detailed feedback below to continue improving.
                                    </p>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-3xl font-black text-emerald-400 mb-1">
                                            {reviewQuestions.length}
                                        </div>
                                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                                            Questions
                                        </div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-3xl font-black text-violet-400 mb-1">
                                            {strengths.length}
                                        </div>
                                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                                            Strengths
                                        </div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-3xl font-black text-amber-400 mb-1">
                                            {improvementAreas.length}
                                        </div>
                                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                                            Growth Areas
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* AI Summary Section */}
                <motion.div 
                    variants={fadeInUp}
                    className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-500/5 dark:to-purple-500/5 px-8 py-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                <FaChartBar />
                            </div>
                            AI Executive Summary
                        </h2>
                    </div>
                    <div className="p-8">
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            {summary || "Our AI is currently processing your final response data..."}
                        </div>
                    </div>
                </motion.div>

                {/* Strengths & Improvements Grid */}
                <motion.div 
                    variants={fadeInUp}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Strengths */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-3xl border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                            <h3 className="text-xl font-black text-white flex items-center gap-2">
                                <FaCheckCircle /> Your Strengths
                            </h3>
                        </div>
                        <div className="p-6">
                            {strengths.length > 0 ? (
                                <ul className="space-y-3">
                                    {strengths.map((item, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                                                <FaCheckCircle className="text-white text-xs" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                                {item}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                                    No strengths identified yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Improvement Areas */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-3xl border-2 border-amber-200 dark:border-amber-800 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
                            <h3 className="text-xl font-black text-white flex items-center gap-2">
                                <FaRocket /> Growth Opportunities
                            </h3>
                        </div>
                        <div className="p-6">
                            {improvementAreas.length > 0 ? (
                                <ul className="space-y-3">
                                    {improvementAreas.map((item, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                                                <FaLightbulb className="text-white text-xs" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                                {item}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                                    No improvement areas identified.
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Question Review Section */}
                <motion.div variants={fadeInUp} className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <FaFileAlt />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                                Detailed Analysis
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                                Question-by-question breakdown with feedback
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {reviewQuestions.map((question, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
                            >
                                <ReviewQuestion
                                    questionNumber={index + 1}
                                    question={question.question}
                                    userAnswer={question.userAnswer}
                                    preferredAnswer={question.preferredAnswer}
                                    score={question.score}
                                    feedback={question.feedback}
                                    defaultExpanded={false}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Actions - Redesigned */}
                <motion.div 
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 py-8"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/interview/setup")}
                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
                    >
                        <FaRedo /> Try Another Interview
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                        className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                        <FaHome /> Back to Dashboard
                    </motion.button>
                </motion.div>
            </motion.main>
        </div>
    );
}