// FILE: server/src/routes/media.js
import express from "express";
import Media from "../models/Media.js";
import upload from "../utils/upload.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * ✅ ADMIN MEDIA
 * GET  /api/admin/media
 * POST /api/admin/media  (FormData: image, titleSq, titleEn, place, tags, status)
 * DELETE /api/admin/media/:id
 */

// LIST
router.get("/admin/media", requireAdmin, async (req, res) => {
  const docs = await Media.find().sort({ createdAt: -1 });

  const items = docs.map((d) => ({
    _id: d._id,
    imageUrl: d.url || "",
    titleSq: d.title_sq || "",
    titleEn: d.title_en || "",
    place: d.place || "",
    tags: Array.isArray(d.tags) ? d.tags : [],
    status: d.status,
    createdAt: d.createdAt,
  }));

  res.json({ items });
});

// CREATE (UPLOAD)
router.post(
  "/admin/media",
  requireAdmin,
  upload.single("image"), // ✅ siç e dërgon client-i
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Missing file" });

    // ✅ prano si camelCase ashtu edhe snake_case
    const titleSq = req.body.titleSq ?? req.body.title_sq ?? "";
    const titleEn = req.body.titleEn ?? req.body.title_en ?? "";
    const place = req.body.place ?? "";
    const status = req.body.status === "published" ? "published" : "draft";

    const tagsRaw = req.body.tags ?? "";
    const tags = String(tagsRaw)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const doc = await Media.create({
      url: `/uploads/${req.file.filename}`,
      title_sq: String(titleSq),
      title_en: String(titleEn),
      place: String(place),
      tags,
      status,
    });

    // kthe formatin që pret client
    res.status(201).json({
      _id: doc._id,
      imageUrl: doc.url || "",
      titleSq: doc.title_sq || "",
      titleEn: doc.title_en || "",
      place: doc.place || "",
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      status: doc.status,
      createdAt: doc.createdAt,
    });
  }
);

// DELETE
router.delete("/admin/media/:id", requireAdmin, async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
