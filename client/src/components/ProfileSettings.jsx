import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase"; 
import { updateProfile } from "firebase/auth"; 
import Toast from "./Toast";
import { FaUserEdit, FaCloudUploadAlt, FaSpinner, FaCheckCircle } from "react-icons/fa";

export default function ProfileSettings({ onComplete }) {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || user?.displayName || "");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Cleanup object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser) throw new Error("Session expired. Please log in again.");
            
            // 1. Get a fresh token
            const token = await firebaseUser.getIdToken(true);

            // 2. Prepare Multipart Form Data for Backend
            const formData = new FormData();
            formData.append("name", name);
            if (file) {
                formData.append("avatar", file); 
            }

            // 3. Define Config (THIS FIXES THE REFERENCE ERROR)
            const config = {
                headers: { 
                    Authorization: `Bearer ${token}` 
                    // Browser automatically sets Content-Type for FormData
                }
            };

            const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

            // 4. Update Backend (MongoDB)
            const res = await axios.put(
                `${baseURL}/api/auth/update-profile`, 
                formData, 
                config
            );

            // Access the updated user data from the backend response
            const updatedUserData = res.data.user;

            // 5. Sync Firebase Auth Client Profile
            // This updates the photo for your Header/Navbar immediately
            await updateProfile(firebaseUser, {
                displayName: name,
                photoURL: updatedUserData.avatar || updatedUserData.photoURL 
            });

            // 6. Update Global Auth Context
            // We merge to ensure the UID is preserved so the Dashboard can fetch data
            setUser((prev) => ({ 
                ...prev, 
                ...updatedUserData,
                displayName: name, // Ensure Firebase field matches
                photoURL: updatedUserData.avatar // Ensure Firebase field matches
            })); 
            
            setToast({ show: true, message: "Profile Synced Successfully!", type: "success" });
            
            if (onComplete) {
                setTimeout(onComplete, 1500);
            }
        } catch (err) {
            console.error("Profile Update Error:", err);
            setToast({ 
                show: true, 
                message: err.response?.data?.error || "Failed to update profile", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 transition-all shadow-xl">
            {toast.show && <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />}
            
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-orange-100 dark:bg-cyan-500/10 rounded-2xl text-orange-600 dark:text-cyan-400">
                    <FaUserEdit size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">Edit Profile</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Personalize your identity</p>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="flex justify-center">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-white/10 bg-slate-100 dark:bg-white/5 shadow-inner">
                            <img 
                                src={preview || user?.avatar || user?.photoURL || "/placeholder-user.png"} 
                                className="w-full h-full object-cover" 
                                alt="Profile Preview" 
                            />
                        </div>
                        <label className="absolute bottom-1 right-1 p-2.5 bg-orange-600 dark:bg-[#2563EB] text-white rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg">
                            <FaCloudUploadAlt size={16} />
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                        Display Name
                    </label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-orange-500 dark:focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-orange-600 dark:bg-[#2563EB] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                    {loading ? "Saving..." : "Save Identity"}
                </button>
            </form>
        </div>
    );
}