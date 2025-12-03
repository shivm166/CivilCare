import mongoose from "mongoose";

const maintenanceBillSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
      index: true,
    },
    resident: {
      type: mongoose.Schema.Types.ObjectId, // primary resident/owner
      ref: "User",
      required: true,
    },
    rule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceRule",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    forMonth: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    lateFeeApplied: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number, // amount + lateFeeApplied
      required: true,
    },
    paymentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenancePayment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const maintenanceBill = mongoose.model(
  "MaintenanceBill",
  maintenanceBillSchema,
  "maintenance_bill"
);
