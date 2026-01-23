import express from "express";
import Media from "../models/Media.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { uploadSingleImage } from "../utils/upload.js";

const router = express.Router();

// PUBLIC: list media (published)
router.get("/media", async (req, res) => {
  try {
    const items = await Media.find({ status: "published" })
      .sort({ createdAt: -1 })
      .select("titleSq titleEn place tags imageUrl width height createdAt");
    res.json({ items });
  } catch (e) {
    console.error("❌ GET /media error:", e?.message || e);
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN: list all
router.get("/admin/media", requireAdmin, async (req, res) => {
  try {
    const items = await Media.find()
      .sort({ createdAt: -1 })
      .select(
        "titleSq titleEn place tags imageUrl width height status createdAt",
      );
    res.json({ items });
  } catch (e) {
    console.error("❌ GET /admin/media error:", e?.message || e);
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN: upload (multipart)
router.post("/admin/media", requireAdmin, (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    try {
      if (err)
        return res
          .status(400)
          .json({ message: err.message || "Upload failed" });
      if (!req.file) return res.status(400).json({ message: "Missing image" });

      const titleSq = String(req.body.titleSq || "").trim();
      const titleEn = String(req.body.titleEn || "").trim();
      const place = String(req.body.place || "").trim();
      const status =
        String(req.body.status || "published") === "draft"
          ? "draft"
          : "published";

      const tagsRaw = String(req.body.tags || "").trim();
      const tags = tagsRaw
        ? tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 20)
        : [];

      const imageUrl = `/uploads/${req.file.filename}`;

      const doc = await Media.create({
        titleSq,
        titleEn,
        place,
        tags,
        imageUrl,
        status,
      });

      res.status(201).json({ ok: true, item: doc });
    } catch (e) {
      console.error("❌ POST /admin/media error:", e?.message || e);
      res.status(500).json({ message: "Server error" });
    }
  });
});

// ADMIN: delete
router.delete("/admin/media/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Media.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    await Media.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) {
    console.error("❌ DELETE /admin/media/:id error:", e?.message || e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
