// FILE: server/src/index.js
import "dotenv/config";
import app from "./app.js";
import "./db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
