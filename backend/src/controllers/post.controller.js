import { uploadOnCloudinary } from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createPost = async (req, res) => {
  try {
    const { title, text, content } = req.body;
    if ([title, text].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const user = req.user;
    if (!user || !user._id) {
      throw new ApiError(401, "Unauthorized");
    }

   let contentUrl = "";
   if (req.file && req.file.path) {
     contentUrl = req.file.path;
   }

    const newPost = await Post.create({
      title,
      text,
      content: contentUrl,
      user_id: user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Post created successfully", newPost));
  } catch (error) {
    console.error("error in createPost", error.message);
    throw new ApiError(500, "Something went wrong while creating post");
  }
};
