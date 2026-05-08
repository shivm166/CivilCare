import mongoose from "mongoose";

const maintenanceBillSchema = new mongoose.Schema(
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
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    maintenanceRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceRule",
      required: true,
    },
    billNumber: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `BILL-${year}${month}-${random}`;
      },
    },
    billingMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    billingYear: {
      type: Number,
      required: true,
    },
    baseAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    penaltyAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "partially_paid", "paid", "overdue"],
      default: "pending",
      index: true,
    },
    isMaintenancePaid: {
      type: Boolean,
      default: false,
    },
    isPenaltyPaid: {
      type: Boolean,
      default: false,
    },
    maintenancePayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    penaltyPayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
maintenanceBillSchema.index({ society: 1, billingMonth: 1, billingYear: 1 });
maintenanceBillSchema.index({ user: 1, status: 1 });
maintenanceBillSchema.index({ dueDate: 1 });

// Virtual for checking if bill is overdue
maintenanceBillSchema.virtual("isOverdue").get(function () {
  if (this.status === "paid") return false;
  return new Date() > this.dueDate;
});

// Virtual for days overdue
maintenanceBillSchema.virtual("daysOverdue").get(function () {
  if (!this.isOverdue) return 0;
  const today = new Date();
  const diffTime = Math.abs(today - this.dueDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to calculate current penalty based on maintenance rule
maintenanceBillSchema.methods.calculateCurrentPenalty = function (rule) {
  if (!rule || !rule.penaltyEnabled || !this.isOverdue) {
    return 0;
  }

  const daysOverdue = this.daysOverdue;
  const gracePeriod = rule.gracePeriod || 0;

  // No penalty during grace period
  if (daysOverdue <= gracePeriod) {
    return 0;
  }

  const daysAfterGrace = daysOverdue - gracePeriod;

  switch (rule.penaltyType) {
    case "fixed":
      return rule.penaltyValue;

    case "percentage":
      return Math.round((this.baseAmount * rule.penaltyValue) / 100);

    case "daily":
      return rule.penaltyValue * daysAfterGrace;

    case "percentage_daily":
      const dailyRate = rule.penaltyValue / 100;
      return Math.round(this.baseAmount * dailyRate * daysAfterGrace);

    default:
      return 0;
  }
};

// Method to update bill status
maintenanceBillSchema.methods.updateStatus = function () {
  if (this.isMaintenancePaid && this.isPenaltyPaid) {
    this.status = "paid";
  } else if (this.isMaintenancePaid || this.isPenaltyPaid) {
    this.status = "partially_paid";
  } else if (this.isOverdue) {
    this.status = "overdue";
  } else {
    this.status = "pending";
  }
};

// Pre-save hook to update status
maintenanceBillSchema.pre("save", function (next) {
  this.updateStatus();
  next();
});

// Ensure virtuals are included in JSON
maintenanceBillSchema.set("toJSON", { virtuals: true });
maintenanceBillSchema.set("toObject", { virtuals: true });

export const MaintenanceBill = mongoose.model(
  "MaintenanceBill",
  maintenanceBillSchema
);
