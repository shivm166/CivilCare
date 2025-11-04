import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/jwtToken.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ Hash the password correctly
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      phone,
    });
    const jwt = generateTokenAndSetCookie(res, newUser._id, newUser.role);

    res.status(201).json({
      message: "User created successfully",
      user: {
        newUser,
      },
      jwt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(409)
        .json({ message: "Credential details are incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(409)
        .json({ message: "Credential details are incorrect" });
    }

    const jwt = generateTokenAndSetCookie(res, user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      user: {
        user,
      },
      jwt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
