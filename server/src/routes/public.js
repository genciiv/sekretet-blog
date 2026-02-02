// FILE: server/src/routes/public.js
import express from "express";
import validator from "validator";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();

/**
 * ✅ PUBLIC: POST /api/contact
 * body: { name, email, message }
 */
router.post("/contact", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const item = await ContactMessage.create({
    name,
    email,
    message,
    status: "new",
  });

  res.status(201).json({ ok: true, id: item._id });
});


export default router;
