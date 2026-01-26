import express from "express";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import Post from "../models/Post.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * POST /api/admin/login
 * body: { email, password }
 */
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const ok =
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD;

  if (!ok)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

/**
 * GET /api/admin/posts
 */
router.get("/admin/posts", requireAdmin, async (req, res) => {
  const items = await Post.find({})
    .sort({ updatedAt: -1 })
    .select(
      "slug title_sq title_en excerpt_sq excerpt_en status category tags coverImageUrl publishedAt updatedAt",
    );

  res.json({ items });
});

/**
 * POST /api/admin/posts
 */
router.post("/admin/posts", requireAdmin, async (req, res) => {
  const body = req.body || {};
  const baseSlug = slugify(
    body.slug || body.title_sq || body.title_en || "post",
    {
      lower: true,
      strict: true,
    },
  );

  let slug = baseSlug;
  let i = 1;
  while (await Post.findOne({ slug })) slug = `${baseSlug}-${i++}`;

  const status = body.status === "published" ? "published" : "draft";
  const publishedAt = status === "published" ? new Date() : null;

  const post = await Post.create({
    slug,
    title_sq: body.title_sq || "",
    title_en: body.title_en || "",
    excerpt_sq: body.excerpt_sq || "",
    excerpt_en: body.excerpt_en || "",
    content_sq: body.content_sq || "",
    content_en: body.content_en || "",
    coverImageUrl: body.coverImageUrl || "",
    category: body.category || "Antikitet",
    tags: Array.isArray(body.tags) ? body.tags : [],
    status,
    publishedAt,
  });

  res.status(201).json(post);
});

/**
 * PUT /api/admin/posts/:id
 */
router.put("/admin/posts/:id", requireAdmin, async (req, res) => {
  const body = req.body || {};
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });

  post.title_sq = body.title_sq ?? post.title_sq;
  post.title_en = body.title_en ?? post.title_en;
  post.excerpt_sq = body.excerpt_sq ?? post.excerpt_sq;
  post.excerpt_en = body.excerpt_en ?? post.excerpt_en;
  post.content_sq = body.content_sq ?? post.content_sq;
  post.content_en = body.content_en ?? post.content_en;
  post.coverImageUrl = body.coverImageUrl ?? post.coverImageUrl;
  post.category = body.category ?? post.category;

  if (Array.isArray(body.tags)) post.tags = body.tags;

  if (body.status === "published" && post.status !== "published") {
    post.status = "published";
    post.publishedAt = new Date();
  } else if (body.status === "draft") {
    post.status = "draft";
    post.publishedAt = null;
  }

  await post.save();
  res.json(post);
});

/**
 * DELETE /api/admin/posts/:id
 */
router.delete("/admin/posts/:id", requireAdmin, async (req, res) => {
  const deleted = await Post.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
