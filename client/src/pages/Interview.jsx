import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toast";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import CodeEditor from '../components/CodeEditor';

import { 
	FaMicrophone, 
	FaArrowRight, 
	FaStop, 
	FaClock,
	FaCheckCircle,
	FaChartBar,
	FaVolumeUp,
	FaVideo,
	FaShieldAlt
} from "react-icons/fa";

// New feature imports
import { analyzeSpeech } from "../utils/speechAnalysis";
import ConfidenceHeatmap from "../components/ConfidenceHeatmap";
import { useProctoring } from "../hooks/useProctoring";
import ViolationAlert from "../components/ViolationAlert";

const SpeechRecognition =
	window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export default function Interview() {
	const { interviewId } = useParams();
	const [questions, setQuestions] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState("");
	const [totalTime, setTotalTime] = useState(0);
	const [isRecording, setIsRecording] = useState(false);
	const [toast, setToast] = useState({
		show: false,
		message: "",
		type: "success",
	});

	// New feature states
	const [transcriptWords, setTranscriptWords] = useState([]);
	const [analyzedWords, setAnalyzedWords] = useState([]);
	const [stats, setStats] = useState(null);
	const [audioLevel, setAudioLevel] = useState(0);

	const [loading, setLoading] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

	// Proctoring integration
	const {
		videoRef,
		canvasRef,
		violations,
		violationCounts,
		isModelLoaded,
		resetViolations
	} = useProctoring(isRecording);

	const [showViolationAlert, setShowViolationAlert] = useState(false);

	// Show alert when violation detected
	useEffect(() => {
		if (violations.noFaceDetected || violations.multiplePeople || violations.phoneDetected) {
			setShowViolationAlert(true);
		}
	}, [violations]);

	const showToast = (message, type) => {
		setToast({ show: true, message, type });
	};

	const hideToast = () => {
		setToast((prev) => ({ ...prev, show: false }));
	};

	const speakQuestion = (text) => {
		const utterance = new SpeechSynthesisUtterance(text);
		window.speechSynthesis.speak(utterance);
	};

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/interview/${interviewId}`
				);
				setQuestions(res.data.questions);
				if (res.data.questions.length > 0) {
					speakQuestion(res.data.questions[0].question);
				}
			} catch (err) {
				showToast(err.message || "Failed to load questions.", "error");
			}
		};
		fetchQuestions();
	}, [interviewId]);

	useEffect(() => {
		const totalTimer = setInterval(() => {
			setTotalTime((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(totalTimer);
	}, []);

	// Simulate audio level for visual effect
	useEffect(() => {
		let interval;
		if (isRecording) {
			interval = setInterval(() => {
				setAudioLevel(Math.random() * 100);
			}, 100);
		} else {
			setAudioLevel(0);
		}
		return () => clearInterval(interval);
	}, [isRecording]);

	const formatTotalTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;
		return {
			hours: hours.toString().padStart(2, "0"),
			minutes: minutes.toString().padStart(2, "0"),
			seconds: remainingSeconds.toString().padStart(2, "0"),
		};
	};

	const startRecording = () => {
		if (!recognition) {
			showToast(
				"Speech Recognition not supported in this browser.",
				"error"
			);
			return;
		}

		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "en-US";

		recognition.onstart = () => {
			setIsRecording(true);
		};

		recognition.onerror = (event) => {
			console.error("Speech recognition error:", event.error);
			setIsRecording(false);
			showToast("Error during speech recognition", "error");
		};

		recognition.onend = () => {
			setIsRecording(false);
		};

		recognition.onresult = (event) => {
			let newWords = [];

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const result = event.results[i];
				
				if (!result.isFinal) continue;

				const transcript = result[0].transcript;
				const confidence = result[0].confidence;

				const words = transcript.trim().split(/\s+/);
				const baseTime = Date.now() / 1000;

				words.forEach((word, idx) => {
					newWords.push({
						word,
						confidence,
						time: baseTime + idx * 0.4, 
					});
				});
			}

			if (newWords.length === 0) return;

			setTranscriptWords((prev) => {
				const combined = [...prev, ...newWords];
				const { analyzedWords, stats } = analyzeSpeech(combined);
				setAnalyzedWords(analyzedWords);
				setStats(stats);
				return combined;
			});

			setAnswer((prev) => prev + " " + newWords.map(w => w.word).join(" "));
		};

		recognition.start();
	};

	const stopRecording = () => {
		if (recognition) {
			recognition.stop();
		}
	};

	const submitAnswer = async () => {
		try {
			setLoading(true);
			await axios.post(
				`${import.meta.env.VITE_API_URL}/api/interview/${interviewId}/answer`,
				{
					questionId: currentQuestionIndex,
					answer,
				}
			);

			if (currentQuestionIndex < questions.length - 1) {
				const nextIndex = currentQuestionIndex + 1;
				setCurrentQuestionIndex(nextIndex);
				setAnswer("");
				setTranscriptWords([]);
				setAnalyzedWords([]);
				setStats(null);
				speakQuestion(questions[nextIndex].question);
			} else {
				showToast("Interview Completed!", "success");
				navigate(`/interview/report/${interviewId}`);
			}
		} catch (err) {
			showToast(err.message || "Failed to submit answer.", "error");
		} finally {
			setLoading(false);
		}
	};

	const totalTimeFormatted = formatTotalTime(totalTime);
	const currentQuestion = questions[currentQuestionIndex];
	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

	if (loading) {
		return <LoadingScreen message="Analyzing your Answer..." showProgress />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] pt-24">
			<AnimatePresence>
				{toast.show && (
					<Toast
						message={toast.message}
						type={toast.type}
						onClose={hideToast}
					/>
				)}
			</AnimatePresence>

			{/* Violation Alert */}
			{showViolationAlert && (
				<ViolationAlert
					violations={violations}
					onDismiss={() => {
						setShowViolationAlert(false);
						resetViolations();
					}}
				/>
			)}

			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				{/* Header Section */}
				<motion.div 
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-6"
				>
					<h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-2">
						Mock Interview Session
					</h1>
					<p className="text-base text-slate-600 dark:text-slate-400 font-medium">
						Practice with AI-powered feedback in real-time
					</p>
				</motion.div>

				{/* Progress Bar */}
				<motion.div 
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-200 dark:border-slate-700 shadow-sm"
				>
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
								{currentQuestionIndex + 1}
							</div>
							<div>
								<div className="text-sm font-bold text-slate-900 dark:text-white">
									Question {currentQuestionIndex + 1} of {questions.length}
								</div>
								<div className="text-xs text-slate-500 dark:text-slate-400">
									{Math.round(progress)}% Complete
								</div>
							</div>
						</div>
						
						{/* Timer */}
						<div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
							<FaClock className="text-amber-500" />
							<span className="font-mono font-bold text-slate-900 dark:text-white">
								{totalTimeFormatted.hours}:{totalTimeFormatted.minutes}:{totalTimeFormatted.seconds}
							</span>
						</div>
					</div>
					
					{/* Progress Bar */}
					<div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
						<motion.div 
							initial={{ width: 0 }}
							animate={{ width: `${progress}%` }}
							transition={{ duration: 0.5 }}
							className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
						/>
					</div>
				</motion.div>

				{currentQuestion && (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Question & Answer Section */}
						<div className="lg:col-span-2 space-y-6">
							{/* Question Card */}
							<motion.div 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
										<FaVolumeUp className="text-xl" />
									</div>
									<div className="flex-1">
										<h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
											{currentQuestion.question}
										</h2>
										<p className="text-sm text-slate-500 dark:text-slate-400">
											Take your time and structure your response clearly
										</p>
									</div>
								</div>

								{/* Answer Textarea */}
								<div className="relative">
									<textarea
										disabled={isRecording}
										value={answer}
										onChange={(e) => setAnswer(e.target.value)}
										placeholder="Type your answer here or use voice recording..."
										className={`w-full h-64 p-6 border-2 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-400 resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all ${
											isRecording 
												? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 dark:border-emerald-400" 
												: "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
										}`}
									/>
									
									{/* Recording Indicator Overlay */}
									<AnimatePresence>
										{isRecording && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white shadow-lg"
											>
												<motion.div
													animate={{ scale: [1, 1.2, 1] }}
													transition={{ repeat: Infinity, duration: 1 }}
													className="w-3 h-3 rounded-full bg-white"
												/>
												<span className="text-sm font-bold">Recording...</span>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Audio Level Visualizer */}
									<AnimatePresence>
										{isRecording && (
											<motion.div 
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												className="absolute bottom-4 left-4 right-4 flex items-center gap-1 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-2 border border-emerald-500/30"
											>
												{[...Array(40)].map((_, i) => (
													<motion.div
														key={i}
														animate={{
															height: `${Math.random() * 60 + 20}%`,
														}}
														transition={{
															duration: 0.15,
															repeat: Infinity,
															repeatType: "reverse",
														}}
														className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full"
													/>
												))}
											</motion.div>
										)}
									</AnimatePresence>
								</div>

								{/* Heatmap Component */}
								{!isRecording && analyzedWords.length > 0 && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className="mt-6"
									>
										<ConfidenceHeatmap analyzedWords={analyzedWords} />
									</motion.div>
								)}

								{/* Action Buttons */}
								<div className="flex flex-wrap gap-4 mt-6">
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => {
											if (isRecording) {
												stopRecording();
											} else {
												startRecording();
											}
										}}
										className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all shadow-lg ${
											isRecording
												? "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-xl hover:shadow-red-500/30"
												: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl hover:shadow-emerald-500/30"
										}`}
									>
										{isRecording ? (
											<>
												<FaStop className="text-xl" />
												<span>Stop Recording</span>
											</>
										) : (
											<>
												<FaMicrophone className="text-xl" />
												<span>Start Recording</span>
											</>
										)}
									</motion.button>

									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={submitAnswer}
										disabled={!answer.trim() || isRecording}
										className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
									>
										<span>
											{currentQuestionIndex >= questions.length - 1
												? "Finish Interview"
												: "Next Question"}
										</span>
										<FaArrowRight className="text-xl" />
									</motion.button>
								</div>
							</motion.div>
						</div>

						{/* Sidebar Stats */}
						<div className="lg:col-span-1 space-y-6">
							{/* Proctoring Monitor */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg"
							>
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
										<FaShieldAlt />
									</div>
									<div>
										<h3 className="text-lg font-black text-slate-900 dark:text-white">
											Proctoring
										</h3>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											{isModelLoaded ? "Active" : "Loading..."}
										</p>
									</div>
								</div>

								{/* Camera Feed */}
								<div className="relative rounded-xl overflow-hidden bg-slate-900 mb-4">
									<video
										ref={videoRef}
										className="w-full h-auto"
										autoPlay
										playsInline
										muted
									/>
									<canvas
										ref={canvasRef}
										className="absolute top-0 left-0 w-full h-full"
									/>
									
									{!isModelLoaded && (
										<div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
											<div className="text-white text-sm">Loading model...</div>
										</div>
									)}
								</div>

								{/* Violation Counts */}
								<div className="space-y-2">
									<div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
										<span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
											No Face Detected
										</span>
										<span className="text-sm font-black text-orange-600 dark:text-orange-400">
											{violationCounts.noFace}
										</span>
									</div>
									<div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
										<span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
											Multiple People
										</span>
										<span className="text-sm font-black text-red-600 dark:text-red-400">
											{violationCounts.multiplePeople}
										</span>
									</div>
									<div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
										<span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
											Phone Detected
										</span>
										<span className="text-sm font-black text-red-600 dark:text-red-400">
											{violationCounts.phone}
										</span>
									</div>
								</div>
							</motion.div>

							{/* Stats Card */}
							{stats && (
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg"
								>
									<div className="flex items-center gap-3 mb-6">
										<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
											<FaChartBar />
										</div>
										<h3 className="text-xl font-black text-slate-900 dark:text-white">
											Speech Analysis
										</h3>
									</div>

									<div className="space-y-4">
										<div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
											<div className="text-sm text-amber-600 dark:text-amber-400 font-semibold mb-1">
												Filler Words
											</div>
											<div className="text-3xl font-black text-amber-700 dark:text-amber-300">
												{stats.fillerCount}
											</div>
										</div>

										<div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800">
											<div className="text-sm text-violet-600 dark:text-violet-400 font-semibold mb-1">
												Long Pauses
											</div>
											<div className="text-3xl font-black text-violet-700 dark:text-violet-300">
												{stats.pauseCount}
											</div>
										</div>

										<div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800">
											<div className="text-sm text-pink-600 dark:text-pink-400 font-semibold mb-1">
												Low Confidence
											</div>
											<div className="text-3xl font-black text-pink-700 dark:text-pink-300">
												{stats.lowConfidenceCount}
											</div>
										</div>

										<div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
											<div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
												Confidence Level
											</div>
											<div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
												{stats.confidenceLevel}
											</div>
										</div>
									</div>
								</motion.div>
							)}

							{/* Timer Cards */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1 }}
								className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg"
							>
								<h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
									Session Time
								</h3>
								<div className="grid grid-cols-3 gap-3">
									<div className="text-center p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
										<div className="text-3xl font-black text-slate-900 dark:text-white">
											{totalTimeFormatted.hours}
										</div>
										<div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
											Hours
										</div>
									</div>
									<div className="text-center p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
										<div className="text-3xl font-black text-slate-900 dark:text-white">
											{totalTimeFormatted.minutes}
										</div>
										<div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
											Minutes
										</div>
									</div>
									<div className="text-center p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
										<div className="text-3xl font-black text-slate-900 dark:text-white">
											{totalTimeFormatted.seconds}
										</div>
										<div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
											Seconds
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}