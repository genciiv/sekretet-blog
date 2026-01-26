import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    url: String,
    title_sq: String,
    title_en: String,
    place: String,
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Media", MediaSchema);
