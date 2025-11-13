import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    // attachments: [String],
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "closed"],
      default: "pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    society: { type: mongoose.Schema.Types.ObjectId, ref: "Society" },
    // unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

complaintSchema.index({ society: 1, status: 1 });

export const Complaint = mongoose.model(
  "Complaint",
  complaintSchema,
  "complaint"
);
