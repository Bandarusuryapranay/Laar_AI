import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaGlobe, FaLightbulb, FaArrowRight, FaCode, FaCheckCircle } from "react-icons/fa";
import ResourceCard from "../components/ResourceCard";
import resources from "../data/resourcesData";
import featuredResources from "../data/featuredResourcesData";

export default function ResourcesPage() {
    return (
        /* Adapt background to Sky-Gray in light mode and Midnight in dark mode */
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 dark:selection:bg-cyan-500/30 font-sans transition-colors duration-700">
            
            {/* --- HERO SECTION --- */}
            <section className="relative overflow-hidden pt-20 pb-32">
                {/* Background Atmosphere - Animated glow layers */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[140px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="z-10"
                        >
                            {/* Adaptive Rocket Badge: Orange (Light) / Cyan (Dark) */}
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-cyan-500/10 border border-orange-100 dark:border-cyan-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-cyan-400 mb-6 transition-colors">
                                <FaRocket className="animate-bounce" />
                                <span>Level Up Your Career</span>
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-8">
                                Don't Just Dream. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 dark:from-cyan-400 dark:to-blue-500 italic">
                                    Prepare to Win.
                                </span>
                            </h1>

                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed font-medium transition-colors">
                                The distance between you and your dream offer is a single well-prepared hour. Access the intelligence that moves the needle.
                            </p>

                            {/* Impact Stats Bento Container */}
                            <div className="grid grid-cols-3 gap-4 mb-10 p-6 bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-all">
                                <StatItem label="Curated Intel" value="50+" icon={<FaCode className="text-orange-500 dark:text-cyan-400" />} />
                                <StatItem label="Active Minds" value="10k+" icon={<FaGlobe className="text-blue-500 dark:text-blue-400" />} />
                                <StatItem label="Win Rate" value="95%" icon={<FaCheckCircle className="text-emerald-500 dark:text-emerald-400" />} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <motion.a
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(249,115,22,0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                    href="#all-resources"
                                    className="px-10 py-5 bg-orange-600 dark:bg-[#2563EB] text-white font-black rounded-2xl flex items-center justify-center transition-all shadow-xl"
                                >
                                    Access Intelligence <FaArrowRight className="ml-3" />
                                </motion.a>
                                <Link
                                    to="/interview/setup"
                                    className="px-10 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center shadow-sm dark:shadow-none"
                                >
                                    Start Mock Session
                                </Link>
                            </div>
                        </motion.div>

                        {/* Interactive Hero Image Component */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative flex justify-center"
                        >
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 dark:from-cyan-500 dark:to-blue-600 rounded-[3rem] blur-3xl opacity-10 dark:opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                <div className="relative bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl p-4 rounded-[3.5rem] border border-white dark:border-white/10 overflow-hidden shadow-2xl transition-all">
                                    <img
                                        src="/hero-image.jpg"
                                        alt="Career Growth Simulation"
                                        className="w-full max-w-md rounded-[2.5rem] object-cover grayscale-[0.2] dark:grayscale-[0.3] hover:grayscale-0 transition-all duration-700 shadow-inner"
                                    />
                                </div>
                                
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }} 
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute -top-6 -right-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-xl dark:shadow-2xl transition-colors"
                                >
                                    <FaLightbulb className="text-amber-500 dark:text-amber-400 text-2xl" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FEATURED RESOURCES --- */}
            <section id="featured-resources" className="py-24 relative z-10 border-t border-slate-200 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">The Power Selection</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Handpicked intelligence for high-stakes roles</p>
                        </div>
                        <div className="h-[2px] flex-grow bg-slate-200 dark:bg-white/5 mx-12 hidden lg:block transition-colors"></div>
                        <div className="text-orange-600 dark:text-cyan-400 font-black text-xs uppercase tracking-tighter transition-colors">Verified Content // 2026</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredResources.map((resource) => (
                            <ResourceCard key={resource.id} {...resource} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- ALL RESOURCES --- */}
            <section id="all-resources" className="py-24 bg-white dark:bg-slate-950/50 backdrop-blur-sm relative border-t border-slate-200 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
                    <div className="mb-16">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 text-center transition-colors">Global Intelligence Library</h2>
                        <div className="w-24 h-1 bg-orange-500 dark:bg-cyan-500 mx-auto rounded-full transition-colors"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {resources.map((resource) => (
                            <ResourceCard key={resource.id} {...resource} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatItem({ label, value, icon }) {
    return (
        <div className="text-center group">
            <div className="flex justify-center text-xl mb-2 group-hover:scale-125 transition-transform duration-300">
                {icon}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white transition-colors">{value}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
        </div>
    );
}