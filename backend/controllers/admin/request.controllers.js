import { Society } from "../../models/society.model.js";
import { UserRequest } from "../../models/user_request.model.js";
import { UserSocietyRel } from "../../models/user_society_rel.model.js";
import { sendErrorResponse } from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";

const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = STATUS_CODES;

// ==================== SEARCH SOCIETY BY JOINING CODE ====================
export const searchSocietyByCode = async (req, res) => {
  try {
    const { code } = req.params;

    // Convert to uppercase and trim whitespace
    const joiningCode = code.toUpperCase().trim();

    // Search by JoiningCode instead of _id
    const society = await Society.findOne({ JoiningCode: joiningCode })
      .select("_id name address city state pincode JoiningCode")
      .lean();

    if (!society) {
      return sendErrorResponse(
        res,
        NOT_FOUND,
        null,
        "Society not found with this joining code"
      );
    }

    // Keep original flat success response format
    res.status(200).json({
      message: "Society found successfully",
      society,
    });
  } catch (error) {
    console.error("Error searching society:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== SEND JOIN REQUEST ====================
export const sendJoinRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { societyId, message } = req.body;

    // Check if society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return sendErrorResponse(res, NOT_FOUND, null, "Society not found");
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
        "You are already a member of this society"
      );
    }

    // Check if request already exists
    const existingRequest = await UserRequest.findOne({
      user: userId,
      society: societyId,
      status: "pending",
    });

    if (existingRequest) {
      return sendErrorResponse(
        res,
        CONFLICT,
        null,
        "You have already sent a request to this society"
      );
    }

    // Create new request
    const newRequest = await UserRequest.create({
      user: userId,
      society: societyId,
      message: message || "",
    });

    const populatedRequest = await UserRequest.findById(newRequest._id)
      .populate("society", "name city state JoiningCode")
      .populate("user", "name email");

    // Keep original flat success response format
    res.status(201).json({
      message: "Join request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Error sending join request:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== GET MY REQUESTS ====================
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await UserRequest.find({ user: userId })
      .populate("society", "name address city state")
      .sort({ createdAt: -1 });

    // Keep original flat success response format
    res.status(200).json({
      message: "Requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== GET ALL REQUESTS FOR SOCIETY (Admin Only) ====================
export const getAllRequestsForSociety = async (req, res) => {
  try {
    const userId = req.user._id;
    const { societyId } = req.params;

    // Check if user is admin of this society
    const adminRel = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
      roleInSociety: "admin",
      isActive: true,
    });

    if (!adminRel) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You are not authorized to view requests for this society"
      );
    }

    // Get all pending requests for this society
    const requests = await UserRequest.find({
      society: societyId,
      status: "pending",
    })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    // Keep original flat success response format
    res.status(200).json({
      message: "Requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.error("Error fetching society requests:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== ACCEPT REQUEST (Admin Only) ====================
export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    // Find the request
    const request = await UserRequest.findById(requestId);
    if (!request) {
      return sendErrorResponse(res, NOT_FOUND, null, "Request not found");
    }

    // Check if already processed
    if (request.status !== "pending") {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Request has already been ${request.status}`
      );
    }

    // Check if user is admin of this society
    const adminRel = await UserSocietyRel.findOne({
      user: userId,
      society: request.society,
      roleInSociety: "admin",
      isActive: true,
    });

    if (!adminRel) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You are not authorized to accept requests for this society"
      );
    }

    // Update request status
    request.status = "approved";
    await request.save();

    // Add user to society
    await UserSocietyRel.create({
      user: request.user,
      society: request.society,
      roleInSociety: "member",
    });

    const populatedRequest = await UserRequest.findById(requestId)
      .populate("user", "name email")
      .populate("society", "name city state");

    // Keep original flat success response format
    res.status(200).json({
      message: "Request accepted successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};

// ==================== REJECT REQUEST (Admin Only) ====================
export const rejectRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    // Find the request
    const request = await UserRequest.findById(requestId);
    if (!request) {
      return sendErrorResponse(res, NOT_FOUND, null, "Request not found");
    }

    // Check if already processed
    if (request.status !== "pending") {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Request has already been ${request.status}`
      );
    }

    // Check if user is admin of this society
    const adminRel = await UserSocietyRel.findOne({
      user: userId,
      society: request.society,
      roleInSociety: "admin",
      isActive: true,
    });

    if (!adminRel) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You are not authorized to reject requests for this society"
      );
    }

    // Update request status
    request.status = "rejected";
    await request.save();

    const populatedRequest = await UserRequest.findById(requestId)
      .populate("user", "name email")
      .populate("society", "name city state");

    // Keep original flat success response format
    res.status(200).json({
      message: "Request rejected successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Error rejecting request:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Internal server error");
  }
};
