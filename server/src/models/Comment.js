import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    slug: { type: String, index: true },
    name: String,
    email: String,
    message: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", CommentSchema);
