import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// User protection
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Token invalid",
    });
  }
};

// Admin token verification
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("authenticateToken error:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};
