import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";

import adminRoutes from "./routes/admin.js";
import mediaRoutes from "./routes/media.js";
// këtu mbaji edhe routes e tua ekzistuese: posts, comments, admin, etj.

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// serve uploads
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

app.use("/api", adminRoutes);
app.use("/api", mediaRoutes);

// TODO: app.use("/api", postsRoutes) etj. (mbaji siç i ke)

export default app;
