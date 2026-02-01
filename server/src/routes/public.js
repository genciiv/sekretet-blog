import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import Post from "../models/Post.js";

const router = express.Router();

/* ================= POSTS (siç i ke) ================= */

router.get("/posts", async (req, res) => {
  const items = await Post.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .select(
      "slug title_sq title_en excerpt_sq excerpt_en coverImageUrl category tags publishedAt",
    );

  res.json({ items });
});

router.get("/posts/:slug", async (req, res) => {
  const post = await Post.findOne({
    slug: req.params.slug,
    status: "published",
  });

  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

/* ================= CONTACT (PUBLIC) ================= */

// ✅ POST /api/contact
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Emri, email dhe mesazhi janë të detyrueshëm.",
      });
    }

    const item = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: "new",
    });

    res.status(201).json({ ok: true, id: item._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
