import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, role, society) => {
  const token = jwt.sign(
    { _id: userId, role: role, society: society },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};
