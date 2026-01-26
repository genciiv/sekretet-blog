import express from "express";
import Comment from "../models/Comment.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/admin/comments", requireAdmin, async (req, res) => {
  const items = await Comment.find().sort({ createdAt: -1 });
  res.json({ items });
});

router.patch("/admin/comments/:id", requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  const item = await Comment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  res.json(item);
});

export default router;
