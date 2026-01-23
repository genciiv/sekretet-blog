import express from "express";
import cors from "cors";
import morgan from "morgan";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "sekretet-blog", time: new Date().toISOString() });
});

app.use("/api", publicRoutes);
app.use("/api", adminRoutes);

export default app;
