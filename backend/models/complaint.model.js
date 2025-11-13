import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "rejected"],
      default: "pending",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    society: { type: mongoose.Schema.Types.ObjectId, ref: "Society" },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

complaintSchema.index({ society: 1, status: 1 });

const Complaint = mongoose.model("Complaint", complaintSchema, "complaint");
export default Complaint;
