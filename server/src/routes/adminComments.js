import express from "express";
import Comment from "../models/Comment.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * GET /api/admin/comments?status=pending
 */
router.get("/admin/comments", requireAdmin, async (req, res) => {
  const status = req.query.status;
  const filter = status ? { status } : {};
  const items = await Comment.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

/**
 * PATCH /api/admin/comments/:id
 * body: { status: "approved" | "rejected" | "pending" }
 */
router.patch("/admin/comments/:id", requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  const ok = ["pending", "approved", "rejected"].includes(status);
  if (!ok) return res.status(400).json({ message: "Invalid status" });

  const item = await Comment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );

  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

export default router;
