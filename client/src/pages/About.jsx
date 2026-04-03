import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaArrowRight,
    FaRobot,
    FaMicrophone,
    FaChartLine,
    FaUsers,
    FaUserPlus,
    FaCog,
    FaPlay,
    FaChartBar,
    FaTrophy,
    FaGithub,
    FaStar,
    FaCode,
    FaBolt,
    FaHeart,
    FaRocket,
    FaCheckCircle,
    FaLightbulb,
} from "react-icons/fa";

// --- Animation Variants ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.6, ease: "easeOut" } 
    }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { duration: 0.7, ease: "easeOut" } 
    }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { duration: 0.7, ease: "easeOut" } 
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

export default function About() {
    const features = [
        {
            icon: <FaRobot className="w-8 h-8" />,
            title: "AI-Powered Questions",
            description: "Get personalized interview questions tailored to your role and experience level.",
            color: "#10B981",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/30",
        },
        {
            icon: <FaMicrophone className="w-8 h-8" />,
            title: "Voice Analysis",
            description: "Practice speaking and receive feedback on your communication skills.",
            color: "#8B5CF6",
            bgColor: "bg-violet-500/10",
            borderColor: "border-violet-500/30",
        },
        {
            icon: <FaChartLine className="w-8 h-8" />,
            title: "Performance Analytics",
            description: "Track your progress with detailed insights and improvement suggestions.",
            color: "#F59E0B",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/30",
        },
        {
            icon: <FaUsers className="w-8 h-8" />,
            title: "Mock Interviews",
            description: "Experience realistic interview simulations in a safe environment.",
            color: "#EC4899",
            bgColor: "bg-pink-500/10",
            borderColor: "border-pink-500/30",
        },
    ];

    const steps = [
        { 
            icon: <FaUserPlus className="w-6 h-6" />, 
            title: "Sign Up", 
            description: "Create your free account and set up your profile in seconds.", 
            color: "emerald",
            path: "/signup"
        },
        { 
            icon: <FaCog className="w-6 h-6" />, 
            title: "Customize Your Prep", 
            description: "Choose your target role and upload your resume for personalized questions.", 
            color: "violet",
            path: "/interview/setup"
        },
        { 
            icon: <FaPlay className="w-6 h-6" />, 
            title: "Start Practicing", 
            description: "Begin mock interviews with real-time AI feedback and analysis.", 
            color: "amber",
            path: "/interview/setup" // Navigates to Practice page
        },
        { 
            icon: <FaChartBar className="w-6 h-6" />, 
            title: "Review & Improve", 
            description: "Analyze your performance with detailed reports and actionable insights.", 
            color: "pink",
            path: "/dashboard"
        },
        { 
            icon: <FaTrophy className="w-6 h-6" />, 
            title: "Ace Your Interview", 
            description: "Land your dream job with newfound confidence and preparation!", 
            color: "blue",
            path: "/resources" // Navigates to Resources page
        },
    ];

    const benefits = [
        "Practice anytime, anywhere",
        "Get instant AI feedback",
        "Track your improvement",
        "Build real confidence",
        "Save time and money",
        "Land more job offers",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] overflow-x-hidden">
            
            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-20 left-10 w-72 h-72 border-2 border-emerald-500/20 rounded-full" />
                        <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-violet-500/20 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-amber-500/10 rounded-full" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                            <motion.div variants={fadeInLeft} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border-2 border-emerald-500/30 bg-emerald-500/5 mb-8">
                                <FaLightbulb className="text-emerald-500 text-lg" />
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Meet Laar AI</span>
                            </motion.div>

                            <motion.h1 variants={fadeInLeft} className="text-5xl lg:text-7xl mb-8 font-black leading-[1.1]">
                                <span className="text-slate-900 dark:text-white">Your Path to</span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-violet-500 to-pink-500">Interview Mastery</span>
                            </motion.h1>

                            <motion.p variants={fadeInLeft} className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-xl">
                                Laar AI combines <span className="font-bold text-emerald-600 dark:text-emerald-400">cutting-edge AI</span> with proven interview techniques to help you <span className="font-bold text-violet-600 dark:text-violet-400">ace any interview</span>.
                            </motion.p>

                            <motion.div variants={fadeInLeft} className="flex flex-wrap gap-4 mb-12">
                                <Link to="/signup" className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300">
                                    <FaRocket className="group-hover:translate-x-1 transition-transform" />
                                    Start Free Trial
                                </Link>
                                <a href="#features" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-900 dark:text-white font-bold text-lg rounded-xl transition-all duration-300">Explore Features</a>
                            </motion.div>

                            <motion.div variants={fadeInLeft} className="grid grid-cols-2 gap-3">
                                {benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div initial="hidden" animate="visible" variants={fadeInRight} className="relative">
                            <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-violet-500 rounded-2xl opacity-20 blur-2xl" />
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-amber-500 to-pink-500 rounded-2xl opacity-20 blur-2xl" />
                                <img src="/about.png" alt="Platform illustration" className="w-full h-auto relative z-10 rounded-2xl" />
                                <div className="absolute bottom-8 left-8 right-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-black text-emerald-600">10K+</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">Users</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-black text-violet-600">98%</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">Success</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-black text-amber-600">50K+</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">Sessions</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Features Section --- */}
            <section id="features" className="relative py-24 lg:py-32 bg-white dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
                        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 mb-4">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Platform Features</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6">Everything You Need to Succeed</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">Powerful tools designed to help you master every aspect of the interview process</p>
                    </motion.div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={fadeInUp} whileHover={{ y: -8, scale: 1.02 }} className={`group relative p-10 rounded-3xl ${feature.bgColor} border-2 ${feature.borderColor} hover:shadow-2xl transition-all duration-300`}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg" style={{ backgroundColor: feature.color }}>{feature.icon}</div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{feature.description}</p>
                                <div className="mt-6 flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: feature.color }}>
                                    Learn more <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- Timeline-style How It Works --- */}
            <section className="relative py-24 lg:py-32 bg-slate-50 dark:bg-[#0f172a]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
                        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 mb-4">
                            <span className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Simple Process</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6">Get Started in Minutes</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Five simple steps to interview success</p>
                    </motion.div>

                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                                <Link to={step.path} className="block">
                                    <div className={`flex items-center gap-6 p-8 rounded-2xl border-2 border-transparent hover:border-${step.color}-500/30 bg-white dark:bg-slate-800 hover:bg-${step.color}-500/5 transition-all duration-300 group`}>
                                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-${step.color}-500/30 group-hover:scale-110 transition-transform`}>{index + 1}</div>
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-${step.color}-100 dark:bg-${step.color}-900/30 flex items-center justify-center text-${step.color}-600 dark:text-${step.color}-400`}>{step.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                                        </div>
                                        <FaArrowRight className={`text-2xl text-${step.color}-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all`} />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- GitHub Section --- */}
            <section className="relative py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"><FaGithub className="text-3xl" /></div>
                                <div>
                                    <div className="text-sm font-bold text-amber-400 uppercase tracking-wider">Open Source</div>
                                    <div className="text-2xl font-black">Laar AI on GitHub</div>
                                </div>
                            </div>
                            <h3 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">Help Us Build the Future of Interview Prep</h3>
                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">Laar AI is proudly <span className="text-amber-400 font-bold">open-source</span>. Join our community of developers making interview preparation accessible to everyone.</p>
                            <div className="space-y-4 mb-10">
                                {["Review and contribute to the codebase", "Report bugs and suggest features", "Help others in the community", "Shape the future of the platform"].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <FaCheckCircle className="text-emerald-400 mt-1 flex-shrink-0" />
                                        <span className="text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://github.com/Bandarusuryapranay" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"><FaGithub className="text-xl" /> View Repository</motion.a>
                                <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://github.com/Bandarusuryapranay" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all"><FaStar className="text-xl" /> Star the Project</motion.a>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="grid grid-cols-2 gap-6">
                            {[
                                { icon: <FaCode />, value: "100%", label: "Open Source", color: "emerald" },
                                { icon: <FaUsers />, value: "500+", label: "Contributors", color: "violet" },
                                { icon: <FaStar />, value: "2.5K", label: "GitHub Stars", color: "amber" },
                                { icon: <FaHeart />, value: "Active", label: "Community", color: "pink" },
                            ].map((card, idx) => (
                                <motion.div key={idx} whileHover={{ y: -5 }} className={`p-6 rounded-2xl bg-${card.color}-500/10 border-2 border-${card.color}-500/20 text-center`}>
                                    <div className={`text-4xl text-${card.color}-400 mb-3`}>{card.icon}</div>
                                    <div className={`text-3xl font-black text-${card.color}-400 mb-1`}>{card.value}</div>
                                    <div className="text-sm text-slate-400">{card.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 text-center p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="flex justify-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center"><FaHeart className="text-xl" /></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center"><FaCode className="text-xl" /></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center"><FaBolt className="text-xl" /></div>
                        </div>
                        <p className="text-2xl text-slate-300 italic mb-4 leading-relaxed">"Built for people chasing offers. Starred by those who get it."</p>
                        <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-violet-400 to-pink-400 uppercase tracking-[0.3em]">- SURZA</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}