// FILE: server/src/routes/media.js
import express from "express";
import Media from "../models/Media.js";
import upload from "../utils/upload.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// PUBLIC
router.get("/media", async (req, res) => {
  const docs = await Media.find({ status: "published" }).sort({
    createdAt: -1,
  });

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

// ADMIN
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

// ✅ UPLOAD: pranon "image" (si client)
router.post(
  "/admin/media",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const tagsArr = String(req.body.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const item = await Media.create({
      url: `/uploads/${req.file.filename}`,
      title_sq: req.body.titleSq || req.body.title_sq || "",
      title_en: req.body.titleEn || req.body.title_en || "",
      place: req.body.place || "",
      tags: tagsArr,
      status: req.body.status === "published" ? "published" : "draft",
    });

    res.status(201).json(item);
  },
);

router.delete("/admin/media/:id", requireAdmin, async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
