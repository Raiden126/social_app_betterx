import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const tokenFromCookie = req.cookies?.accessToken;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    console.log("No token provided or bad format");
    return res.status(401).json(new ApiError(401, "No token provided or bad format"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    
    const user = await User.findById(decoded.id).select("-password -refreshToken -otp");

    if (!user){
        return res.status(401).json(new ApiError(401, "User not found"));
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json(new ApiError(401, "Invalid or expired token"));
  }
}
