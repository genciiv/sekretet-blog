// FILE: server/src/routes/public.js
import express from "express";
import Post from "../models/Post.js";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();

// GET /api/posts (PUBLIC)
router.get("/posts", async (req, res) => {
  const items = await Post.find({ status: "published" }).sort({
    publishedAt: -1,
    createdAt: -1,
  });
  res.json({ items });
});

router.get("/posts/:slug", async (req, res) => {
  const slug = String(req.params.slug || "").trim();

  let post = await Post.findOne({ slug, status: "published" });

  if (!post) {
    post = await Post.findOne({
      slug: { $regex: `^${slug}(-\\d+)?$`, $options: "i" },
      status: "published",
    });
  }

  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});


// POST /api/contact (PUBLIC)
router.post("/contact", async (req, res) => {
  const b = req.body || {};
  const item = await ContactMessage.create({
    name: b.name || "",
    email: b.email || "",
    message: b.message || "",
    status: "new",
  });
  res.status(201).json({ ok: true, item });
});

export default router;
