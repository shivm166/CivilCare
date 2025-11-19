import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, role, society) => {
  const token = jwt.sign(
    { _id: userId, role: role, society: society },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    // ✅ FIX: Use "strict" for localhost (dev), "none" for production (https)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    // ✅ FIX: Secure must match the environment
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  });

  return token;
};
