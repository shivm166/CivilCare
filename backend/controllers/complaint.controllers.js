import mongoose from "mongoose";
import { Complaint } from "../models/complaint.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createComplaint = async (req, res) => {
  const {
    title,
    description,
    attachments,
    unit,
    priority,
    createdBy,
    society,
  } = req.body;

  if (priority && !["low", "medium", "high"].includes(priority))
    return res.status(400).json({ message: "Invalid priority." });
  if (unit && !isValidObjectId(unit))
    return res.status(400).json({ message: "Invalid unit id." });

  const complaint = await Complaint.create({
    title: title.trim(),
    description: description?.trim() || "",
    attachments: Array.isArray(attachments) ? attachments : [],
    unit: unit || undefined,
    priority: priority || "medium",
    createdBy,
    society,
  });

  return res
    .status(201)
    .json({ message: "Complaint created.", data: complaint });
};

export const getMyComplaints = async (req, res) => {
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

  if (!userId || !isValidObjectId(userId))
    return res
      .status(400)
      .json({ message: "userId must be a valid ObjectId." });
  if (!societyId || !isValidObjectId(societyId))
    return res
      .status(400)
      .json({ message: "societyId must be a valid ObjectId." });

  const filter = { createdBy: userId, society: societyId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (q?.trim()) {
    filter.$or = [
      { title: { $regex: q.trim(), $options: "i" } },
      { description: { $regex: q.trim(), $options: "i" } },
    ];
  }

  const numericLimit = Math.min(parseInt(limit, 10) || 10, 100);
  const numericPage = Math.max(parseInt(page, 10) || 1, 1);

  const [items, total] = await Promise.all([
    Complaint.find(filter)
      .sort(sort)
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit),
    Complaint.countDocuments(filter),
  ]);

  return res.json({
    data: items,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      pages: Math.ceil(total / numericLimit),
    },
  });
};

export const adminListComplaints = async (req, res) => {
  const {
    societyId,
    status,
    priority,
    unit,
    createdBy,
    from,
    to,
    q,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  if (!societyId || !isValidObjectId(societyId))
    return res
      .status(400)
      .json({ message: "societyId must be a valid ObjectId." });

  const filter = { society: societyId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (unit && isValidObjectId(unit)) filter.unit = unit;
  if (createdBy && isValidObjectId(createdBy)) filter.createdBy = createdBy;

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  if (q?.trim()) {
    filter.$or = [
      { title: { $regex: q.trim(), $options: "i" } },
      { description: { $regex: q.trim(), $options: "i" } },
    ];
  }

  const numericLimit = Math.min(parseInt(limit, 10) || 10, 100);
  const numericPage = Math.max(parseInt(page, 10) || 1, 1);

  const [items, total] = await Promise.all([
    Complaint.find(filter)
      .populate("createdBy", "name email")
      .populate("unit", "name number")
      .sort(sort)
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit),
    Complaint.countDocuments(filter),
  ]);

  return res.json({
    data: items,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      pages: Math.ceil(total / numericLimit),
    },
  });
};

export const adminUpdateComplaint = async (req, res) => {
  const { id } = req.params;
  const { societyId } = req.query;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid complaint id." });
  if (!societyId || !isValidObjectId(societyId))
    return res
      .status(400)
      .json({ message: "societyId must be a valid ObjectId." });

  const allowed = {};
  if (req.body.status) {
    if (
      !["pending", "in_progress", "resolved", "rejected"].includes(
        req.body.status
      )
    ) {
      return res.status(400).json({ message: "Invalid status." });
    }
    allowed.status = req.body.status;
  }
  if (req.body.priority) {
    if (!["low", "medium", "high"].includes(req.body.priority)) {
      return res.status(400).json({ message: "Invalid priority." });
    }
    allowed.priority = req.body.priority;
  }
  if (req.body.unit) {
    if (!isValidObjectId(req.body.unit)) {
      return res.status(400).json({ message: "Invalid unit id." });
    }
    allowed.unit = req.body.unit;
  }

  const updated = await Complaint.findOneAndUpdate(
    { _id: id, society: societyId },
    { $set: allowed },
    { new: true }
  );

  if (!updated)
    return res.status(404).json({ message: "Complaint not found." });
  return res.json({ message: "Complaint updated.", data: updated });
};
