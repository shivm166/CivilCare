import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    console.log("📥 Auth Header:", authHeader);
    console.log("🔑 Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ JWT Verify Error:", err.message);
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // Store user info in request
      req.user = {
        id: decoded.id || decoded._id || decoded.userId,
        email: decoded.email,
        ...decoded,
      };

      console.log("✅ Authenticated User:", req.user);
      next();
    });
  } catch (error) {
    console.error("🚨 Authentication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};
