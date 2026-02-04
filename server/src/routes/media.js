// FILE: server/src/routes/media.js
import express from "express";
import Media from "../models/Media.js";
import upload from "../utils/upload.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

function normalize(m) {
  const o = m.toObject ? m.toObject() : m;
  return {
    ...o,
    imageUrl: o.imageUrl || o.url || "",
    titleSq: o.titleSq || o.title_sq || "",
    titleEn: o.titleEn || o.title_en || "",
  };
}

/**
 * =========================
 * PUBLIC MEDIA
 * =========================
 * GET /api/media
 */
router.get("/media", async (req, res) => {
  const items = await Media.find({ status: "published" }).sort({ createdAt: -1 });
  res.json({ items: items.map(normalize) });
});

/**
 * =========================
 * ADMIN MEDIA
 * =========================
 */

// GET /api/admin/media
router.get("/media", requireAdmin, async (req, res) => {
  const items = await Media.find().sort({ createdAt: -1 });
  res.json({ items: items.map(normalize) });
});

// POST /api/admin/media (FormData: image)
router.post(
  "/media",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const status = req.body.status === "published" ? "published" : "draft";

    // ✅ prano siç i dërgon client-i
    const titleSq = req.body.titleSq || req.body.title_sq || "";
    const titleEn = req.body.titleEn || req.body.title_en || "";
    const place = req.body.place || "";
    const tags = String(req.body.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const item = await Media.create({
      url: `/uploads/${req.file.filename}`,
      title_sq: titleSq,
      title_en: titleEn,
      place,
      tags,
      status,
    });

    res.status(201).json(normalize(item));
  },
);

// DELETE /api/admin/media/:id
router.delete("/media/:id", requireAdmin, async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
