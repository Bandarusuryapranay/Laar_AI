import FAQ from "../components/FAQ";
import ContactForm from "../components/ContactForm";
import faqData from "../data/faqData";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-700">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 py-20 lg:py-28 z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6">
            <FaEnvelope className="animate-pulse" /> Contact Us
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight text-slate-900 dark:text-white">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-600">Touch</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Have questions about our platform? Need help with your interview preparation? We're here every step of the way.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          id="contact-form"
          className="mb-20"
        >
          <ContactForm />
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FAQ
            title="Frequently Asked Questions"
            subtitle="Explore answers to the most common questions."
            faqs={faqData}
            allowMultipleOpen={false}
          />
        </motion.div>
      </main>
    </div>
  );
}
