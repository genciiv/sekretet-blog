import mongoose from "mongoose";

const PostImageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },          // p.sh. /uploads/xxx.jpg
    caption_sq: { type: String, default: "" },  // opsionale
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true },

    title_sq: { type: String, required: true },
    title_en: { type: String, default: "" },

    excerpt_sq: { type: String, default: "" },
    excerpt_en: { type: String, default: "" },

    content_sq: { type: String, default: "" },
    content_en: { type: String, default: "" },

    coverImageUrl: { type: String, default: "" },

    // ✅ shumë foto për një post
    images: { type: [PostImageSchema], default: [] },

    category: { type: String, default: "Antikitet", index: true },
    tags: [{ type: String }],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
