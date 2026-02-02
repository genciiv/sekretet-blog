// FILE: server/src/routes/admin.js
import express from "express";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import nodemailer from "nodemailer";

import Post from "../models/Post.js";
import ContactMessage from "../models/ContactMessage.js";

import { requireAdmin } from "../middleware/adminAuth.js";
import upload from "../utils/upload.js";

const router = express.Router();

// -------------------- ADMIN LOGIN --------------------
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

// -------------------- POSTS --------------------

// GET ALL POSTS
router.get("/admin/posts", requireAdmin, async (req, res) => {
  const items = await Post.find().sort({ updatedAt: -1 });
  res.json({ items });
});

// GET ONE POST
router.get("/admin/posts/:id", requireAdmin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

// CREATE
router.post("/admin/posts", requireAdmin, async (req, res) => {
  const b = req.body || {};

  const baseSlug = slugify(b.title_sq || "post", { lower: true, strict: true });

  let slug = baseSlug;
  let i = 1;
  while (await Post.findOne({ slug })) slug = `${baseSlug}-${i++}`;

  const status = b.status === "published" ? "published" : "draft";

  const post = await Post.create({
    slug,
    title_sq: b.title_sq,
    title_en: b.title_en || b.title_sq,
    excerpt_sq: b.excerpt_sq || "",
    excerpt_en: b.excerpt_en || b.excerpt_sq || "",
    content_sq: b.content_sq || "",
    content_en: b.content_en || b.content_sq || "",
    coverImageUrl: b.coverImageUrl || "",
    images: Array.isArray(b.images) ? b.images : [],
    category: b.category || "Antikitet",
    tags: Array.isArray(b.tags) ? b.tags : [],
    status,
    publishedAt: status === "published" ? new Date() : null,
  });

  res.status(201).json(post);
});

// UPDATE
router.put("/admin/posts/:id", requireAdmin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });

  Object.assign(post, req.body);

  post.title_en ||= post.title_sq;
  post.excerpt_en ||= post.excerpt_sq;
  post.content_en ||= post.content_sq;

  if (!Array.isArray(post.images)) post.images = [];

  if (req.body.status === "published" && !post.publishedAt) post.publishedAt = new Date();
  if (req.body.status === "draft") post.publishedAt = null;

  await post.save();
  res.json(post);
});

// MULTI UPLOAD FOTO për POST
router.post(
  "/admin/posts/:id/images",
  requireAdmin,
  upload.array("files", 30),
  async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    const files = req.files || [];
    if (!files.length) return res.status(400).json({ message: "No files uploaded" });

    const newImages = files.map((f) => ({ url: `/uploads/${f.filename}`, caption_sq: "" }));
    post.images = [...(post.images || []), ...newImages];
    await post.save();

    res.status(201).json({ ok: true, images: post.images });
  }
);

// fshi 1 foto nga post me URL
router.delete("/admin/posts/:id/images", requireAdmin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });

  const url = String(req.query.url || "");
  if (!url) return res.status(400).json({ message: "Missing url" });

  post.images = (post.images || []).filter((img) => img.url !== url);
  await post.save();

  res.json({ ok: true, images: post.images });
});

// DELETE
router.delete("/admin/posts/:id", requireAdmin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// -------------------- CONTACTS (ADMIN) --------------------

const ALLOWED_CONTACT_STATUS = new Set(["new", "answered", "closed"]);

// LIST: GET /api/admin/contacts?status=all|new|answered|closed&q=...
router.get("/admin/contacts", requireAdmin, async (req, res) => {
  const status = String(req.query.status || "all");
  const q = String(req.query.q || "").trim();

  const filter = {};
  if (status !== "all" && ALLOWED_CONTACT_STATUS.has(status)) filter.status = status;

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

// VIEW ONE
router.get("/admin/contacts/:id", requireAdmin, async (req, res) => {
  const item = await ContactMessage.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// UPDATE STATUS
router.put("/admin/contacts/:id", requireAdmin, async (req, res) => {
  const next = String(req.body?.status || "").trim();
  if (!ALLOWED_CONTACT_STATUS.has(next)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const item = await ContactMessage.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  item.status = next;
  await item.save();

  res.json({ ok: true, item });
});

// DELETE
router.delete("/admin/contacts/:id", requireAdmin, async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// REPLY (SMTP)
router.post("/admin/contacts/:id/reply", requireAdmin, async (req, res) => {
  const subject = String(req.body?.subject || "").trim();
  const body = String(req.body?.body || req.body?.message || "").trim();

  if (!body) return res.status(400).json({ message: "Reply message is required" });

  const item = await ContactMessage.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const mailSubject = subject || "Përgjigje nga Sekretet";

  await transporter.sendMail({
    from,
    to: item.email,
    subject: mailSubject,
    text: body,
  });

  item.status = "answered";
  item.lastReplyAt = new Date();
  item.lastReplySubject = mailSubject;
  await item.save();

  res.json({ ok: true });
});

export default router;
