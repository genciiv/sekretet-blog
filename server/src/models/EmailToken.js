import mongoose from "mongoose";

const EmailTokenSchema = new mongoose.Schema(
  {
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// TTL index: dokumenti fshihet pas expiresAt
EmailTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("EmailToken", EmailTokenSchema);
