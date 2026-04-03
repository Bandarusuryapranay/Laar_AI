import React from "react";
import { motion } from "framer-motion";

export default function Card({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 overflow-hidden h-full"
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/0 via-[#00D9FF]/0 to-[#8338EC]/0 group-hover:from-[#FF6B35]/5 group-hover:via-[#00D9FF]/5 group-hover:to-[#8338EC]/5 transition-all duration-500"
        initial={false}
      />

      {/* Icon Container */}
      <div className="relative mb-6">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-[#0099ff] text-white shadow-lg shadow-[#00D9FF]/30"
        >
          {icon}
        </motion.div>
      </div>

      {/* Content */}
      <h3 className="relative text-2xl font-bold text-white mb-3 group-hover:text-[#00D9FF] transition-colors duration-300">
        {title}
      </h3>
      <p className="relative text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF6B35]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}