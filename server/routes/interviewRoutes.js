import express from "express";
import prisma from "../config/prisma.js";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import pdfParse from "pdf-parse";
import {
	summarizeResumeText,
	generateQuestions,
	analyzeAnswer,
	interviewSummary,
} from "../services/aiService.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
	"/setup",
	firebaseAuthMiddleware,
	upload.single("resume"),
	async (req, res) => {
		try {
			if (!req.body || !req.body.interviewName) {
				return res
					.status(400)
					.json({ error: "Incomplete form submission" });
			}
			const {
				interviewName,
				numOfQuestions,
				interviewType,
				role,
				experienceLevel,
				companyName,
				companyDescription,
				jobDescription,
				focusAt,
			} = req.body;
			const firebaseUID = req.firebaseUser?.uid;
			const user = await prisma.user.findUnique({ where: { firebase_user_id: firebaseUID } });
			if (!user) return res.status(404).json({ error: "User not found" });

			let resume_link = null;
			let resume_text = null;
			if (req.file && req.file.buffer) {
				const streamUpload = () =>
					new Promise((resolve, reject) => {
						const stream = cloudinary.uploader.upload_stream(
							{
								resource_type: "raw",
								folder: "laarai/resumes",
							},
							(error, result) => {
								if (error) return reject(error);
								resolve(result);
							}
						);
						streamifier
							.createReadStream(req.file.buffer)
							.pipe(stream);
					});

				try {
					const result = await streamUpload();
					resume_link = result.secure_url;
				} catch (uploadErr) {
					return res
						.status(500)
						.json({ error: "Cloudinary upload failed" });
				}
				const pdfData = await pdfParse(req.file.buffer);
				resume_text = pdfData.text.slice(0, 4000);
			}

			let resumeSummary = null;
			if (resume_text) {
				try {
					resumeSummary = await summarizeResumeText(resume_text);
				} catch (err) {
					return res
						.status(500)
						.json({ error: "Resume summarization failed" });
				}
			}

			let questions;
			try {
				questions = await generateQuestions({
					num_of_questions: parseInt(numOfQuestions) || 3,
					interview_type: interviewType,
					role,
					experience_level: experienceLevel,
					company_name: companyName,
					company_description: companyDescription,
					job_description: jobDescription,
					focus_area: focusAt,
				});
			} catch (err) {
				return res
					.status(500)
					.json({ error: "Question generation failed" });
			}

			if (!questions || questions.length === 0) {
				return res
					.status(400)
					.json({ error: "Failed to generate questions" });
			}

			const interview = await prisma.interview.create({
				data: {
					user_id: user.id,
					interview_name: interviewName,
					num_of_questions: parseInt(numOfQuestions) || 3,
					interview_type: interviewType.toLowerCase(),
					role,
					experience_level: experienceLevel.toLowerCase(),
					company_name: companyName,
					company_description: companyDescription,
					job_description: jobDescription,
					resume_link,
					focus_area: focusAt,
					questions,
				}
			});

			// Overcome frontend _id expectations by adding _id
			const responseInterview = { ...interview, _id: interview.id };

			res.status(201).json({
				message: "Interview setup successfully",
				interview: responseInterview,
			});
		} catch (err) {
			console.error("Setup interview error:", err);
			res.status(500).json({ error: "Failed to set up interview" });
		}
	}
);

router.get("/:interviewId", async (req, res) => {
	const interview = await prisma.interview.findUnique({ where: { id: req.params.interviewId } });
	if(!interview) return res.status(404).json({ error: "Not found" });
	res.json({ ...interview, _id: interview.id });
});

router.post("/:interviewId/answer", firebaseAuthMiddleware, async (req, res) => {
	try {
		const { questionId, answer } = req.body;
		const interview = await prisma.interview.findUnique({ where: { id: req.params.interviewId } });
		if(!interview) return res.status(404).json({ error: "Interview not found" });
		
		const question = interview.questions[questionId];

		// Analyze user's answer using AI
		const { score, feedback } = await analyzeAnswer({
			question: question.question,
			userAnswer: answer,
			preferredAnswer: question.preferred_answer,
			role: interview.role,
			experience_level: interview.experience_level,
			interview_type: interview.interview_type,
		});

		// Fetch or create report
		let report = await prisma.report.findFirst({ where: { interviewId: req.params.interviewId } });
		
		let answers = report && Array.isArray(report.answers) ? [...report.answers] : [];
		
		answers.push({
			question: question.question,
			userAnswer: answer,
			preferredAnswer: question.preferred_answer,
			score,
			feedback,
		});

		let reportUpdateData = { answers };

		const totalQuestions = interview.num_of_questions;
		const totalAnswered = answers.length;

		if (totalAnswered === totalQuestions) {
			const avgScore = answers.reduce((sum, ans) => sum + ans.score, 0) / answers.length;

			const combinedFeedback = answers.map((a) => a.feedback).join("\n");
			const summaryText = await interviewSummary(combinedFeedback);

			const extractSection = (label) => {
				const match = summaryText.match(
					new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*|$)`, "i")
				);
				return match ? match[1].trim() : "";
			};

			reportUpdateData.finalScore = avgScore;
			reportUpdateData.strengths = [extractSection("Strengths")].filter(Boolean);
			reportUpdateData.areaOfImprovement = [extractSection("Areas of Improvement")].filter(Boolean);
			reportUpdateData.summary = extractSection("Overall Summary");
		}

		if (!report) {
			report = await prisma.report.create({
				data: {
					interviewId: req.params.interviewId,
					userId: interview.user_id,
					...reportUpdateData
				}
			});
		} else {
			report = await prisma.report.update({
				where: { id: report.id },
				data: reportUpdateData
			});
		}

		res.status(201).json({ success: true });
	} catch (err) {
		console.error("Answer evaluation error:", err);
		res.status(500).json({ error: "Evaluation failed" });
	}
});

router.get("/", firebaseAuthMiddleware, async (req, res) => {
	const decodedToken = req.firebaseUser;
	if (!decodedToken || !decodedToken.uid) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const user = await prisma.user.findUnique({
		where: { firebase_user_id: decodedToken.uid },
	});
	if(!user) return res.status(404).json({ error: "User not found" });

	const interviews = await prisma.interview.findMany({ where: { user_id: user.id } });
	const formattedInterviews = interviews.map(i => ({ ...i, _id: i.id }));
	res.json(formattedInterviews);
});

export default router;
