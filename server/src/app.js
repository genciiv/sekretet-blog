// FILE: server/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import adminCommentsRoutes from "./routes/adminComments.js";
<<<<<<< HEAD
import mediaRoutes from "./routes/media.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// uploads statike
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// PUBLIC
app.use("/api", publicRoutes);

// ADMIN (login, posts, contacts) -> /api/admin/...
app.use("/api/admin", adminRoutes);

// ADMIN comments -> /api/admin/comments...
app.use("/api/admin", adminCommentsRoutes);

// MEDIA (public + admin)
app.use("/api", mediaRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// fallback 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found", path: req.originalUrl });
});
=======
import adminMediaRoutes from "./routes/media.js";

const app = express();

// Logs
app.use(morgan("dev"));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Static uploads: /uploads/xxx.jpg
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// API routes
app.use("/api", publicRoutes);
app.use("/api", adminRoutes);
app.use("/api", adminCommentsRoutes);
app.use("/api", adminMediaRoutes);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));
>>>>>>> 768e997fc7d89c7dce9e3bda017fa8c24453ca74

export default app;
