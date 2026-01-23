import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

/**
 * GET /api/posts
 * Public list: only published
 */
router.get("/posts", async (req, res) => {
  const items = await Post.find({ status: "published" })
    .sort({ publishedAt: -1, updatedAt: -1 })
    .select(
      "slug title_sq title_en excerpt_sq excerpt_en coverImageUrl category tags publishedAt updatedAt",
    );

  res.json({ items });
});

/**
 * GET /api/posts/:slug
 * Public single: only published
 */
router.get("/posts/:slug", async (req, res) => {
  const post = await Post.findOne({
    slug: req.params.slug,
    status: "published",
  });
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

export default router;
