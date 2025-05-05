import multer from "multer";
import Post from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { buildUserPostsPipeline } from "../utils/AggregationPipeline.js";

export const createPost = async (req, res) => {
  try {
    const { title, text, content } = req.body;
    if ([title, text].some((field) => field?.trim() === "")) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    let contentUrls = [];
    if (req.files && req.files.contentUrl) {
      contentUrls = req.files.contentUrl.map((file) => file.path);
    }

    const newPost = await Post.create({
      title,
      text,
      content: contentUrls,
      user_id: user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newPost, "Post created successfully"));
  } catch (error) {
    console.error("error in createPost", error.message);
    if (error instanceof multer.MulterError) {
      return res.status(400).json(new ApiError(400, error.message));
    }
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while creating post"));
  }
};

export const getAuthUserPosts = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    const posts = await Post.aggregate(buildUserPostsPipeline(userId));

    if (!posts.length) {
      return res.status(404).json(new ApiError(404, "No posts found"));
    }

    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
  } catch (error) {
    console.error("getAuthUserPosts error:", error.message);
    return res.status(500).json(new ApiError(500, "Error fetching posts"));
  }
};

export const getUserPostsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username?.trim()) {
      return res.status(400).json(new ApiError(400, "Username is required"));
    }

    const user = await User.findOne({ username: username.toLowerCase() }).select("_id");

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const posts = await Post.aggregate(buildUserPostsPipeline(user._id));

    if (!posts.length) {
      return res.status(404).json(new ApiError(404, "No posts found for this user"));
    }

    return res.status(200).json(new ApiResponse(200, posts, "User posts fetched successfully"));
  } catch (error) {
    console.error("getUserPostsByUsername error:", error.message);
    return res.status(500).json(new ApiError(500, "Error fetching user posts"));
  }
};

export const deletePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json(new ApiError(404, "Post not found"));
    }

    if (post.user_id.toString() !== user._id.toString()) {
      return res.status(403).json(new ApiError(403, "Forbidden"));
    }

    if (post.content) {
      const urlParts = post.content.split("/");
      const filenameWithExt = urlParts[urlParts.length - 1];
      const publicId = filenameWithExt.split(".")[0];

      const ext = path.extname(filenameWithExt).toLowerCase();

      let resourceType = "image";
      if ([".mp4", ".mov"].includes(ext)) {
        resourceType = "video";
      }

      await cloudinary.uploader.destroy(`social_posts/${publicId}`, {
        resource_type: resourceType,
      });
    }

    await Post.findByIdAndDelete(post_id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post deleted successfully"));
  } catch (error) {
    console.error("error in deletePost", error.message);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while deleting post"));
  }
};

export const updatePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { text } = req.body;
    const user = req.user;

    if (!user || !user._id) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json(new ApiError(404, "Post not found"));
    }

    if (post.user_id.toString() !== user._id.toString()) {
      return res.status(403).json(new ApiError(403, "Forbidden"));
    }

    if (text !== undefined) post.text = text;

    await post.save();

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post updated successfully"));
  } catch (error) {
    console.error("error in updatePost", error.message);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while updating post"));
  }
};
