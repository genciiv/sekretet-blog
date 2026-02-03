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

export default app;
