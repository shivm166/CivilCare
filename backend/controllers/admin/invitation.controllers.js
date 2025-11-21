import { User } from "../../models/user.model.js";
import { Society } from "../../models/society.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { MemberInvitation } from "../../models/member_invitation.model.js";

// ==================== ADMIN: SEND INVITATION TO EXISTING USER ====================
export const sendMemberInvitation = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { societyId } = req.params;
    const { userId, roleInSociety = "member", unitId, message } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    // Check if requester is admin
    const adminRel = await UserSocietyRel.findOne({
      user: adminId,
      society: societyId,
      roleInSociety: "admin",
      isActive: true,
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return res.status(403).json({
        message: "Only admins can send invitations",
      });
    }

    // Validate invited user exists
    const invitedUser = await User.findById(userId);
    if (!invitedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a member
    const existingMember = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
      isActive: true,
    });

    if (existingMember) {
      return res.status(409).json({
        message: "User is already a member of this society",
      });
    }

    // Check if invitation already exists
    const existingInvitation = await MemberInvitation.findOne({
      invitedUser: userId,
      society: societyId,
      status: "pending",
    });

    if (existingInvitation) {
      return res.status(409).json({
        message: "Invitation already sent to this user",
      });
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

    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Error in sendMemberInvitation:", error);
    return res.status(500).json({ message: "Internal server error" });
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

    return res.json({
      success: true,
      count: invitations.length,
      invitations,
    });
  } catch (error) {
    console.error("Error in getMyInvitations:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Verify invitation is for this user
    if (invitation.invitedUser.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "This invitation is not for you",
      });
    }

    // Check if already processed
    if (invitation.status !== "pending") {
      return res.status(400).json({
        message: `Invitation already ${invitation.status}`,
      });
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

    return res.json({
      success: true,
      message: `You've successfully joined ${populatedInvitation.society.name}`,
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Error in acceptInvitation:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Verify invitation is for this user
    if (invitation.invitedUser.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "This invitation is not for you",
      });
    }

    // Check if already processed
    if (invitation.status !== "pending") {
      return res.status(400).json({
        message: `Invitation already ${invitation.status}`,
      });
    }

    // Update invitation status
    invitation.status = "rejected";
    await invitation.save();

    const populatedInvitation = await MemberInvitation.findById(invitationId)
      .populate("society", "name")
      .populate("invitedBy", "name");

    return res.json({
      success: true,
      message: "Invitation rejected",
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Error in rejectInvitation:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      return res.status(403).json({
        message: "Only admins can view sent invitations",
      });
    }

    const invitations = await MemberInvitation.find({
      society: societyId,
    })
      .populate("invitedUser", "name email phone")
      .populate("invitedBy", "name")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: invitations.length,
      invitations,
    });
  } catch (error) {
    console.error("Error in getSentInvitations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
