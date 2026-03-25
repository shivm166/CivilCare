import mongoose from "mongoose";

const fundTransactionSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },
    
    // Transaction Type
    transactionType: {
      type: String,
      enum: ["incoming", "outgoing"],
      required: true,
      index: true,
    },
    
    // Transaction Category
    category: {
      type: String,
      enum: ["maintenance_payment", "penalty_payment", "admin_withdrawal"],
      required: true,
    },
    
    // Amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Description
    description: {
      type: String,
      required: true,
      trim: true,
    },
    
    // References
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Null for admin withdrawals by society
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null, // Present for incoming payments
    },
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceBill",
      default: null,
    },
    
    // Admin details (for withdrawals)
    withdrawnBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    withdrawalReason: {
      type: String,
      default: "",
      trim: true,
    },
    
    // Balance after transaction
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Transaction metadata
    transactionDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    
    // Additional info
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
fundTransactionSchema.index({ society: 1, transactionDate: -1 });
fundTransactionSchema.index({ society: 1, transactionType: 1 });
fundTransactionSchema.index({ society: 1, category: 1 });

export const FundTransaction = mongoose.model(
  "FundTransaction",
  fundTransactionSchema,
  "fund_transactions"
);
