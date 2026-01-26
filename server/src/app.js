import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import commentsRoutes from "./routes/comments.js";
import adminCommentsRoutes from "./routes/adminComments.js";
import mediaRoutes from "./routes/media.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API routes
app.use("/api", publicRoutes);
app.use("/api", commentsRoutes);
app.use("/api", adminRoutes);
app.use("/api", adminCommentsRoutes);
app.use("/api", mediaRoutes);

// health
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "sekretet-blog",
    time: new Date().toISOString(),
  });
});

export default app;
