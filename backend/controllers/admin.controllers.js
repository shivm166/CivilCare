import { UserSocietyRel } from "../models/user_society_rel.model.js";
import { Society } from "../models/society.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// Helper function for relative time
function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7)
    return `${Math.floor(days / 7)} week${
      Math.floor(days / 7) > 1 ? "s" : ""
    } ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}

export const getSocietyWiseUserCount = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Find admin's society
    const adminSociety = await UserSocietyRel.findOne({
      user: userId,
      roleInSociety: "admin",
      isActive: true,
    }).populate("society");

    if (!adminSociety) {
      return res.status(404).json({
        success: false,
        message: "You are not admin of any society",
      });
    }

    const societyId = adminSociety.society._id;

    // Total members count
    const totalSocietyMembers = await UserSocietyRel.countDocuments({
      society: societyId,
      isActive: true,
    });

    // Unique users count
    const uniqueUsers = await UserSocietyRel.distinct("user", {
      society: societyId,
      isActive: true,
    });
    const totalUsers = uniqueUsers.length;

    // Recent 3 members
    const recentMembers = await UserSocietyRel.find({
      society: societyId,
      isActive: true,
    })
      .populate("user", "name email phone")
      .populate("building", "name")
      .populate("unit", "unitNumber")
      .sort({ joinedAt: -1 })
      .limit(3);

    const formattedMembers = recentMembers.map((member) => ({
      id: member._id,
      name: member.user?.name || "Unknown",
      role: member.roleInSociety,
      building: member.building?.name || member.unit?.unitNumber || "N/A",
      joinedDate: getRelativeTime(member.joinedAt),
    }));

    // Complaints (if model exists)
    let totalComplaints = 0;
    let pendingComplaints = 0;
    let resolvedComplaints = 0;
    let recentComplaints = [];

    try {
      const Complaint = mongoose.model("Complaint");

      totalComplaints = await Complaint.countDocuments({ society: societyId });
      pendingComplaints = await Complaint.countDocuments({
        society: societyId,
        status: { $in: ["pending", "in_progress"] },
      });
      resolvedComplaints = await Complaint.countDocuments({
        society: societyId,
        status: "resolved",
      });

      const complaints = await Complaint.find({ society: societyId })
        .populate("user", "name")
        .populate("unit", "unitNumber")
        .sort({ createdAt: -1 })
        .limit(3);

      recentComplaints = complaints.map((c) => ({
        id: c._id,
        title: c.title || c.description?.substring(0, 50) || "Complaint",
        status: c.status,
        building: c.unit?.unitNumber || "N/A",
        time: getRelativeTime(c.createdAt),
      }));
    } catch (err) {
      console.log("Complaint model not found");
    }

    // Announcements count
    let totalAnnouncements = 0;
    try {
      const Announcement = mongoose.model("Announcement");
      totalAnnouncements = await Announcement.countDocuments({
        society: societyId,
      });
    } catch (err) {
      console.log("Announcement model not found");
    }

    // Buildings count
    let totalBuildings = 0;
    try {
      const Building = mongoose.model("Building");
      totalBuildings = await Building.countDocuments({ society: societyId });
    } catch (err) {
      console.log("Building model not found");
    }

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSocietyMembers,
        totalBuildings,
        totalAnnouncements,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        society: {
          id: adminSociety.society._id,
          name: adminSociety.society.name,
          address: adminSociety.society.address,
        },
        recentMembers: formattedMembers,
        recentComplaints,
      },
    });
  } catch (error) {
    console.error("Error in getSocietyWiseUserCount:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch society stats",
      error: error.message,
    });
  }
};

export const getSocietyDetails = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const adminSociety = await UserSocietyRel.findOne({
      user: userId,
      roleInSociety: "admin",
      isActive: true,
    });

    if (!adminSociety) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
    }

    const societyId = adminSociety.society;
    const societyMembers = await UserSocietyRel.find({
      society: societyId,
      isActive: true,
    })
      .populate("user", "name email phone")
      .populate("building", "name")
      .populate("unit", "unitNumber")
      .sort({ joinedAt: -1 });

    const society = await Society.findById(societyId);

    return res.status(200).json({
      success: true,
      data: {
        society,
        members: societyMembers,
        totalMembers: societyMembers.length,
      },
    });
  } catch (error) {
    console.error("Error in getSocietyDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch society details",
      error: error.message,
    });
  }
};
