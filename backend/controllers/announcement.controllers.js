import { Announcement } from "../models/announcement.model.js";

// ==================== ADMIN CONTROLLERS ====================

// Create Announcement (Admin Only)
export const createAnnouncement = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: "You must be part of an active society to create an announcement.",
      });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const announcement = new Announcement({
      title,
      description,
      society: societyId,
      createdBy: userId,
    });

    await announcement.save();
    await announcement.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error in createAnnouncement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Announcements (Admin)
export const getAllAnnouncementsAdmin = async (req, res) => {
  try {
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: "No active society context found.",
      });
    }

    const announcements = await Announcement.find({ society: societyId })
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error in getAllAnnouncementsAdmin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Announcement (Admin Only)
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. No active society context.",
      });
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Check if announcement belongs to the same society
    if (announcement.society.toString() !== societyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update announcements in your society.",
      });
    }

    if (title) announcement.title = title;
    if (description) announcement.description = description;

    await announcement.save();
    await announcement.populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error in updateAnnouncement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Announcement (Admin Only)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. No active society context.",
      });
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Check if announcement belongs to the same society
    if (announcement.society.toString() !== societyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete announcements in your society.",
      });
    }

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAnnouncement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Reply to Comment (Admin Only)
export const replyToComment = async (req, res) => {
  try {
    const { announcementId, commentId } = req.params;
    const { reply } = req.body;
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. No active society context.",
      });
    }

    if (!reply || reply.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Reply text is required",
      });
    }

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Check if announcement belongs to the same society
    if (announcement.society.toString() !== societyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only reply to comments in your society.",
      });
    }

    const comment = announcement.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.adminReply = reply;
    comment.repliedAt = new Date();

    await announcement.save();
    await announcement.populate("createdBy", "name email");
    await announcement.populate("comments.user", "name email");

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error in replyToComment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== USER/MEMBER CONTROLLERS ====================

// Get All Announcements (User/Member)
export const getAllAnnouncementsUser = async (req, res) => {
  try {
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const announcements = await Announcement.find({
      society: societyId,
      isActive: true,
    })
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error in getAllAnnouncementsUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Add Comment to Announcement (User/Member)
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: "You must be part of an active society to comment.",
      });
    }

    if (!comment || comment.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Check if announcement belongs to the same society
    if (announcement.society.toString() !== societyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only comment on announcements in your society.",
      });
    }

    announcement.comments.push({
      user: userId,
      comment: comment.trim(),
    });

    await announcement.save();
    await announcement.populate("createdBy", "name email");
    await announcement.populate("comments.user", "name email");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
