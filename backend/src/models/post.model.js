import { Schema, model } from "mongoose";

const postSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  title: {
    type: String,
    required: ["Title is required", true],
    trim: true,
    maxlength: 100,
  },
  text: {
    type: String,
    // required: ["Content is required", true],
    trim: true,
  },
  content: {
    type: [String],
    default: "",
  },
}, {timeStamps: true});

const Post = model("Post", postSchema);
export default Post;