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
export const getMyComplaints = async (req, res) => {
  try {
    const {
      userId,
      societyId,
      status,
      priority,
      q,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const filter = { createdBy: userId, society: societyId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("createdBy", "_id name email phone") // who created
        .populate("society", "_id name city address") // society info
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Complaint.countDocuments(filter),
    ]);

    res.json({
      message: "Complaints fetched successfully.",
      data: complaints,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({
      message: "Failed to fetch complaints.",
      error: error.message,
    });
  }
};

// ---------------- ADMIN: LIST ALL COMPLAINTS ----------------
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

    const filter = { society: societyId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (createdBy && isValidObjectId(createdBy)) filter.createdBy = createdBy;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("createdBy", "_id name email phone")
        .populate("society", "_id name city address")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Complaint.countDocuments(filter),
    ]);

    res.json({
      message: "All complaints fetched successfully.",
      data: complaints,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({
      message: "Failed to fetch complaints.",
      error: error.message,
    });
  }
};

// ---------------- ADMIN: UPDATE COMPLAINT ----------------
export const adminUpdateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { societyId } = req.query;
    const { status, priority } = req.body;

    const updatedComplaint = await Complaint.findOneAndUpdate(
      { _id: id, society: societyId },
      { status, priority },
      { new: true }
    )
      .populate("createdBy", "_id name email phone")
      .populate("society", "_id name city address");

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    res.json({
      message: "Complaint updated successfully.",
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({
      message: "Failed to update complaint.",
      error: error.message,
    });
  }
};
