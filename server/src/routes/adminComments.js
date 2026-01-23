import express from "express";
import Comment from "../models/Comment.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/admin/comments?status=pending|approved|rejected
 */
router.get("/admin/comments", requireAdmin, async (req, res) => {
  const status = (req.query.status || "pending").toString();
  const filter = { status };
  const items = await Comment.find(filter)
    .sort({ createdAt: -1 })
    .select("postSlug name email message status emailVerified createdAt");
  res.json({ items });
});

/**
 * PUT /api/admin/comments/:id/approve
 */
router.put("/admin/comments/:id/approve", requireAdmin, async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  if (!c.emailVerified) return res.status(400).json({ message: "Email not verified" });

  c.status = "approved";
  await c.save();
  res.json({ ok: true });
});

/**
 * PUT /api/admin/comments/:id/reject
 */
router.put("/admin/comments/:id/reject", requireAdmin, async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  c.status = "rejected";
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
