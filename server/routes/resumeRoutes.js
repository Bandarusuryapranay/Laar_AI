import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { scoreResumeAgainstJD } from "../services/aiService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/resume/ats-score — upload resume + JD, get ATS score
router.post("/ats-score", upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Resume PDF is required" });
    }
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: "Job description is too short (min 50 characters)" });
    }

    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text.slice(0, 4000);

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ error: "Could not extract text from PDF. Please upload a text-based PDF." });
    }

    const result = await scoreResumeAgainstJD(resumeText, jobDescription);
    res.status(200).json(result);
  } catch (error) {
    console.error("ATS score error:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

export default router;
