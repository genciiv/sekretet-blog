// FILE: server/src/routes/comments.js
import express from "express";
import validator from "validator";
import Comment from "../models/Comment.js";

const router = express.Router();

// CREATE comment (public)
router.post("/posts/:slug/comments", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  await Comment.create({
    slug: req.params.slug,
    name,
    email,
    message,
    status: "pending",
  });

  res.status(201).json({
    ok: true,
    message: "Koment në pritje aprovimi",
  });
});

// GET approved comments (public)
router.get("/posts/:slug/comments", async (req, res) => {
  const items = await Comment.find({
    slug: req.params.slug,
    status: "approved",
  }).sort({ createdAt: -1 });

  res.json({ items });
});

export default router;
