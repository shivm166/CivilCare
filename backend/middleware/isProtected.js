import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserSocietyRel } from "../models/user_society_rel.model.js";

const protectRoute = async (req, res, next) => {
  try {
    //  Get token from cookie OR header
    const token = req.cookies?.jwt || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorized - no token provided" });
    }

    //  Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ message: "unauthorized - invalid token" });
    }

    //  Get user from DB
    const user = await User.findById(decode._id || decode.userId).select(
      "-password"
    );
    if (!user) {
      return res.status(401).json({ message: "unauthorized - user not found" });
    }

    //  Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protected route:", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export default protectRoute;

// middleware/requireAdmin.js
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Check req.role (from society context) not req.user.role (global role)
  if (req.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }

  next();
};
