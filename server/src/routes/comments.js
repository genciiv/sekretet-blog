import express from "express";
import validator from "validator";
import Comment from "../models/Comment.js";

const router = express.Router();

/**
 * GET /api/posts/:slug/comments
 * Public: kthen vetëm komentet approved (me default)
 * opsionale: ?status=approved|pending|rejected  (për debug)
 */
router.get("/posts/:slug/comments", async (req, res) => {
  const slug = req.params.slug;
  const status = String(req.query.status || "approved");

  const allow = ["approved", "pending", "rejected"];
  const safeStatus = allow.includes(status) ? status : "approved";

  const items = await Comment.find({ slug, status: safeStatus })
    .sort({ createdAt: -1 })
    .select("name message createdAt status");

  res.json({ items });
});

/**
 * POST /api/posts/:slug/comments
 * body: { name, email, message }
 * status: pending
 */
router.post("/posts/:slug/comments", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }
  if (!validator.isEmail(String(email))) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const c = await Comment.create({
    slug: req.params.slug,
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    status: "pending",
  });

  res.status(201).json({
    ok: true,
    message: "Comment submitted (pending approval).",
    item: { _id: c._id, name: c.name, message: c.message, status: c.status, createdAt: c.createdAt },
  });
});

export default router;
