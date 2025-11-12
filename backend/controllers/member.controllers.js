import { User } from "../models/user.model.js";
import { Society } from "../models/society.model.js";
import { UserSocietyRel } from "../models/user_society_rel.model.js";
import { Unit } from "../models/unit.model.js";
import { sendInvitationEmail } from "../utils/sendEmail.js"; // ✅ ADD THIS IMPORT
import { MemberInvitation } from "../models/member_invitation.model.js";

// ==================== MEMBER MANAGEMENT CONTROLLERS ====================

// 🔍 Search user by EXACT email only
export const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email || email.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email format" 
      });
    }

    // Search for exact email match (case-insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select("name email phone isActivated isInvited");

    if (!user) {
      return res.json({
        success: false,
        found: false,
        message: "User not found with this email",
        email: email.toLowerCase().trim(), // Return searched email for auto-fill
      });
    }

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
    res.status(500).json({ 
      success: false,
      message: "Something went wrong" 
    });
  }
};

// ✅ Add existing (registered) user to society
// ✅ UPDATED: Send invitation instead of direct add
export const addExistingMember = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { userId, roleInSociety = "member", unitId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    // Check admin permission
    const adminRel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      roleInSociety: "admin",
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return res.status(403).json({
        message: "Only admin can send invitations",
      });
    }

    // Validate user exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already in society
    const existingRel = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
    });

    if (existingRel) {
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

    return res.status(201).json({
      success: true,
      message: "Invitation sent to user",
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Error in addExistingMember controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 📧 Invite non-registered user (create placeholder + send invite)
export const inviteNewMember = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { name, email, phone, roleInSociety = "member", unitId } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        message: "Name, email, and phone are required" 
      });
    }

    // Validate society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    // Check admin permission
    const adminRel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      roleInSociety: "admin",
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return res.status(403).json({ 
        message: "Only admin can invite members" 
      });
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
        return res.status(409).json({ 
          message: "User is already a member of this society" 
        });
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
    const invitationExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

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
    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/activate-account?token=${invitationToken}`;
    
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
      // Don't fail the whole request if email fails
      // User is still created, admin can resend later
    }

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
    res.status(500).json({ message: "Something went wrong" });
  }
};


// 📋 Get all members of a society
export const getSocietyMembers = async (req, res) => {
  try {
    const { societyId } = req.params;

    // Validate society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    // Check permission
    const userRel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
    });

    if (!userRel && req.user.globalRole !== "super_admin") {
      return res.status(403).json({ 
        message: "You don't have access to this society" 
      });
    }

    const members = await UserSocietyRel.find({ 
      society: societyId,
      isActive: true 
    })
      .populate("user", "name email phone isActivated isInvited")
      .populate("unit", "unitNumber type")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: members.length,
      members: members.map(rel => ({
        _id: rel._id,
        user: rel.user,
        roleInSociety: rel.roleInSociety,
        unit: rel.unit,
        joinedAt: rel.joinedAt,
        isActive: rel.isActive,
      })),
    });
  } catch (error) {
    console.error("Error in getSocietyMembers controller", error);
    res.status(500).json({ message: "Something went wrong" });
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
      return res.status(403).json({ 
        message: "Only admin can remove members" 
      });
    }

    // Find member
    const memberRel = await UserSocietyRel.findOne({
      _id: memberId,
      society: societyId,
    });

    if (!memberRel) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Prevent admin from removing themselves
    if (memberRel.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: "You cannot remove yourself" 
      });
    }

    await UserSocietyRel.findByIdAndDelete(memberId);

    return res.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Error in removeMember controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 📝 Update member role
export const updateMemberRole = async (req, res) => {
  try {
    const { societyId, memberId } = req.params;
    const { roleInSociety } = req.body;

    if (!roleInSociety) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Check admin permission
    const adminRel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      roleInSociety: "admin",
    });

    if (!adminRel && req.user.globalRole !== "super_admin") {
      return res.status(403).json({ 
        message: "Only admin can update member roles" 
      });
    }

    const memberRel = await UserSocietyRel.findOneAndUpdate(
      { _id: memberId, society: societyId },
      { roleInSociety },
      { new: true }
    ).populate("user", "name email phone");

    if (!memberRel) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.json({
      success: true,
      message: "Member role updated successfully",
      member: memberRel,
    });
  } catch (error) {
    console.error("Error in updateMemberRole controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
