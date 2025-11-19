// backend/utils/jwtToken.js
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, role, society) => {
  const token = jwt.sign(
    { _id: userId, role: role, society: society },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // FIX: Force secure: true if NOT running on localhost/127.0.0.1 environment,
  // which is necessary when SameSite="none" is set for cross-site cookies on Render (HTTPS).
  const isSecure =
    process.env.NODE_ENV === "production" ||
    (process.env.FRONTEND_URL &&
      !process.env.FRONTEND_URL.includes("localhost"));

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isSecure, // Use the new robust check
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });

  return token;
};
