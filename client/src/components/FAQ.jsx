import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // 1. Import the hook

export default function FAQ({ data }) {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate(); // 2. Initialize the navigation function

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F7931E]/50 to-transparent" />

      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-[#00D9FF] via-[#8338EC] to-[#FF006E] bg-clip-text text-transparent">
              FAQ
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Got questions? We've got answers.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {data?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div
                className={`relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "bg-white/10 border-white/20" : "hover:bg-white/[0.07]"
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-lg md:text-xl font-bold text-white pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      openIndex === index
                        ? "bg-gradient-to-br from-[#00D9FF] to-[#0099ff] text-white"
                        : "bg-white/5 text-gray-400 group-hover:bg-white/10"
                    }`}
                  >
                    <FaChevronDown className="text-lg" />
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 pt-2">
                        <div className="h-px bg-gradient-to-r from-[#00D9FF]/50 via-[#8338EC]/50 to-[#FF006E]/50 mb-4" />
                        <p className="text-gray-400 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Hover Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#00D9FF]/5 via-[#8338EC]/5 to-[#FF006E]/5 pointer-events-none transition-opacity duration-500 ${
                    openIndex === index ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-400 mb-6">
            We're here to help. Reach out to our support team.
          </p>
          
          {/* 3. The Navigation Trigger */}
          <motion.button
            onClick={() => navigate("/contact")} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white font-bold shadow-lg shadow-[#FF6B35]/30 hover:shadow-xl hover:shadow-[#FF6B35]/40 transition-all duration-300"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}