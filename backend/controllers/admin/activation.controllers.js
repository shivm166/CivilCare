import { User } from "../../models/user.model.js";
import { generateTokenAndSetCookie } from "../../utils/jwtToken.js";

// ==================== USER ACTIVATION CONTROLLERS ====================

// 🔓 Activate invited user account
export const activateAccount = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        message: "Token and password are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Find user by token
    const user = await User.findOne({
      invitationToken: token,
      invitationExpiry: { $gt: Date.now() },
      isInvited: true,
      isActivated: false,
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired invitation token" 
      });
    }

    // Set password and activate account
    user.password = password;
    user.isActivated = true;
    user.invitationToken = null;
    user.invitationExpiry = null;
    await user.save();

    // Generate JWT and login
    const jwt = generateTokenAndSetCookie(res, user._id, user.globalRole);

    return res.status(200).json({
      success: true,
      message: "Account activated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        globalRole: user.globalRole,
      },
      jwt,
    });
  } catch (error) {
    console.error("Error in activateAccount controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 🔍 Verify invitation token (for frontend validation)
export const verifyInvitationToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: "Token is required" 
      });
    }

    const user = await User.findOne({
      invitationToken: token,
      invitationExpiry: { $gt: Date.now() },
      isInvited: true,
      isActivated: false,
    }).select("name email phone");

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired invitation token" 
      });
    }

    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error in verifyInvitationToken controller", error);
    res.status(500).json({ 
      success: false,
      message: "Something went wrong" 
    });
  }
};

// 📧 Resend invitation email
export const resendInvitation = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      email,
      isInvited: true,
      isActivated: false,
    });

    if (!user) {
      return res.status(404).json({ 
        message: "No pending invitation found for this email" 
      });
    }

    // Check if token expired
    if (user.invitationExpiry < Date.now()) {
      // Generate new token
      const crypto = await import("crypto");
      user.invitationToken = crypto.randomBytes(32).toString("hex");
      user.invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await user.save();
    }

    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/activate-account?token=${user.invitationToken}`;
    
    console.log(`📧 Resending invitation email to ${email}`);
    console.log(`Invitation link: ${invitationLink}`);

    return res.json({
      success: true,
      message: "Invitation resent successfully",
      invitationLink, // Remove in production
    });
  } catch (error) {
    console.error("Error in resendInvitation controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
