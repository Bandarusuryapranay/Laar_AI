import express from "express";
import prisma from "../config/prisma.js";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
import streamifier from "streamifier";

const router = express.Router();
router.use(express.json());

// Configure multer for memory storage for profile picture uploads
const upload = multer({ storage: multer.memoryStorage() });

// 1. REGISTER ROUTE
router.post("/register", firebaseAuthMiddleware, async (req, res) => {
    const { uid, email, name } = req.firebaseUser;
    try {
        let user = await prisma.user.findUnique({ where: { firebase_user_id: uid } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    firebase_user_id: uid,
                    email,
                    name: name || "Anonymous",
                    tier: "basic",
                }
            });
        }
        res.status(200).json({ message: "Registration successful", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN ROUTE
router.post("/login", firebaseAuthMiddleware, async (req, res) => {
    const { uid } = req.firebaseUser;
    try {
        let user = await prisma.user.findUnique({ where: { firebase_user_id: uid } });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE PROFILE ROUTE (Name & Profile Picture)
router.put("/update-profile", firebaseAuthMiddleware, upload.single("avatar"), async (req, res) => {
    try {
        const { uid } = req.firebaseUser;
        let updateData = {};
        if (req.body.name) updateData.name = req.body.name;

        if (req.file) {
            const streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "laar_ai/profiles" },
                        (error, result) => result ? resolve(result) : reject(error)
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
            const result = await streamUpload(req);
            updateData.avatar = result.secure_url; // Cloudinary URL
        }

        const updatedUser = await prisma.user.update({
            where: { firebase_user_id: uid },
            data: updateData
        });

        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE ACCOUNT ROUTE
router.delete("/delete-account", firebaseAuthMiddleware, async (req, res) => {
    try {
        const { uid } = req.firebaseUser;
        await prisma.user.delete({ where: { firebase_user_id: uid } });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 5. GET CURRENT USER ROUTE
router.get("/me", firebaseAuthMiddleware, async (req, res) => {
    try {
        const { uid } = req.firebaseUser;
        const user = await prisma.user.findUnique({ where: { firebase_user_id: uid } });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;