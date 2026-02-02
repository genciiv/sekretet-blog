// FILE: server/src/models/ContactMessage.js
import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true },
    message: { type: String, required: true },

    status: {
      type: String,
      enum: ["new", "answered", "closed"],
      default: "new",
      index: true,
    },

    lastReplyAt: { type: Date, default: null },
    lastReplySubject: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", ContactMessageSchema);
