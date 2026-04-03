import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaArrowRight,
    FaArrowLeft,
    FaUpload,
    FaFileAlt,
    FaTimes,
    FaCheckCircle,
    FaBriefcase,
    FaUser,
    FaClipboardList,
} from "react-icons/fa";
import Toast from "../components/Toast";

export default function SetupForm() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false); // Local loading state
    const [currentStep, setCurrentStep] = useState(1);
    const [drag, setDrag] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        console.log("--------\nCurrent user from context:", user, "\n--------");
    }, [user]);
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        interviewName: "",
        numOfQuestions: 5,
        interviewType: "Technical",
        role: "",
        experienceLevel: "Fresher",
        companyName: "",
        companyDescription: "",
        jobDescription: "",
        resume: null,
        focusAt: "",
    });

    const totalSteps = 3;
    const progressPercentage = (currentStep / totalSteps) * 100;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDrag(true);
        } else if (e.type === "dragleave") {
            setDrag(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") {
                handleInputChange("resume", file);
            } else {
                showToast("Please upload a PDF file", "error");
            }
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === "application/pdf") {
                handleInputChange("resume", file);
            } else {
                showToast("Please upload a PDF file", "error");
            }
        }
    };

    const removeFile = () => {
        handleInputChange("resume", null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            console.error("❌ User is null in CreateInterview.jsx");
            showToast("Please log in to continue", "error");
            return;
        }
        
        setLoading(true);
        
        try {
            const token = await user.getIdToken();

            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            console.log("📤 Submitting interview setup with data:", {
                interviewName: formData.interviewName,
                numOfQuestions: formData.numOfQuestions,
                interviewType: formData.interviewType,
                role: formData.role,
                experienceLevel: formData.experienceLevel,
                companyName: formData.companyName,
                hasResume: !!formData.resume,
                resumeName: formData.resume?.name,
                focusAt: formData.focusAt
            });

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/interview/setup`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log("✅ Interview created successfully:", res.data);
            showToast("Interview setup complete!", "success");
            const interviewId = res.data.interview._id;
            setTimeout(() => {
                navigate(`/interview/${interviewId}`);
            }, 1000);
        } catch (err) {
            console.error("❌ Error in setup:", err);
            console.error("❌ Error response:", err.response?.data);
            console.error("❌ Error status:", err.response?.status);
            
            const errorMessage = err.response?.data?.message 
                || err.response?.data?.error 
                || err.message 
                || "Something went wrong. Please try again.";
            
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    // Validation for each step
    const isStep1Valid = formData.interviewName.trim() !== "";
    const isStep2Valid = formData.role.trim() !== "" && 
                         formData.companyName.trim() !== "" && 
                         formData.jobDescription.trim() !== "";
    const isStep3Valid = formData.resume !== null && formData.focusAt.trim() !== "";

    const stepIcons = [
        { icon: <FaClipboardList />, label: "Basics" },
        { icon: <FaBriefcase />, label: "Job Details" },
        { icon: <FaUser />, label: "Resume" }
    ];

    if (loading) {
        return <LoadingScreen message="Setting up your interview..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] pt-24 py-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl" />
            </div>

            <AnimatePresence>
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-2">
                        Setup Your Interview
                    </h1>
                    <p className="text-base text-slate-600 dark:text-slate-400">
                        Let's customize your practice session
                    </p>
                </motion.div>

                {/* Step Indicators */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        {stepIcons.map((step, index) => {
                            const stepNumber = index + 1;
                            const isActive = currentStep === stepNumber;
                            const isCompleted = currentStep > stepNumber;
                            
                            return (
                                <div key={stepNumber} className="flex-1 flex items-center">
                                    <div className="flex flex-col items-center flex-1">
                                        <motion.div 
                                            animate={{
                                                scale: isActive ? 1.1 : 1,
                                            }}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all ${
                                                isCompleted
                                                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                                                    : isActive
                                                    ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                                                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                            }`}
                                        >
                                            {isCompleted ? <FaCheckCircle /> : step.icon}
                                        </motion.div>
                                        <span className={`text-xs font-semibold mt-2 ${
                                            isActive ? "text-violet-600 dark:text-violet-400" : "text-slate-500 dark:text-slate-400"
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < stepIcons.length - 1 && (
                                        <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                                            currentStep > stepNumber
                                                ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                                                : "bg-slate-200 dark:bg-slate-700"
                                        }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Step {currentStep} of {totalSteps}
                            </span>
                            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                                {Math.round(progressPercentage)}% Complete
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Form Container */}
                <motion.div 
                    layout
                    className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: Interview Basics */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-6 lg:p-8"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                        Interview Basics
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Let's start with the fundamentals
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Interview Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.interviewName}
                                            onChange={(e) => handleInputChange("interviewName", e.target.value)}
                                            placeholder="e.g. Frontend Role at Google"
                                            className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-violet-500/20 transition-all dark:bg-slate-900 dark:text-white ${
                                                formData.interviewName !== ""
                                                    ? "border-slate-300 dark:border-slate-600 focus:border-violet-500"
                                                    : "border-red-300 dark:border-red-500/50 focus:border-red-500"
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Number of Questions
                                        </label>
                                        <select
                                            value={formData.numOfQuestions}
                                            onChange={(e) => handleInputChange("numOfQuestions", parseInt(e.target.value))}
                                            className="w-full px-4 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:bg-slate-900 dark:text-white"
                                        >
                                            {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} Questions
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                                            Interview Type
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {["Technical", "Behavioral", "Mixed"].map((type) => (
                                                <motion.button
                                                    key={type}
                                                    type="button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleInputChange("interviewType", type)}
                                                    className={`px-4 py-4 rounded-xl border-2 transition-all font-bold ${
                                                        formData.interviewType === type
                                                            ? "border-violet-500 bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 shadow-lg shadow-violet-500/20"
                                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:border-slate-400"
                                                    }`}
                                                >
                                                    {type}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleNext}
                                        disabled={!isStep1Valid}
                                        className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl ${
                                            !isStep1Valid ? "opacity-50 cursor-not-allowed hover:scale-100" : "hover:shadow-violet-500/30"
                                        }`}
                                    >
                                        <span>Next Step</span>
                                        <FaArrowRight />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Job Details */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-6 lg:p-8"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                        Job Details
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Tell us about the role you're preparing for
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Role *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={(e) => handleInputChange("role", e.target.value)}
                                            placeholder="e.g. Software Engineer"
                                            className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-violet-500/20 transition-all dark:bg-slate-900 dark:text-white ${
                                                formData.role !== ""
                                                    ? "border-slate-300 dark:border-slate-600 focus:border-violet-500"
                                                    : "border-red-300 dark:border-red-500/50 focus:border-red-500"
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                                            Experience Level
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {["Fresher", "Junior", "Mid", "Senior"].map((level) => (
                                                <motion.button
                                                    key={level}
                                                    type="button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleInputChange("experienceLevel", level)}
                                                    className={`px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                                                        formData.experienceLevel === level
                                                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                                            : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-400"
                                                    }`}
                                                >
                                                    {level}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Company Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                                            placeholder="e.g. Tech Innovations Inc"
                                            className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-violet-500/20 transition-all dark:bg-slate-900 dark:text-white ${
                                                formData.companyName !== ""
                                                    ? "border-slate-300 dark:border-slate-600 focus:border-violet-500"
                                                    : "border-red-300 dark:border-red-500/50 focus:border-red-500"
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Job Description *
                                        </label>
                                        <textarea
                                            value={formData.jobDescription}
                                            onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                                            placeholder="Paste the complete job description here..."
                                            rows={6}
                                            className={`w-full px-4 py-4 border-2 rounded-xl resize-none focus:ring-4 focus:ring-violet-500/20 transition-all dark:bg-slate-900 dark:text-white ${
                                                formData.jobDescription !== ""
                                                    ? "border-slate-300 dark:border-slate-600 focus:border-violet-500"
                                                    : "border-red-300 dark:border-red-500/50 focus:border-red-500"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleBack}
                                        className="flex items-center gap-3 px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                    >
                                        <FaArrowLeft />
                                        <span>Back</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleNext}
                                        disabled={!isStep2Valid}
                                        className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg ${
                                            !isStep2Valid ? "opacity-50 cursor-not-allowed hover:scale-100" : "hover:shadow-xl hover:shadow-violet-500/30"
                                        }`}
                                    >
                                        <span>Next Step</span>
                                        <FaArrowRight />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Resume & Focus */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-6 lg:p-8"
                            >
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                        Final Details
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Upload your resume and specify focus areas
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                                            Resume (PDF) *
                                        </label>
                                        {!formData.resume ? (
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                                                    drag
                                                        ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
                                                        : "border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500"
                                                }`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                                    <FaUpload className="text-3xl" />
                                                </div>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                    Drop your resume here
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                    or click to browse
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-500">
                                                    PDF files only, max 10MB
                                                </p>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="border-2 border-emerald-500 dark:border-emerald-400 rounded-2xl p-6 bg-emerald-50 dark:bg-emerald-500/10"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                                                            <FaFileAlt className="text-xl" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white">
                                                                {formData.resume.name}
                                                            </p>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                {(formData.resume.size / 1024).toFixed(2)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={removeFile}
                                                        className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-all flex items-center justify-center"
                                                    >
                                                        <FaTimes />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Focus Areas *
                                        </label>
                                        <textarea
                                            value={formData.focusAt}
                                            onChange={(e) => handleInputChange("focusAt", e.target.value)}
                                            placeholder="e.g. React, TypeScript, System Design, Behavioral Questions"
                                            rows={5}
                                            className={`w-full px-4 py-4 border-2 rounded-xl resize-none focus:ring-4 focus:ring-violet-500/20 transition-all dark:bg-slate-900 dark:text-white ${
                                                formData.focusAt !== ""
                                                    ? "border-slate-300 dark:border-slate-600 focus:border-violet-500"
                                                    : "border-red-300 dark:border-red-500/50 focus:border-red-500"
                                            }`}
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            Specify technologies, frameworks, or topics you want to focus on
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleBack}
                                        className="flex items-center gap-3 px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                    >
                                        <FaArrowLeft />
                                        <span>Back</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSubmit}
                                        disabled={!isStep3Valid}
                                        className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold transition-all shadow-lg ${
                                            !isStep3Valid ? "opacity-50 cursor-not-allowed hover:scale-100" : "hover:shadow-xl hover:shadow-emerald-500/30"
                                        }`}
                                    >
                                        <span>Start Interview</span>
                                        <FaArrowRight />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}