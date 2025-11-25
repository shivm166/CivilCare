import { User } from "../../models/user.model.js";
import { Society } from "../../models/society.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { Unit } from "../../models/unit.model.js";
import { sendInvitationEmail } from "../../utils/sendEmail.js";
import { MemberInvitation } from "../../models/member_invitation.model.js";
import { isValidObjectId } from "mongoose";
import { sendErrorResponse } from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";

const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = STATUS_CODES;

// ==================== MEMBER MANAGEMENT CONTROLLERS ====================

// 🔍 Search user by EXACT email only
export const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || email.trim().length === 0) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid email format");
    }

    // Search for exact email match (case-insensitive)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("name email phone isActivated isInvited");

    if (!user) {
      // Keep original flat success response format
      return res.json({
        success: false,
        found: false,
        message: "User not found with this email",
        email: email.toLowerCase().trim(),
      });
    }

    // Keep original flat success response format
    return res.json({
      success: true,
      found: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActivated: user.isActivated,
        isInvited: user.isInvited,
      },
    });
  } catch (error) {
    console.error("Error in searchUserByEmail controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Something went wrong");
  }
};

// ✅ Add existing (registered) user to society - send invitation
export const addExistingMember = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { userId, roleInSociety = "member", unitId } = req.body;

    if (!userId) {
      return sendErrorResponse(res, BAD_REQUEST, null, "User ID is required");
    }

    // Validate society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return sendErrorResponse(res, NOT_FOUND, null, "Society not found");
    }

    // Check admin permission
    const adminRel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      roleInSociety: "admin",
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Only admin can send invitations"
      );
    }

    // Validate user exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return sendErrorResponse(res, NOT_FOUND, null, "User not found");
    }

    // Check if user already in society
    const existingRel = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
    });

    if (existingRel) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        "User is already a member of this society"
      );
    }

    // Check if invitation already exists
    const existingInvitation = await MemberInvitation.findOne({
      invitedUser: userId,
      society: societyId,
      status: "pending",
    });

    if (existingInvitation) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        "Invitation already sent to this user"
      );
    }

    // Create invitation instead of direct add
    const invitation = await MemberInvitation.create({
      invitedUser: userId,
      society: societyId,
      invitedBy: req.user._id,
      roleInSociety,
      unit: unitId || null,
      message: `You've been invited to join ${society.name}`,
    });

    const populatedInvitation = await MemberInvitation.findById(invitation._id)
      .populate("invitedUser", "name email phone")
      .populate("society", "name");

    // Keep original flat success response format
    return res.status(201).json({
      success: true,
      message: "Invitation sent to user",
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Error in addExistingMember controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Something went wrong");
  }
};

// 📧 Invite non-registered user (create placeholder + send invite)
export const inviteNewMember = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { name, email, phone, roleInSociety = "member", unitId } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Name, email, and phone are required"
      );
    }

    // Validate society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return sendErrorResponse(res, NOT_FOUND, null, "Society not found");
    }

    // Check admin permission
    const adminRel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      roleInSociety: "admin",
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Only admin can invite members"
      );
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      // User exists - check if already in society
      const existingRel = await UserSocietyRel.findOne({
        user: user._id,
        society: societyId,
      });

      if (existingRel) {
        return sendErrorResponse(
          res,
          CONFLICT,
          null,
          "User is already a member of this society"
        );
      }

      // Add existing user to society
      const newRel = await UserSocietyRel.create({
        user: user._id,
        society: societyId,
        roleInSociety,
        unit: unitId || null,
        isActive: true,
      });

      const populatedRel = await UserSocietyRel.findById(newRel._id)
        .populate("user", "name email phone")
        .populate("unit", "unitNumber");

      // Keep original flat success response format
      return res.status(200).json({
        success: true,
        message: "Existing user added to society",
        invited: false,
        member: populatedRel,
      });
    }

    // Create placeholder user with invitation token
    const crypto = await import("crypto");
    const invitationToken = crypto.randomBytes(32).toString("hex");
    const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const temporaryPassword = crypto.randomBytes(16).toString("hex");

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password: temporaryPassword,
      isInvited: true,
      isActivated: false,
      invitationToken,
      invitationExpiry,
    });

    // Add user to society
    await UserSocietyRel.create({
      user: newUser._id,
      society: societyId,
      roleInSociety,
      unit: unitId || null,
      isActive: true,
    });

    // ✅ SEND INVITATION EMAIL
    const invitationLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/activate-account?token=${invitationToken}`;

    try {
      await sendInvitationEmail({
        to: email,
        name: name,
        invitationLink: invitationLink,
        societyName: society.name,
      });
      console.log(`✅ Invitation email sent to ${email}`);
    } catch (emailError) {
      console.error("❌ Failed to send invitation email:", emailError);
    }

    // Keep original flat success response format
    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      invited: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("Error in inviteNewMember controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Something went wrong");
  }
};

// 📋 Get all members of a society
export const getSocietyMembers = async (req, res) => {
  try {
    const { societyId } = req.params;

    if (!isValidObjectId(societyId)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid society ID");
    }

    const members = await UserSocietyRel.find({
      society: societyId,
      isActive: true,
    })
      .populate("user", "name email phone isActivated isInvited")
      .populate("unit", "name floor type")
      .populate("building", "name")
      .select("roleInSociety unitRole joinedAt")
      .sort({ joinedAt: -1 });

    // Keep original flat success response format
    return res.status(200).json({
      success: true,
      members,
      count: members.length,
    });
  } catch (error) {
    console.error("Error in getSocietyMembers:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal Server Error");
  }
};

// 🗑️ Remove member from society
export const removeMember = async (req, res) => {
  try {
    const { societyId, memberId } = req.params;

    // Check admin permission
    const adminRel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      roleInSociety: "admin",
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Only admin can remove members"
      );
    }

    // Find member
    const memberRel = await UserSocietyRel.findOne({
      _id: memberId,
      society: societyId,
    });

    if (!memberRel) {
      return sendErrorResponse(res, NOT_FOUND, null, "Member not found");
    }

    // Prevent admin from removing themselves
    if (memberRel.user.toString() === req.user._id.toString()) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "You cannot remove yourself"
      );
    }

    await UserSocietyRel.findByIdAndDelete(memberId);

    // Keep original flat success response format
    return res.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Error in removeMember controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Something went wrong");
  }
};

// 📝 Update member role
export const updateMemberRole = async (req, res) => {
  try {
    const { societyId, memberId } = req.params;
    const { roleInSociety } = req.body;

    if (!roleInSociety) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Role is required");
    }

    // Check admin permission
    const adminRel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      roleInSociety: "admin",
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Only admin can update member roles"
      );
    }

    const memberRel = await UserSocietyRel.findOneAndUpdate(
      { _id: memberId, society: societyId },
      { roleInSociety },
      { new: true }
    ).populate("user", "name email phone");

    if (!memberRel) {
      return sendErrorResponse(res, NOT_FOUND, null, "Member not found");
    }

    // Keep original flat success response format
    return res.json({
      success: true,
      message: "Member role updated successfully",
      member: memberRel,
    });
  } catch (error) {
    console.error("Error in updateMemberRole controller", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Something went wrong");
  }
};
