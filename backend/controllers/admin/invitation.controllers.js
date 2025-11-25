import { User } from "../../models/user.model.js";
import { Society } from "../../models/society.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { MemberInvitation } from "../../models/member_invitation.model.js";
import { sendErrorResponse } from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";

const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = STATUS_CODES;

// ==================== ADMIN: SEND INVITATION TO EXISTING USER ====================
export const sendMemberInvitation = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { societyId } = req.params;
    const { userId, roleInSociety = "member", unitId, message } = req.body;

    if (!userId) {
      return sendErrorResponse(res, BAD_REQUEST, null, "User ID is required");
    }

    // Validate society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return sendErrorResponse(res, NOT_FOUND, null, "Society not found");
    }

    // Check if requester is admin
    const adminRel = await UserSocietyRel.findOne({
      user: adminId,
      society: societyId,
      roleInSociety: "admin",
      isActive: true,
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Only admins can send invitations"
      );
    }

    // Validate invited user exists
    const invitedUser = await User.findById(userId);
    if (!invitedUser) {
      return sendErrorResponse(res, NOT_FOUND, null, "User not found");
    }

    // Check if user is already a member
    const existingMember = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
      isActive: true,
    });

    if (existingMember) {
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

    // Create invitation
    const invitation = await MemberInvitation.create({
      invitedUser: userId,
      society: societyId,
      invitedBy: adminId,
      roleInSociety,
      unit: unitId || null,
      message: message || `You've been invited to join ${society.name}`,
    });

    const populatedInvitation = await MemberInvitation.findById(invitation._id)
      .populate("society", "name city state")
      .populate("invitedBy", "name email")
      .populate("invitedUser", "name email");

    // Keep original success response format
    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Error in sendMemberInvitation:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== USER: GET MY INVITATIONS ====================
export const getMyInvitations = async (req, res) => {
  try {
    const userId = req.user._id;

    const invitations = await MemberInvitation.find({
      invitedUser: userId,
      status: "pending",
    })
      .populate("society", "name address city state")
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });

    // Keep original success response format
    return res.json({
      success: true,
      count: invitations.length,
      invitations,
    });
  } catch (error) {
    console.error("Error in getMyInvitations:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== USER: ACCEPT INVITATION ====================
export const acceptInvitation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { invitationId } = req.params;

    // Find invitation
    const invitation = await MemberInvitation.findById(invitationId);

    if (!invitation) {
      return sendErrorResponse(res, NOT_FOUND, null, "Invitation not found");
    }

    // Verify invitation is for this user
    if (invitation.invitedUser.toString() !== userId.toString()) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "This invitation is not for you"
      );
    }

    // Check if already processed
    if (invitation.status !== "pending") {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Invitation already ${invitation.status}`
      );
    }

    // Check if user is already a member
    const existingMember = await UserSocietyRel.findOne({
      user: userId,
      society: invitation.society,
      isActive: true,
    });

    if (existingMember) {
      // Update invitation status
      invitation.status = "accepted";
      await invitation.save();

      // Keep original success response format
      return res.status(200).json({
        success: true,
        message: "You are already a member of this society",
      });
    }

    // Add user to society
    await UserSocietyRel.create({
      user: userId,
      society: invitation.society,
      roleInSociety: invitation.roleInSociety,
      unit: invitation.unit,
      isActive: true,
    });

    // Update invitation status
    invitation.status = "accepted";
    await invitation.save();

    const populatedInvitation = await MemberInvitation.findById(invitationId)
      .populate("society", "name city state")
      .populate("invitedBy", "name");

    // Keep original success response format
    return res.json({
      success: true,
      message: `You've successfully joined ${populatedInvitation.society.name}`,
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Error in acceptInvitation:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== USER: REJECT INVITATION ====================
export const rejectInvitation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { invitationId } = req.params;

    // Find invitation
    const invitation = await MemberInvitation.findById(invitationId);

    if (!invitation) {
      return sendErrorResponse(res, NOT_FOUND, null, "Invitation not found");
    }

    // Verify invitation is for this user
    if (invitation.invitedUser.toString() !== userId.toString()) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "This invitation is not for you"
      );
    }

    // Check if already processed
    if (invitation.status !== "pending") {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Invitation already ${invitation.status}`
      );
    }

    // Update invitation status
    invitation.status = "rejected";
    await invitation.save();

    const populatedInvitation = await MemberInvitation.findById(invitationId)
      .populate("society", "name")
      .populate("invitedBy", "name");

    // Keep original success response format
    return res.json({
      success: true,
      message: "Invitation rejected",
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Error in rejectInvitation:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== ADMIN: GET SENT INVITATIONS ====================
export const getSentInvitations = async (req, res) => {
  try {
    const { societyId } = req.params;
    const adminId = req.user._id;

    // Check if requester is admin
    const adminRel = await UserSocietyRel.findOne({
      user: adminId,
      society: societyId,
      roleInSociety: "admin",
      isActive: true,
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Only admins can view sent invitations"
      );
    }

    const invitations = await MemberInvitation.find({
      society: societyId,
    })
      .populate("invitedUser", "name email phone")
      .populate("invitedBy", "name")
      .sort({ createdAt: -1 });

    // Keep original success response format
    return res.json({
      success: true,
      count: invitations.length,
      invitations,
    });
  } catch (error) {
    console.error("Error in getSentInvitations:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};
