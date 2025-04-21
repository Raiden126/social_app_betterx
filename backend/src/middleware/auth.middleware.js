import jwt from "jsonwebtoken";
import {userModel} from "../model/user.model.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const tokenFromCookie = req.cookies?.token;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({ message: "No token provided or bad format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    
    const user = await userModel.findById(decoded.id).select("-password -refreshToken -otp");

    if (!user){
        return res.status(401).json({message: "User not found"});
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
