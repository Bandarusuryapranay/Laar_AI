import express from "express";
import { generateAptitudeQuestions } from "../services/aiService.js";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";

const router = express.Router();

// POST /api/aptitude/generate — generate a timed aptitude test
router.post("/generate", firebaseAuthMiddleware, async (req, res) => {
  try {
    const { category, count = 10 } = req.body;

    const validCategories = [
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Verbal Ability",
      "Data Interpretation",
    ];

    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Choose from: ${validCategories.join(", ")}`,
      });
    }

    const questions = await generateAptitudeQuestions({
      category,
      count: Math.min(Number(count), 15),
    });

    res.status(200).json({ questions, category, generatedAt: new Date() });
  } catch (error) {
    console.error("Aptitude generate error:", error);
    res.status(500).json({ error: "Failed to generate aptitude test" });
  }
});

export default router;
