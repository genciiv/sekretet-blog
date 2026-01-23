import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    titleSq: { type: String, default: "" },
    titleEn: { type: String, default: "" },
    place: { type: String, default: "" }, // p.sh. Apollonia, Bylis
    tags: [{ type: String }],
    imageUrl: { type: String, required: true }, // /uploads/....
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Media", MediaSchema);
