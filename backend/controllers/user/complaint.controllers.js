import Complaint from "../../models/complaint.model.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
  sendSuccessResponseWithPagination,
  buildPagination,
} from "../../utils/response.js";
import { STATUS_CODES } from "../../utils/status.js";

const {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
} = STATUS_CODES;

export const createComplaint = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = req.society?._id;

    if (!societyId) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "You must be part of an active society to create a complaint."
      );
    }

    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        "Title, description, and priority required"
      );
    }

    const normalizedPriority = priority.toLowerCase();
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(normalizedPriority)) {
      return sendErrorResponse(res, BAD_REQUEST, null, "Invalid priority");
    }

    const complaint = new Complaint({
      title,
      description,
      priority: normalizedPriority,
      createdBy: userId,
      society: societyId,
    });

    await complaint.save();
    await complaint.populate("createdBy", "name email");

    return sendSuccessResponse(res, CREATED, complaint, "Complaint created");
  } catch (error) {
    console.error("Error in createComplaint:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const getComplaints = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(
        res,
        UNAUTHORIZED,
        null,
        "User not authenticated."
      );
    }

    const societyId = req.society?._id;

    // Handle case where no society is selected, return empty list
    if (!societyId) {
      return sendSuccessResponseWithPagination(
        res,
        SUCCESS,
        [],
        "User complaints fetched successfully",
        buildPagination(0, 10, 1)
      );
    }

    const { status, priority, page = 1, limit = 10 } = req.query;

    const filter = {
      createdBy: userId,
      society: societyId,
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority.toLowerCase();

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select("-__v")
      .exec();

    const total = await Complaint.countDocuments(filter);
    const pagination = buildPagination(total, limit, page);

    return sendSuccessResponseWithPagination(
      res,
      SUCCESS,
      complaints,
      "User complaints fetched successfully",
      pagination
    );
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error.");
  }
};

export const getAllComplaints = async (req, res) => {
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

    const { status, priority, page = 1, limit = 10 } = req.query;

    const filter = { society: societyId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority.toLowerCase();

    const complaints = await Complaint.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Complaint.countDocuments(filter);
    const pagination = buildPagination(total, limit, page);

    return sendSuccessResponseWithPagination(
      res,
      SUCCESS,
      complaints,
      "All complaints fetched successfully",
      pagination
    );
  } catch (error) {
    console.error("Error in getAllComplaints:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const adminSocietyId = req.society?._id;

    if (!adminSocietyId) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "Access denied. No active society context."
      );
    }

    const validStatuses = ["pending", "in_progress", "resolved", "closed"];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return sendErrorResponse(
        res,
        BAD_REQUEST,
        null,
        `Status must be one of: ${validStatuses.join(", ")}`
      );
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return sendErrorResponse(res, NOT_FOUND, null, "Complaint not found");
    }

    if (complaint.society.toString() !== adminSocietyId.toString()) {
      return sendErrorResponse(
        res,
        FORBIDDEN,
        null,
        "You can only update complaints in your society."
      );
    }

    complaint.status = status.toLowerCase();
    await complaint.save();
    await complaint.populate("createdBy", "name email");

    return sendSuccessResponse(
      res,
      SUCCESS,
      complaint,
      "Status updated successfully"
    );
  } catch (error) {
    console.error("Update status error:", error);
    return sendErrorResponse(res, SERVER_ERROR, error, "Server error");
  }
};

export const getTotalComplaints = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const pending = await Complaint.countDocuments({ status: "pending" });
    const inProgress = await Complaint.countDocuments({
      status: "in_progress",
    });

    const data = {
      totalComplaints: total,
      resolved,
      pending,
      inProgress,
    };

    return sendSuccessResponse(
      res,
      SUCCESS,
      data,
      "Complaint stats fetched successfully"
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      SERVER_ERROR,
      error,
      "Failed to fetch complaint stats"
    );
  }
};
