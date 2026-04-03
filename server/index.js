console.log(">>> Starting server...");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import admin from "firebase-admin";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json());

// Database Connection
connectDB()
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Database connection failed:", error));

// Firebase Admin Initialization
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log("🔥 Firebase initialized successfully");

// Health Check Route (Use this to test if 404 is a global issue)
app.get("/", (req, res) => res.send("Laar AI API is running..."));

// Routing
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import aptitudeRoutes from "./routes/aptitudeRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// AI Generation Rate Limiter (Protects API Key Quotas)
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 generation requests per `window`
  message: { error: "Too many AI generation requests, please try again after a minute." }
});

// Mount Routers
app.use("/api/auth", authRoutes);
app.use("/api/interview", aiLimiter, interviewRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/aptitude", aiLimiter, aptitudeRoutes);
app.use("/api/coding", aiLimiter, codingRoutes);
app.use("/api/resume", aiLimiter, resumeRoutes);

// Starting the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`--- DEBUG: SERVER IS DEFINITELY ALIVE ON PORT ${PORT} ---`);
});