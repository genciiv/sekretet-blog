// FILE: server/src/routes/adminComments.js
import express from "express";
import Comment from "../models/Comment.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// GET /api/admin/comments?status=pending|approved|rejected|all
router.get("/comments", requireAdmin, async (req, res) => {
  const status = String(req.query.status || "all").trim();

  const filter = {};
  if (status && status !== "all") filter.status = status;

  const items = await Comment.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

// PATCH /api/admin/comments/:id  { status }
router.patch("/comments/:id", requireAdmin, async (req, res) => {
  const next = String(req.body?.status || "").trim();
  const allowed = new Set(["pending", "approved", "rejected"]);

  if (!allowed.has(next)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const item = await Comment.findByIdAndUpdate(
    req.params.id,
    { status: next },
    { new: true },
  );

  if (!item) return res.status(404).json({ message: "Not found" });

  res.json({ ok: true, item });
});

export default router;
