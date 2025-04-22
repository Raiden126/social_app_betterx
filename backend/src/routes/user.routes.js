import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/delete-user", deleteUser);

export default router;
