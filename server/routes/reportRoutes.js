import express from "express";
import prisma from "../config/prisma.js";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import { generateDashboardInsight } from "../services/aiService.js";

const router = express.Router();

// GET /api/report/insight — dynamic AI strategy note based on user's performance
router.get("/insight", firebaseAuthMiddleware, async (req, res) => {
  try {
    const decodedToken = req.firebaseUser;
    if (!decodedToken || !decodedToken.uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({ where: { firebase_user_id: decodedToken.uid } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const reports = await prisma.report.findMany({ 
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const insight = await generateDashboardInsight(reports);
    res.json({ insight });
  } catch (error) {
    console.error("Insight generation error:", error);
    res.status(500).json({ error: "Failed to generate insight" });
  }
});

router.get("/:interviewId", async (req, res) => {
  const report = await prisma.report.findFirst({ where: { interviewId: req.params.interviewId } });
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }
  res.json(report);
});

router.get("/", firebaseAuthMiddleware, async(req, res) => {
  const decodedToken = req.firebaseUser;
  if (!decodedToken || !decodedToken.uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({ where: { firebase_user_id: decodedToken.uid } });
  if (!user) return res.status(404).json({ error: "User not found" });
  
  const reports = await prisma.report.findMany({ 
    where: { userId: user.id || undefined },
    include: { interview: true },
    orderBy: { createdAt: 'desc' }
  });
  
  // Format for frontend which might expect `interviewId` to be the populated object
  const formattedReports = reports.map(r => ({
    ...r,
    interviewId: r.interview,
    _id: r.id
  }));

  res.json(formattedReports);
});

export default router;
