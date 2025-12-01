import { User } from "../../models/user.model.js";
import { generateTokenAndSetCookie } from "../../utils/jwtToken.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";

const {
  SUCCESS,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = STATUS_CODES;

// ==================== USER ACTIVATION CONTROLLERS ====================

// 🔓 Activate invited user account
export const activateAccount = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Token and password are required"
      );
    }

    if (password.length < 6) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Password must be at least 6 characters"
      );
    }

    // Find user by token
    const user = await User.findOne({
      invitationToken: token,
      invitationExpiry: { $gt: Date.now() },
      isInvited: true,
      isActivated: false,
    });

    if (!user) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Invalid or expired invitation token"
      );
    }

    // Set password and activate account
    user.password = password;
    user.isActivated = true;
    user.invitationToken = null;
    user.invitationExpiry = null;
    await user.save();

    // Generate JWT and login
    const jwt = generateTokenAndSetCookie(res, user._id, user.globalRole);

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        globalRole: user.globalRole,
        jwt,
      },
      "Account activated successfully"
    );
  } catch (error) {
    console.error("Error in activateAccount controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Something went wrong");
  }
};

// 🔍 Verify invitation token (for frontend validation)
export const verifyInvitationToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Token is required");
    }

    const user = await User.findOne({
      invitationToken: token,
      invitationExpiry: { $gt: Date.now() },
      isInvited: true,
      isActivated: false,
    }).select("name email phone");

    if (!user) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Invalid or expired invitation token"
      );
    }

    return sendSuccessResponse(
      res,
      SUCCESS,
      {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      "Token verified successfully"
    );
  } catch (error) {
    console.error("Error in verifyInvitationToken controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Something went wrong");
  }
};

// 📧 Resend invitation email
export const resendInvitation = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Email is required");
    }

    const user = await User.findOne({
      email,
      isInvited: true,
      isActivated: false,
    });

    if (!user) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "No pending invitation found for this email"
      );
    }

    // Check if token expired
    if (user.invitationExpiry < Date.now()) {
      // Generate new token
      const crypto = await import("crypto");
      user.invitationToken = crypto.randomBytes(32).toString("hex");
      user.invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await user.save();
    }

    const invitationLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/activate-account?token=${user.invitationToken}`;

    console.log(`📧 Resending invitation email to ${email}`);
    console.log(`Invitation link: ${invitationLink}`);

    return sendSuccessResponse(
      res,
      SUCCESS,
      { invitationLink }, // Remove invitationLink in production
      "Invitation resent successfully"
    );
  } catch (error) {
    console.error("Error in resendInvitation controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Something went wrong");
  }
};
