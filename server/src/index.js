import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("❌ Server start failed:", err.message);
  process.exit(1);
});
