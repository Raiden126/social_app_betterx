import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deleteUser, getAuthUserProfile, getUserProfile } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js";
import { uploadUserMedia } from "../middleware/multer.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/delete-user", deleteUser);
router.put("/update-user", uploadUserMedia, updateUser);
router.get('/get-user/:username', getUserProfile);
router.get('/get-auth-user', getAuthUserProfile);

export default router;
