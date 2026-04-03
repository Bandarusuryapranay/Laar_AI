import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaUsers, FaMobileAlt, FaUserSlash, FaTimes } from "react-icons/fa";

export default function ViolationAlert({ violations, onDismiss }) {
  const hasViolation = violations.noFaceDetected || violations.multiplePeople || violations.phoneDetected;

  if (!hasViolation) return null;

  const getViolationInfo = () => {
    if (violations.noFaceDetected) {
      return {
        icon: <FaUserSlash className="text-5xl" />,
        title: "No Face Detected",
        message: "Please ensure your face is visible to the camera.",
        color: "from-orange-500 to-red-500",
      };
    }
    if (violations.multiplePeople) {
      return {
        icon: <FaUsers className="text-5xl" />,
        title: "Multiple People Detected",
        message: "Only one person should be present during the interview.",
        color: "from-red-500 to-pink-500",
      };
    }
    if (violations.phoneDetected) {
      return {
        icon: <FaMobileAlt className="text-5xl" />,
        title: "Phone Detected",
        message: "Please keep your phone away during the interview.",
        color: "from-red-500 to-orange-500",
      };
    }
  };

  const violationInfo = getViolationInfo();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onDismiss}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Animated Warning Header */}
          <div className={`relative bg-gradient-to-r ${violationInfo.color} p-8 text-center`}>
            {/* Pulsing background effect */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white/20"
            />

            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="relative text-white mb-4"
            >
              {violationInfo.icon}
            </motion.div>

            {/* Warning icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-4 right-4"
            >
              <FaExclamationTriangle className="text-3xl text-white" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 text-center">
              {violationInfo.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">
              {violationInfo.message}
            </p>

            {/* Warning message */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                  <strong>Warning:</strong> Multiple violations may result in interview termination. 
                  Please ensure you follow the guidelines.
                </div>
              </div>
            </div>

            {/* Dismiss button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDismiss}
              className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold transition-all shadow-lg"
            >
              I Understand
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}