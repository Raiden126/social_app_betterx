import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshToken } from "../controllers/auth.controller.js";

export const refreshTokenMiddleware = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true })
      .status(200)
      .json({ success: true, message: "Tokens refreshed" });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    return res.status(403).json(new ApiError(403, "Could not refresh token"));
  }
};
