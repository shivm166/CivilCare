import { User } from "../../models/user.model.js";
import { generateTokenAndSetCookie } from "../../utils/jwtToken.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/response.js";

import { STATUS_CODES } from "../../utils/status.js";
import { sendOtpEmail } from "../../utils/sendEmail.js";

const {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = STATUS_CODES;

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "All fields are required"
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, CONFLICT, null, "User already exists");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
    });

    const jwt = generateTokenAndSetCookie(res, newUser._id, newUser.globalRole);

    return sendSuccessResponse(
      res,
      CREATED,
      { newUser },
      "User created successfully",
      jwt
    );
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "All fields are required"
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(
        res,
        UNAUTHORIZED,
        null,
        "Credential details are incorrect"
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendErrorResponse(
        res,
        UNAUTHORIZED,
        null,
        "Credential details are incorrect"
      );
    }
    // Check if the user's account is activated
    if (user.isInvited && !user.isActivated) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Account not activated. Please check your email for the activation link."
      );
    }

    const jwt = generateTokenAndSetCookie(res, user._id, user.globalRole);

    return sendSuccessResponse(res, SUCCESS, { user }, "Login successful", jwt);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server Error");
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendErrorResponse(res, BAD_REQUEST, null, "Email is required");

    const user = await User.findOne({ email });
    if (!user) return sendErrorResponse(res, NOT_FOUND, null, "User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail({ to: email, name: user.name, otp });

    return sendSuccessResponse(res, SUCCESS, null, "OTP sent to your email");
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server Error");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return sendErrorResponse(res, BAD_REQUEST, null, "All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) return sendErrorResponse(res, NOT_FOUND, null, "User not found");

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid or expired OTP");
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return sendSuccessResponse(res, SUCCESS, null, "Password reset successfully. Please login.");
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server Error");
  }
};

export const getprofile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return sendErrorResponse(
        res,
        UNAUTHORIZED,
        null,
        "User not authenticated."
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendErrorResponse(res, NOT_FOUND, null, "User not found");
    }

    return sendSuccessResponse(
      res,
      SUCCESS,
      { user },
      "User profile fetched successfully"
    );
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server Error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return sendErrorResponse(res, UNAUTHORIZED, null, "Unauthorized");

    const { name } = req.body;
    if (!name || !name.trim()) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Name is required");
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated)
      return sendErrorResponse(res, NOT_FOUND, null, "User not found");

    return sendSuccessResponse(
      res,
      SUCCESS,
      { user: updated },
      "Profile updated successfully!"
    );
  } catch (err) {
    console.error("updateProfile error:", err);
    return sendErrorResponse(res, SERVER_ERROR, err, "Internal server error");
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return sendSuccessResponse(res, SUCCESS, null, "Logout successfully");
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server Error");
  }
};

export const getSocieties = async (req, res) => {
  try {
    const userId = req.user._id;

    const relations = await UserSocietyRel.find({
      user: userId,
      isActive: true,
    })
      .populate("society", "name city state")
      .select("roleInSociety unit society");

    const societies = relations.map((rel) => ({
      societyId: rel.society._id,
      societyName: rel.society.name,
      role: rel.roleInSociety,
      details: rel.society,
    }));

    return sendSuccessResponse(
      res,
      SUCCESS,
      { societies },
      "User societies fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching societies:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const total = await User.countDocuments();

    return sendSuccessResponse(
      res,
      SUCCESS,
      { users, totalUsers: total },
      "All users fetched successfully"
    );
  } catch (error) {
    return sendErrorResponse(res, SERVER_ERROR, error, "Server Error");
  }
};

