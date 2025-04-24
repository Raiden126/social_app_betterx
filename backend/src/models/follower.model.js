import { Schema, model } from "mongoose";

const followSchema = new Schema(
  {
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

followSchema.index({ following: 1, follower: 1 }, { unique: true });

const Follow = model("Follow", followSchema);
export default Follow;