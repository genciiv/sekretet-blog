import express from "express";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/admin/login
 */
router.post("/admin/login", async (req, res) => {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password || "").trim();

  const ok =
    email ===
      String(process.env.ADMIN_EMAIL || "")
        .trim()
        .toLowerCase() &&
    password === String(process.env.ADMIN_PASSWORD || "").trim();

  if (!email || !password)
    return res.status(400).json({ message: "Missing credentials" });
  if (!ok)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    { admin: true, role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ ok: true, token });
});

/* ---------------- POSTS ---------------- */

/**
 * GET /api/admin/posts
 */
router.get("/admin/posts", requireAdmin, async (req, res) => {
  const items = await Post.find({})
    .sort({ updatedAt: -1 })
    .select(
      "slug title_sq title_en status category tags updatedAt publishedAt coverImageUrl",
    );
  res.json({ items });
});

/**
 * GET /api/admin/posts/:id
 */
router.get("/admin/posts/:id", requireAdmin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
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
    category: body.category || "General",
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

  if (typeof body.slug === "string" && body.slug.trim()) {
    const next = slugify(body.slug.trim(), { lower: true, strict: true });
    if (next !== post.slug) {
      const exists = await Post.findOne({ slug: next, _id: { $ne: post._id } });
      if (exists)
        return res.status(400).json({ message: "Slug already exists" });
      post.slug = next;
    }
  }

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
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

/* ---------------- COMMENTS (moderim) ---------------- */

/**
 * GET /api/admin/comments?status=pending|approved|all
 */
router.get("/admin/comments", requireAdmin, async (req, res) => {
  const status = String(req.query.status || "pending");
  const filter =
    status === "all"
      ? {}
      : { status: status === "approved" ? "approved" : "pending" };

  const items = await Comment.find(filter)
    .sort({ createdAt: -1 })
    .select("postSlug name email message status emailVerified createdAt");

  res.json({ items });
});

/**
 * POST /api/admin/comments/:id/approve
 */
router.post("/admin/comments/:id/approve", requireAdmin, async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });

  // vetëm nëse email është verifikuar, e bëjmë approved
  if (!c.emailVerified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  c.status = "approved";
  await c.save();
  res.json({ ok: true });
});

/**
 * DELETE /api/admin/comments/:id
 */
router.delete("/admin/comments/:id", requireAdmin, async (req, res) => {
  const c = await Comment.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
