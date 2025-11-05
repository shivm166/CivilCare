import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie OR header
    const token = req.cookies?.jwt || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorized - no token provided" });
    }

    // 2️⃣ Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ message: "unauthorized - invalid token" });
    }

    // 3️⃣ Get user from DB
    const user = await User.findById(decode._id || decode.userId).select(
      "-password"
    );
    if (!user) {
      return res.status(401).json({ message: "unauthorized - user not found" });
    }

    // 4️⃣ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protected route:", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export default protectRoute;
