import express from "express";
import {
  createPost,
  deletePost,
  updatePost,
  getAuthUserPosts,
  getUserPostsByUsername,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadPostMedia, upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/create-post", uploadPostMedia, createPost);
router.get("/get-auth-posts", getAuthUserPosts);
router.get("/get-username-posts/:username", getUserPostsByUsername);
router.delete("/delete-post/:post_id", deletePost);
router.post("/update-post/:post_id", upload.none(), updatePost);

export default router;