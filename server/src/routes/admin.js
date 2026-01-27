import express from "express";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import Post from "../models/Post.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import upload from "../utils/upload.js";

const router = express.Router();

// LOGIN
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

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
    images: Array.isArray(b.images) ? b.images : [], // ✅
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

  // siguro array
  if (!Array.isArray(post.images)) post.images = [];

  if (req.body.status === "published" && !post.publishedAt) {
    post.publishedAt = new Date();
  }
  if (req.body.status === "draft") {
    post.publishedAt = null;
  }

  await post.save();
  res.json(post);
});

// ✅ MULTI UPLOAD FOTO për POST
// POST /api/admin/posts/:id/images (FormData: files[])
router.post(
  "/admin/posts/:id/images",
  requireAdmin,
  upload.array("files", 30),
  async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    const files = req.files || [];
    if (!files.length) return res.status(400).json({ message: "No files uploaded" });

    const newImages = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      caption_sq: "",
    }));

    post.images = [...(post.images || []), ...newImages];
    await post.save();

    res.status(201).json({ ok: true, images: post.images });
  }
);

// ✅ fshi 1 foto nga post me URL
// DELETE /api/admin/posts/:id/images?url=/uploads/xxx.jpg
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

export default router;
