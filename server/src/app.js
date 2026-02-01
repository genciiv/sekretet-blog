import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", publicRoutes);
app.use("/api", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

export default app;
