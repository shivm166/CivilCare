import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/jwtToken.js";
import { UserSocietyRel } from "../models/user_society_rel.model.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
    });
    const jwt = generateTokenAndSetCookie(res, newUser._id, newUser.globalRole);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
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

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(409)
        .json({ message: "Credential details are incorrect" });
    }

    const jwt = generateTokenAndSetCookie(res, user._id, user.globalRole);

    res.status(200).json({
      success: "true",
      message: "Login successful",
      user,
      jwt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ NEW: Get current authenticated user
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getprofile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name } = req.body;
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updated,
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSocieties = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;

    const societies = await UserSocietyRel.find({
      user: userId,
      isActive: true,
    })
      .populate("society", "name city state")
      .select("roleInSociety unit society");

    res.status(200).json({
      message: "User societies fetched successfully",
      societies: societies.map((rel) => ({
        societyId: rel.society._id,
        societyName: rel.society.name,
        role: rel.roleInSociety,
        details: rel.society,
      })),
    });
  } catch (error) {
    console.error("Error fetching societies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      totalUsers: total,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
