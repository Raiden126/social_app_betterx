import express from "express";
import passport from "passport";
import { createPost } from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post(
  "/create-post",
  upload.single("contentUrl"),
  createPost
);

export default router;