import express from "express";
import { generateCodingChallenge, generateCodingHint } from "../services/aiService.js";

const router = express.Router();

const VALID_TOPICS = [
  "Arrays", "Strings", "Linked Lists", "Trees", "Graphs",
  "Dynamic Programming", "Recursion", "Sorting", "Stacks & Queues", "Hashing"
];
const VALID_DIFFICULTIES = ["Easy", "Medium", "Hard"];

// POST /api/coding/generate — generate a coding challenge
router.post("/generate", async (req, res) => {
  try {
    const { topic = "Arrays", difficulty = "Easy" } = req.body;

    if (!VALID_TOPICS.includes(topic)) {
      return res.status(400).json({ error: `Invalid topic. Choose from: ${VALID_TOPICS.join(", ")}` });
    }
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ error: `Invalid difficulty. Choose: Easy, Medium, or Hard` });
    }

    const challenge = await generateCodingChallenge({ topic, difficulty });
    res.status(200).json(challenge);
  } catch (error) {
    console.error("Coding challenge error:", error);
    res.status(500).json({ error: "Failed to generate coding challenge" });
  }
});

// POST /api/coding/hint — get AI hint for a coding problem
router.post("/hint", async (req, res) => {
  try {
    const { problem, userCode, language = "python" } = req.body;

    if (!problem) {
      return res.status(400).json({ error: "Problem description is required" });
    }

    const hint = await generateCodingHint({ problem, userCode, language });
    res.status(200).json({ hint });
  } catch (error) {
    console.error("Hint generation error:", error);
    res.status(500).json({ error: "Failed to generate hint" });
  }
});

export default router;
