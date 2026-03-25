import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceBill",
      required: true,
    },
    
    // Payment Details
    paymentType: {
      type: String,
      enum: ["maintenance", "penalty"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Payment Method (Dummy for now)
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "cash"],
      default: "upi",
    },
    
    // Transaction Details
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    
    // Status
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
    
    // Additional Info
    paymentNote: {
      type: String,
      default: "",
    },
    
    // Metadata for dummy payment
    paymentMetadata: {
      cardLast4: String,
      upiId: String,
      bankName: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ society: 1, transactionDate: -1 });
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ bill: 1, paymentType: 1 });

export const Payment = mongoose.model("Payment", paymentSchema, "payments");
