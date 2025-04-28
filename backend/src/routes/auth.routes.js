import express from "express";
import passport from "passport";
import {
  loginUser,
  registerUser,
  logoutUser,
  verifyUser,
  generateAccessAndRefreshToken,
  resendOTP,
  forgotpassword,
  resetPassword,
  changePassword,
  userMe,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { refreshTokenMiddleware } from "../middleware/refreshToken.midlleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-user", verifyUser);

// Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      req.user._id
    );

    res
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .redirect("/"); // or return JSON
  }
);

// GitHub
router.get("/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      req.user._id
    );

    res
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .redirect("/");
  }
);

router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password", resetPassword);
router.get('/me', userMe);

router.post('/refresh-token', refreshTokenMiddleware);

router.use(authMiddleware);

router.post("/logout", logoutUser);
router.post('/change-password', changePassword);

export default router;
