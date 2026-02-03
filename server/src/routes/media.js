// FILE: server/src/routes/media.js
import express from "express";
import Media from "../models/Media.js";
import upload from "../utils/upload.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * =========================
 * PUBLIC MEDIA
 * =========================
 * GET /api/media
 */
router.get("/media", async (req, res) => {
  const items = await Media.find({ status: "published" }).sort({
    createdAt: -1,
  });
  res.json({ items });
});

/**
 * =========================
 * ADMIN MEDIA
 * =========================
 */

// GET /api/admin/media
router.get("/admin/media", requireAdmin, async (req, res) => {
  const items = await Media.find().sort({ createdAt: -1 });
  res.json({ items });
});

// POST /api/admin/media  (FormData: image)
router.post(
  "/admin/media",
  requireAdmin,
  upload.single("image"), // ⚠️ client dërgon "image"
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const item = await Media.create({
      url: `/uploads/${req.file.filename}`,
      title_sq: req.body.title_sq || "",
      title_en: req.body.title_en || "",
      place: req.body.place || "",
      tags: String(req.body.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: req.body.status === "published" ? "published" : "draft",
    });

    res.status(201).json(item);
  },
);

// DELETE /api/admin/media/:id
router.delete("/admin/media/:id", requireAdmin, async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
