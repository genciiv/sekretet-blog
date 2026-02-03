// FILE: server/src/routes/public.js
import express from "express";
import Post from "../models/Post.js";
import Media from "../models/Media.js";
import ContactMessage from "../models/ContactMessage.js";

import commentsRoutes from "./comments.js";

const router = express.Router();

/**
 * ✅ POSTS (PUBLIC)
 * GET /api/posts
 */
router.get("/posts", async (req, res) => {
  const items = await Post.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select("-content_en -content_sq");

  res.json({ items });
});

/**
 * ✅ POSTS (PUBLIC)
 * GET /api/posts/:slug
 */
router.get("/posts/:slug", async (req, res) => {
  const post = await Post.findOne({
    slug: req.params.slug,
    status: "published",
  });
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

/**
 * ✅ MEDIA (PUBLIC)
 * GET /api/media
 */
router.get("/media", async (req, res) => {
  const docs = await Media.find({ status: "published" }).sort({
    createdAt: -1,
  });

  // map to client-friendly format
  const items = docs.map((d) => ({
    _id: d._id,
    imageUrl: d.url || "",
    titleSq: d.title_sq || "",
    titleEn: d.title_en || "",
    place: d.place || "",
    tags: Array.isArray(d.tags) ? d.tags : [],
    status: d.status,
    createdAt: d.createdAt,
  }));

  res.json({ items });
});

/**
 * ✅ CONTACT (PUBLIC)
 * POST /api/contact
 */
router.post("/contact", async (req, res) => {
  const { name = "", email, message } = req.body || {};
  if (!email || !message)
    return res.status(400).json({ message: "Missing fields" });

  const item = await ContactMessage.create({
    name,
    email,
    message,
    status: "new",
  });

  res.status(201).json({ ok: true, itemId: item._id });
});

// ✅ comments routes:
// POST /api/posts/:slug/comments
// GET  /api/posts/:slug/comments
router.use("/", commentsRoutes);

export default router;
