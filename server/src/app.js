// FILE: server/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import adminCommentsRoutes from "./routes/adminComments.js";
import mediaRoutes from "./routes/media.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ PUBLIC (p.sh. /api/posts, /api/comments etj)
app.use("/api", publicRoutes);

// ✅ ADMIN (p.sh. /api/admin/login, /api/admin/posts, /api/admin/contacts)
app.use("/api", adminRoutes);

// ✅ ADMIN COMMENTS (p.sh. /api/admin/comments)
app.use("/api", adminCommentsRoutes);

// ✅ MEDIA (p.sh. /api/admin/media dhe /api/media)
app.use("/api", mediaRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// fallback 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found", path: req.originalUrl });
});

export default app;
