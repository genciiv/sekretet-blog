import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";

import adminRoutes from "./routes/admin.js";
import adminCommentsRoutes from "./routes/adminComments.js";
import commentsRoutes from "./routes/comments.js";
import mediaRoutes from "./routes/media.js";
import publicRoutes from "./routes/public.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// serve uploads (images)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// health
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "sekretet-blog",
    time: new Date().toISOString(),
  });
});

// API routes
app.use("/api", publicRoutes); // /api/posts, /api/posts/:slug
app.use("/api", commentsRoutes); // /api/posts/:slug/comments, /api/comments/verify
app.use("/api", adminRoutes); // /api/admin/login, /api/admin/posts...
app.use("/api", adminCommentsRoutes); // /api/admin/comments...
app.use("/api", mediaRoutes); // /api/admin/media, /api/media...

export default app;
