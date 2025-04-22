import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const tokenFromCookie = req.cookies?.token;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    throw new ApiError(401, "No token provided or bad format");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    
    const user = await User.findById(decoded.id).select("-password -refreshToken -otp");

    if (!user){
        throw new ApiError(401, "User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }
}
