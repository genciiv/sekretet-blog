import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    postSlug: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },

    message: { type: String, required: true, trim: true, maxlength: 1000 },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    emailVerified: { type: Boolean, default: false, index: true },

    // anti-spam minimal
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
