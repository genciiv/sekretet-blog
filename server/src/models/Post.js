import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true },

    title_sq: { type: String, required: true, trim: true, maxlength: 140 },
    title_en: { type: String, required: true, trim: true, maxlength: 140 },

    excerpt_sq: { type: String, trim: true, maxlength: 300, default: "" },
    excerpt_en: { type: String, trim: true, maxlength: 300, default: "" },

    content_sq: { type: String, default: "" },
    content_en: { type: String, default: "" },

    coverImageUrl: { type: String, default: "" },

    category: { type: String, default: "General", index: true },
    tags: [{ type: String, index: true }],

    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
