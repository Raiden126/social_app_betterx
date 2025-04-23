import express from "express";
import {
  createPost,
  getUserPosts,
  deletePost,
  getPostById,
  updatePost,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadPostMedia, upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/create-post", uploadPostMedia, createPost);
router.get("/get-posts", getUserPosts);
router.delete("/delete-post/:post_id", deletePost);
router.get("/get-post-by-id", getPostById);
router.post("/update-post/:post_id", upload.none(), updatePost);

export default router;