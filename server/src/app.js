// FILE: server/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import adminCommentsRoutes from "./routes/adminComments.js";
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

export default app;
