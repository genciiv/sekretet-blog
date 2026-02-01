import express from "express";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import nodemailer from "nodemailer";

import Post from "../models/Post.js";
import ContactMessage from "../models/ContactMessage.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import upload from "../utils/upload.js";

const router = express.Router();

/* ================= ADMIN LOGIN ================= */

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

/* ================= CONTACTS (ADMIN) ================= */

const ALLOWED = ["new", "answered", "closed"];

// LIST
router.get("/admin/contacts", requireAdmin, async (req, res) => {
  const status = String(req.query.status || "all");
  const q = String(req.query.q || "").trim();

  const filter = {};
  if (status !== "all" && ALLOWED.includes(status)) {
    filter.status = status;
  }

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { message: { $regex: q, $options: "i" } },
    ];
  }

  const items = await ContactMessage.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

// UPDATE STATUS
router.put("/admin/contacts/:id", requireAdmin, async (req, res) => {
  const next = String(req.body.status || "");

  if (!ALLOWED.includes(next)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const item = await ContactMessage.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  item.status = next;
  await item.save();

  res.json({ ok: true });
});

// DELETE
router.delete("/admin/contacts/:id", requireAdmin, async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// REPLY SMTP
router.post("/admin/contacts/:id/reply", requireAdmin, async (req, res) => {
  const subject = String(req.body.subject || "Përgjigje nga Sekretet");
  const body = String(req.body.body || "").trim();

  if (!body) {
    return res.status(400).json({ message: "Reply message is required" });
  }

  const item = await ContactMessage.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: item.email,
    subject,
    text: body,
  });

  item.status = "answered";
  item.lastReplyAt = new Date();
  item.lastReplySubject = subject;
  await item.save();

  res.json({ ok: true });
});

export default router;
