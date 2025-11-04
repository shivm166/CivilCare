import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, role) => {
  if (!userId) {
    throw new Error("User ID is required to generate JWT token");
  }

  // Create token payload
  const payload = { _id: userId, role };

  // Generate JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Set HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // JS cannot access the cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict", // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token;
};
