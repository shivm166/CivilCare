import mongoose from "mongoose";
import { Complaint } from "../models/complaint.model.js";
import { request } from "express";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ---------------- USER: CREATE COMPLAINT ----------------
export const createComplaint = async (req, res) => {
  try {
    const { title, description, priority, society } = req.body;

    // create new complaint
    const complaint = await Complaint.create({
      title,
      description,
      priority: priority || "medium",
      createdBy: req.user._id,
      society,
    });

    // populate user (creator) and society info in response
    await complaint.populate([
      { path: "createdBy", select: "_id name email phone" },
      { path: "society", select: "_id name city address" },
    ]);

    res.status(201).json({
      message: "Complaint created successfully.",
      data: complaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({
      message: "Failed to create complaint.",
      error: error.message,
    });
  }
};

// ---------------- USER: GET MY COMPLAINTS ----------------
// ---------------- USER: GET MY COMPLAINTS ----------------
export const get_complaints = async (req, res) => {
  try {
    const userId = req.user._id;

    const complaints = await Complaint.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("society", "name") // optional: show society name
      .lean();

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaints",
    });
  }
};

// ---------------- ADMIN: LIST ALL COMPLAINTS ----------------

// ---------------- ADMIN: LIST COMPLAINTS (with filters + pagination) ---------------
export const adminListComplaints = async (req, res) => {
  try {
    const {
      societyId,
      status,
      priority,
      createdBy,
      from,
      to,
      q,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Base filter - societyId is REQUIRED for admin scoping
    if (!societyId || !isValidObjectId(societyId)) {
      return res.status(400).json({ message: "Valid societyId is required." });
    }

    const filter = { society: societyId };

    // Optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (createdBy && isValidObjectId(createdBy)) filter.createdBy = createdBy;

    // Date range
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Search in title/description
    if (q) {
      const searchRegex = { $regex: q.trim(), $options: "i" };
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const skip = (page - 1) * limit;
    const limitNum = Math.min(Number(limit), 100); // cap limit

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("createdBy", "name email phone")
        .populate("society", "name city")
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Complaint.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      message: "Complaints fetched successfully.",
      data: complaints,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
        hasNext: Number(page) < Math.ceil(total / limitNum),
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Admin List Complaints Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};

// ---------------- ADMIN: UPDATE COMPLAINT (status/priority only) ---------------
export const adminUpdateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { societyId } = req.query;
    const { status, priority } = req.body;

    // Validation
    if (!id || !isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Valid complaint ID is required." });
    }
    if (!societyId || !isValidObjectId(societyId)) {
      return res.status(400).json({ message: "Valid societyId is required." });
    }

    const allowedUpdates = {};
    if (status) allowedUpdates.status = status;
    if (priority) allowedUpdates.priority = priority;
    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const updatedComplaint = await Complaint.findOneAndUpdate(
      { _id: id, society: societyId },
      allowedUpdates,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email phone")
      .populate("society", "name city")
      .lean();

    if (!updatedComplaint) {
      return res
        .status(404)
        .json({ message: "Complaint not found or access denied." });
    }

    return res.json({
      success: true,
      message: "Complaint updated successfully.",
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Admin Update Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint.",
    });
  }
};
