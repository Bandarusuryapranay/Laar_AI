import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaMicrophone, FaDesktop, FaChartLine } from "react-icons/fa";

// Components & Data
import Card from "../components/Card";
import FAQ from "../components/FAQ";
import faqData from "../data/faqData";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1a1f3a] to-[#0A0E27] dark:from-[#050810] dark:via-[#0d1220] dark:to-[#050810]">
      {/* --- Hero Section --- */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#FF6B35]/20 to-[#F7931E]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#00D9FF]/20 to-[#7B2CBF]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 100, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-[#FF006E]/15 to-[#8338EC]/15 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div variants={fadeInUp} className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#F7931E]/10 border border-[#FF6B35]/30 backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
              <span className="text-sm font-medium text-[#00D9FF]">
                Next-Gen Interview Prep
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-white via-[#00D9FF] to-white bg-clip-text text-transparent">
                Ace Your Interviews
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#FF006E] bg-clip-text text-transparent">
                with AI
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-xl">
              <span className="text-[#00D9FF] font-bold">HI! I AM Laar AI</span> — an open-source, 
              AI-powered interview preparation platform built to{" "}
              <span className="text-[#F7931E] font-semibold">Unlock Your Confidence</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 217, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/interview/setup")}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00D9FF] to-[#0099ff] text-black font-bold text-lg shadow-xl shadow-[#00D9FF]/30 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0099ff] to-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/about")}
                className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border-2 border-white/20 backdrop-blur-sm shadow-lg transition-all duration-300"
              >
                Learn More
              </motion.button>
            </div>

            {/* Stats */}
           
          </motion.div>

          {/* Right: Video Section */}
          <motion.div
            variants={fadeInUp}
            className="relative"
          >
            <motion.div
              variants={floatAnimation}
              animate="animate"
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#00D9FF]/20 border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"
            >
              {/* Video Container */}
              <div className="aspect-video bg-gradient-to-br from-[#1a1f3a] to-[#0A0E27] flex items-center justify-center">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="AI-bot video.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00D9FF]/30 via-[#8338EC]/30 to-[#FF006E]/30 blur-2xl -z-10 opacity-50" />
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#F7931E] shadow-xl shadow-[#FF6B35]/50 flex items-center justify-center"
            >
              <FaRobot className="text-4xl text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-[#7B2CBF] shadow-xl shadow-[#00D9FF]/50 flex items-center justify-center"
            >
              <FaChartLine className="text-4xl text-white" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Features Section --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative py-24 px-6 overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/50 to-transparent" />

        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black">
              <span className="bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#FF006E] bg-clip-text text-transparent">
                Our Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover how our platform can help you ace your next interview with these powerful features.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaRobot className="text-5xl" />,
                title: "AI-Powered Questions",
                description: "Practice with AI-generated interview questions tailored to your role and experience level.",
                gradient: "from-[#FF6B35] to-[#F7931E]",
              },
              {
                icon: <FaMicrophone className="text-5xl" />,
                title: "Voice Support",
                description: "Get real-time feedback on your answers with voice recognition and analysis.",
                gradient: "from-[#00D9FF] to-[#0099ff]",
              },
              {
                icon: <FaDesktop className="text-5xl" />,
                title: "Screen Recording",
                description: "Record your practice sessions and review them to improve your performance.",
                gradient: "from-[#8338EC] to-[#7B2CBF]",
              },
              {
                icon: <FaChartLine className="text-5xl" />,
                title: "Performance Analytics",
                description: "Track your progress with detailed analytics and insights.",
                gradient: "from-[#FF006E] to-[#C9184A]",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`relative mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="relative text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="relative text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 blur-2xl`} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- Cards Section --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative py-24 px-6"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp}>
              <Card
                icon={<FaRobot className="text-4xl" />}
                title="Personalized Practice"
                description="Tailored to your specific role."
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card
                icon={<FaMicrophone className="text-4xl" />}
                title="Real-time Feedback"
                description="Instant analysis of your speech."
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card
                icon={<FaChartLine className="text-4xl" />}
                title="Data-Driven Improvement"
                description="Track your performance over time."
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Component */}
      <FAQ data={faqData} />
    </div>
  );
}