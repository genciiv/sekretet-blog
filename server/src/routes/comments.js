import express from "express";
import crypto from "node:crypto";
import validator from "validator";
import Comment from "../models/Comment.js";
import EmailToken from "../models/EmailToken.js";
import { sendVerifyEmail } from "../utils/mailer.js";

const router = express.Router();

function isSmtpConfigured() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If user left placeholders, treat as not configured
  const looksPlaceholder =
    !user ||
    !pass ||
    user.includes("your_email") ||
    pass.includes("your_app_password");

  return !!host && !looksPlaceholder;
}

/**
 * GET /api/posts/:slug/comments
 * Public: only approved + verified
 */
router.get("/posts/:slug/comments", async (req, res) => {
  try {
    const slug = req.params.slug;
    const items = await Comment.find({
      postSlug: slug,
      status: "approved",
      emailVerified: true,
    })
      .sort({ createdAt: -1 })
      .select("name message createdAt");

    res.json({ items });
  } catch (e) {
    console.error("❌ GET comments failed:", e?.message || e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/posts/:slug/comments
 * Create comment => pending + send email verify link
 */
router.post("/posts/:slug/comments", async (req, res) => {
  try {
    const slug = req.params.slug;
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const cleanName = String(name).trim();
    const cleanMsg = String(message).trim();

    if (cleanName.length < 2 || cleanName.length > 60) {
      return res.status(400).json({ message: "Invalid name length" });
    }
    if (cleanMsg.length < 3 || cleanMsg.length > 1000) {
      return res.status(400).json({ message: "Invalid message length" });
    }

    // Create comment
    const comment = await Comment.create({
      postSlug: slug,
      name: cleanName,
      email: cleanEmail,
      message: cleanMsg,
      status: "pending",
      emailVerified: false,
      ip:
        req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "",
      userAgent: req.headers["user-agent"] || "",
    });

    // Create token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await EmailToken.create({
      commentId: comment._id,
      token,
      expiresAt,
    });

    const appOrigin =
      process.env.APP_ORIGIN || process.env.CLIENT_ORIGIN || "http://localhost:5173";
    const verifyUrl = `${appOrigin}/verify-email?token=${token}`;

    // If SMTP not configured (DEV), return verifyUrl so you can test flow
    if (!isSmtpConfigured()) {
      console.warn("⚠️ SMTP not configured. Returning verifyUrl in response (DEV mode).");
      return res.status(201).json({
        ok: true,
        dev: true,
        message:
          "Comment received. SMTP not configured, use verifyUrl to verify email (DEV).",
        verifyUrl,
      });
    }

    // Send verification email
    try {
      await sendVerifyEmail({ to: cleanEmail, verifyUrl });
    } catch (e) {
      console.error("❌ Email send failed:", e?.message || e);

      // cleanup to avoid stuck pending comments
      await EmailToken.deleteMany({ commentId: comment._id });
      await Comment.findByIdAndDelete(comment._id);

      return res.status(500).json({ message: "Failed to send verification email" });
    }

    return res.status(201).json({
      ok: true,
      message: "Comment received. Please verify your email to continue.",
    });
  } catch (e) {
    console.error("❌ POST comment failed:", e?.message || e);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/comments/verify?token=...
 * Verify email => emailVerified=true (still pending until admin approve)
 */
router.get("/comments/verify", async (req, res) => {
  try {
    const token = String(req.query.token || "").trim();
    if (!token) return res.status(400).json({ message: "Missing token" });

    const doc = await EmailToken.findOne({ token });
    if (!doc) return res.status(400).json({ message: "Invalid or expired token" });
    if (doc.usedAt) return res.status(400).json({ message: "Token already used" });
    if (doc.expiresAt.getTime() < Date.now()) return res.status(400).json({ message: "Token expired" });

    const comment = await Comment.findById(doc.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.emailVerified = true;
    await comment.save();

    doc.usedAt = new Date();
    await doc.save();

    res.json({ ok: true });
  } catch (e) {
    console.error("❌ VERIFY failed:", e?.message || e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
