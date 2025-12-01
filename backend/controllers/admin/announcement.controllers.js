import { Announcement } from "../../models/announcement.model.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
  sendSuccessResponseWithPagination,
} from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";

const {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
} = STATUS_CODES;

// ==================== ADMIN CONTROLLERS ====================

// Create Announcement (Admin Only)
export const createAnnouncement = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "You must be part of an active society to create an announcement."
      );
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Title and description are required"
      );
    }

    const announcement = new Announcement({
      title,
      description,
      society: societyId,
      createdBy: userId,
    });

    await announcement.save();
    await announcement.populate("createdBy", "name email");

    return sendSuccessResponse(
      res,
      CREATED,
      announcement,
      "Announcement created successfully"
    );
  } catch (error) {
    console.error("Error in createAnnouncement:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

// Get All Announcements (Admin) - WITH PAGINATION
export const getAllAnnouncementsAdmin = async (req, res) => {
  try {
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "No active society context found."
      );
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalAnnouncements = await Announcement.countDocuments({
      society: societyId,
    });

    const announcements = await Announcement.find({ society: societyId })
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Pagination metadata
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalAnnouncements / limit),
      totalItems: totalAnnouncements,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(totalAnnouncements / limit),
      hasPreviousPage: page > 1,
    };

    return sendSuccessResponseWithPagination(
      res,
      SUCCESS,
      announcements,
      "Announcements fetched successfully",
      pagination
    );
  } catch (error) {
    console.error("Error in getAllAnnouncementsAdmin:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

// Update Announcement (Admin Only)
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Access denied. No active society context."
      );
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return sendErrorResponse(res, NOT_FOUND, null, "Announcement not found");
    }

    if (announcement.society.toString() !== societyId.toString()) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You can only update announcements in your society."
      );
    }

    if (title) announcement.title = title;
    if (description) announcement.description = description;

    await announcement.save();
    await announcement.populate("createdBy", "name email");

    return sendSuccessResponse(
      res,
      SUCCESS,
      announcement,
      "Announcement updated successfully"
    );
  } catch (error) {
    console.error("Error in updateAnnouncement:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

// Delete Announcement (Admin Only)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Access denied. No active society context."
      );
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return sendErrorResponse(res, NOT_FOUND, null, "Announcement not found");
    }

    if (announcement.society.toString() !== societyId.toString()) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You can only delete announcements in your society."
      );
    }

    await Announcement.findByIdAndDelete(id);

    return sendSuccessResponse(
      res,
      SUCCESS,
      null,
      "Announcement deleted successfully"
    );
  } catch (error) {
    console.error("Error in deleteAnnouncement:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

// Reply to Comment (Admin Only)
export const replyToComment = async (req, res) => {
  try {
    const { announcementId, commentId } = req.params;
    const { reply } = req.body;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Access denied. No active society context."
      );
    }

    if (!reply || reply.trim() === "") {
      return sendErrorResponse(res, BAD_REQUEST, null, "Reply text is required");
    }

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return sendErrorResponse(res, NOT_FOUND, null, "Announcement not found");
    }

    if (announcement.society.toString() !== societyId.toString()) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You can only reply to comments in your society."
      );
    }

    const comment = announcement.comments.id(commentId);

    if (!comment) {
      return sendErrorResponse(res, NOT_FOUND, null, "Comment not found");
    }

    comment.adminReply = reply;
    comment.repliedAt = new Date();

    await announcement.save();
    await announcement.populate("createdBy", "name email");
    await announcement.populate("comments.user", "name email");

    return sendSuccessResponse(
      res,
      SUCCESS,
      announcement,
      "Reply added successfully"
    );
  } catch (error) {
    console.error("Error in replyToComment:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

// ==================== USER/MEMBER CONTROLLERS ====================

// Get All Announcements (User/Member) - WITH PAGINATION
export const getAllAnnouncementsUser = async (req, res) => {
  try {
    const societyId = req.society?._id;

    if (!societyId) {
      return sendSuccessResponse(res, SUCCESS, []);
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalAnnouncements = await Announcement.countDocuments({
      society: societyId,
      isActive: true,
    });

    const announcements = await Announcement.find({
      society: societyId,
      isActive: true,
    })
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Pagination metadata
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalAnnouncements / limit),
      totalItems: totalAnnouncements,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(totalAnnouncements / limit),
      hasPreviousPage: page > 1,
    };

    return sendSuccessResponseWithPagination(
      res,
      SUCCESS,
      announcements,
      "Announcements fetched successfully",
      pagination
    );
  } catch (error) {
    console.error("Error in getAllAnnouncementsUser:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
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
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "You must be part of an active society to comment."
      );
    }

    if (!comment || comment.trim() === "") {
      return sendErrorResponse(res, BAD_REQUEST, null, "Comment text is required");
    }

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return sendErrorResponse(res, NOT_FOUND, null, "Announcement not found");
    }

    if (announcement.society.toString() !== societyId.toString()) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You can only comment on announcements in your society."
      );
    }

    announcement.comments.push({
      user: userId,
      comment: comment.trim(),
    });

    await announcement.save();
    await announcement.populate("createdBy", "name email");
    await announcement.populate("comments.user", "name email");

    return sendSuccessResponse(
      res,
      CREATED,
      announcement,
      "Comment added successfully"
    );
  } catch (error) {
    console.error("Error in addComment:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};
