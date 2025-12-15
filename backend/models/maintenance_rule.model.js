import mongoose from "mongoose";

const maintenanceRuleSchema = new mongoose.Schema(
  {
    ruleName: {
      type: String,
      required: true,
      trim: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    ruleType: {
      type: String,
      enum: ["general", "building_specific"],
      required: true,
      default: "general",
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },
    amountType: {
      type: String,
      enum: ["flat", "bhk_wise"],
      required: true,
      default: "flat",
    },
    amount: {
      type: Number,
      default: 0,
    },
    bhkWiseAmounts: {
      "1bhk": { type: Number, default: 0 },
      "2bhk": { type: Number, default: 0 },
      "3bhk": { type: Number, default: 0 },
      penthouse: { type: Number, default: 0 },
    },
    billingDay: {
      type: Number,
      required: true,
      min: 1,
      max: 28,
    },
    dueDays: {
      type: Number,
      required: true,
      default: 5,
      min: 0,
    },
    penaltyEnabled: {
      type: Boolean,
      default: false,
    },
    penaltyType: {
      type: String,
      enum: ["percentage", "fixed", "daily"],
      default: "percentage",
    },
    penaltyValue: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Performance indexes
maintenanceRuleSchema.index({ society: 1, isActive: 1 });
maintenanceRuleSchema.index({ building: 1 });

// Unique constraint: Only ONE general rule per society
maintenanceRuleSchema.index(
  { society: 1, ruleType: 1 },
  {
    unique: true,
    partialFilterExpression: {
      ruleType: "general",
    },
  }
);

// Unique constraint: Only ONE building-specific rule per building
maintenanceRuleSchema.index(
  { society: 1, ruleType: 1, building: 1 },
  {
    unique: true,
    partialFilterExpression: {
      ruleType: "building_specific",
      building: { $type: "objectId" },
    },
  }
);

maintenanceRuleSchema.virtual("priority").get(function () {
  if (this.ruleType === "building_specific") return 2;
  return 1;
});

maintenanceRuleSchema.methods.appliesTo = function (unit) {
  if (this.ruleType === "general") return true;
  
  if (this.ruleType === "building_specific") {
    return this.building?.toString() === unit.building?.toString();
  }
  
  return false;
};

maintenanceRuleSchema.methods.calculateAmount = function (unit) {
  if (this.amountType === "flat") {
    return this.amount || 0;
  }

  const unitBhkType = unit.bhkType;
  const bhkWiseAmounts = this.bhkWiseAmounts || {};
  
  let amount = bhkWiseAmounts[unitBhkType];
  
  if (amount === undefined || amount === null) {
    const lowerBhkType = unitBhkType.toLowerCase();
    
    for (const key in bhkWiseAmounts) {
      if (key.toLowerCase() === lowerBhkType) {
        amount = bhkWiseAmounts[key];
        break;
      }
    }
  }
  
  return amount || 0;
};

maintenanceRuleSchema.methods.calculatePenalty = function (amount, daysLate) {
  if (!this.penaltyEnabled || daysLate <= 0) return 0;
  
  switch (this.penaltyType) {
    case "percentage":
      return (amount * this.penaltyValue) / 100;
    case "fixed":
      return this.penaltyValue;
    case "daily":
      return this.penaltyValue * daysLate;
    default:
      return 0;
  }
};

export const MaintenanceRule = mongoose.model(
  "MaintenanceRule",
  maintenanceRuleSchema,
  "maintenance_rules"
);
