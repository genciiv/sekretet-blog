import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

/**
 * GET /api/posts
 * Public list (published only)
 * Query: q, category, tag, page, limit
 */
router.get("/posts", async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "9", 10), 1), 50);
  const skip = (page - 1) * limit;

  const q = (req.query.q || "").trim();
  const category = (req.query.category || "").trim();
  const tag = (req.query.tag || "").trim();

  const filter = { status: "published" };

  if (category) filter.category = category;
  if (tag) filter.tags = tag;

  if (q) {
    filter.$or = [
      { title_sq: new RegExp(q, "i") },
      { title_en: new RegExp(q, "i") },
      { excerpt_sq: new RegExp(q, "i") },
      { excerpt_en: new RegExp(q, "i") }
    ];
  }

  const [items, total] = await Promise.all([
    Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("slug title_sq title_en excerpt_sq excerpt_en coverImageUrl category tags publishedAt createdAt"),
    Post.countDocuments(filter)
  ]);

  res.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items
  });
});

/**
 * GET /api/posts/:slug
 * Public single post (published only)
 */
router.get("/posts/:slug", async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, status: "published" });
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

export default router;
