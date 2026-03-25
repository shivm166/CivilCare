import mongoose from "mongoose";

const societyFundSchema = new mongoose.Schema(
  {
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      unique: true,
      index: true,
    },
    
    // Fund Balance
    totalBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Tracking
    totalIncoming: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalOutgoing: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Statistics
    totalMaintenanceCollected: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPenaltyCollected: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWithdrawals: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Last updated
    lastTransactionDate: {
      type: Date,
      default: null,
    },
    
    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to add funds
societyFundSchema.methods.addFunds = function (amount, type = "maintenance") {
  this.totalBalance += amount;
  this.totalIncoming += amount;
  
  if (type === "maintenance") {
    this.totalMaintenanceCollected += amount;
  } else if (type === "penalty") {
    this.totalPenaltyCollected += amount;
  }
  
  this.lastTransactionDate = new Date();
};

// Method to withdraw funds
societyFundSchema.methods.withdrawFunds = function (amount) {
  if (amount > this.totalBalance) {
    throw new Error("Insufficient balance");
  }
  
  this.totalBalance -= amount;
  this.totalOutgoing += amount;
  this.totalWithdrawals += amount;
  this.lastTransactionDate = new Date();
};

export const SocietyFund = mongoose.model(
  "SocietyFund",
  societyFundSchema,
  "society_funds"
);
