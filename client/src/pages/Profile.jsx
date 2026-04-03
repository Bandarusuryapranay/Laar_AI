import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { FaUserCircle, FaEnvelope, FaCrown, FaCalendarAlt, FaEdit, FaKey, FaCamera } from "react-icons/fa";
import ProfileSettings from "../components/ProfileSettings";
import Toast from "../components/Toast";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      setToast({ show: true, message: "Reset link sent to your inbox!", type: "success" });
    } catch (error) {
      setToast({ show: true, message: "Failed to send reset email.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] py-12 px-4 transition-colors duration-700">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl shadow-xl dark:shadow-none border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-slate-800 dark:to-slate-900 px-8 py-16 text-center relative">
            <div className="relative inline-block">
              {user?.photoURL || user?.avatar ? (
                <img 
                  src={user?.avatar || user?.photoURL || "/default-avatar.png"} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-cyan-500 shadow-2xl object-cover" 
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-white opacity-90" />
              )}
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute bottom-1 right-1 bg-white dark:bg-cyan-500 p-2 rounded-full shadow-lg text-blue-600 dark:text-slate-900 hover:scale-110 transition-transform"
              >
                <FaCamera size={16} />
              </button>
            </div>
            <h1 className="mt-6 text-3xl font-black text-white tracking-tight">{user?.displayName || user?.name || "User"}</h1>
            <div className="inline-flex items-center gap-2 mt-2 px-4 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest text-white">
              <FaCrown className="text-amber-400" /> {user?.tier || "Basic"} Member
            </div>
          </div>

          <div className="p-10">
            {isEditing ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Ensure ProfileSettings handles both Auth and DB updates */}
                <ProfileSettings onComplete={() => setIsEditing(false)} />
                <button 
                  onClick={() => setIsEditing(false)}
                  className="mt-6 w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InfoBox icon={<FaEnvelope />} label="Email" value={user?.email} color="text-blue-500" />
                  <InfoBox icon={<FaCalendarAlt />} label="Joined" value={formatDate(user?.metadata?.creationTime || user?.created_at)} color="text-emerald-500" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-orange-600 dark:bg-[#2563EB] text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                  <button 
                    onClick={handlePasswordReset}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black py-4 px-6 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <FaKey /> Reset Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoBox({ icon, label, value, color }) {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
      <div className={`p-3 bg-white dark:bg-white/10 rounded-xl shadow-sm ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-slate-900 dark:text-white font-bold">{value || "Not Set"}</p>
      </div>
    </div>
  );
}