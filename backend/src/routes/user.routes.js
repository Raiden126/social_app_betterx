import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deleteUser } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js";
import { uploadUserMedia } from "../middleware/multer.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/delete-user", deleteUser);
router.post("/update", uploadUserMedia, updateUser);

export default router;
