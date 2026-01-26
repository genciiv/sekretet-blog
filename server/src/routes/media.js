import express from "express";
import Media from "../models/Media.js";
import upload from "../utils/upload.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// PUBLIC
router.get("/media", async (req, res) => {
  const items = await Media.find({ status: "published" });
  res.json({ items });
});

// ADMIN
router.get("/admin/media", requireAdmin, async (req, res) => {
  const items = await Media.find();
  res.json({ items });
});

router.post(
  "/admin/media",
  requireAdmin,
  upload.single("file"),
  async (req, res) => {
    const item = await Media.create({
      url: `/uploads/${req.file.filename}`,
      title_sq: req.body.title_sq || "",
      title_en: req.body.title_en || "",
      place: req.body.place || "",
      tags: (req.body.tags || "").split(",").map((t) => t.trim()),
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
