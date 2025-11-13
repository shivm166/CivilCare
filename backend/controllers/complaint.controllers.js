// ES6 import (ensure .js extension in Node.js with ESM)
import Complaint from "../models/complaint.model.js";
import { User } from "../models/user.model.js";

// controllers/complaintsController.js
export const createComplaint = async (req, res) => {
  try {
    const userId = req.user.id;
    // ✅ FIX: Get society from middleware context, not User model
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: "You must be part of an active society to create a complaint.",
      });
    }

    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and priority required",
      });
    }

    const normalizedPriority = priority.toLowerCase();
    if (!["low", "medium", "high"].includes(normalizedPriority)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid priority" });
    }

    const complaint = new Complaint({
      title,
      description,
      priority: normalizedPriority,
      createdBy: userId,
      society: societyId, // ✅ FIX: Use the societyId from context
    });

    await complaint.save();

    // Populate createdBy name for response
    await complaint.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Complaint created",
      data: complaint,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ... (keep createComplaint, getAllComplaints, and updateComplaintStatus as they are) ...

export const getComplaints = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(200).json({
        success: true,
        data: [],

        pagination: { total: 0, page: 1, pages: 1, limit: 10 },
      });
    }

    const { status, priority, page = 1, limit = 10 } = req.query;

    // ✅ FIX: Filter by BOTH createdBy and the active society
    const filter = {
      createdBy: userId,
      society: societyId,
    };

    // Add optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority.toLowerCase();

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .select("-__v") // Optional: hide version field
      .exec();

    const total = await Complaint.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: complaints,

      pagination: {
        total,
        page: +page,
        pages: Math.ceil(total / +limit),
        limit: +limit,
      },
    });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

// ... (keep getAllComplaints and updateComplaintStatus as they are) ...

//admin

// controllers/complaint.controllers.js
export const getAllComplaints = async (req, res) => {
  try {
    // ✅ FIX: Get society from middleware context
    const societyId = req.society?._id;

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: "No active society context found.",
      });
    }

    const { status, priority, page = 1, limit = 10 } = req.query;

    // બધી કમ્પ્લેઇન્ટ એક જ સોસાયટીની હોવી જોઈએ
    const filter = { society: societyId }; // ✅ FIX: Use societyId from context

    // ફિલ્ટર્સ
    if (status) filter.status = status;
    if (priority) filter.priority = priority.toLowerCase();

    // ⛔ REMOVE: Admin check is already done by requireAdmin middleware
    // if (user.role !== "admin") { ... }

    const complaints = await Complaint.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .exec();

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: complaints,
      pagination: {
        total,
        page: +page,
        pages: Math.ceil(total / +limit),
        limit: +limit,
      },
    });
  } catch (error) {
    console.error("Error in getAllComplaints:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// controllers/complaint.controllers.js
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ FIX: Get society from middleware context
    const adminSocietyId = req.society?._id;

    if (!adminSocietyId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. No active society context.",
      });
    }

    // 1. Validate status
    const validStatuses = ["pending", "in_progress", "resolved", "closed"]; // ✅ ADDED "closed"
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // ⛔ REMOVE: Admin check is already done by requireAdmin middleware
    // const admin = await User.findById(adminId).select("role society");
    // if (!admin || admin.role !== "admin") { ... }

    // 3. Find complaint
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // 4. Check same society
    // ✅ FIX: Compare complaint's society with the admin's active society context
    if (complaint.society.toString() !== adminSocietyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update complaints in your society.",
      });
    }

    // 5. Update status
    complaint.status = status.toLowerCase();
    await complaint.save();

    // 6. Populate & return
    await complaint.populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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

    return res.json({
      success: true,
      totalComplaints: total,
      resolved,
      pending,
      inProgress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint stats",
    });
  }
};
