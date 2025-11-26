import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    parkingNumber: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Allocation type: unit-based or general (member without unit)
    allocationType: {
      type: String,
      enum: ["unit_based", "general"],
      required: true,
    },

    // For unit-based parking
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },

    // For general parking (members without units)
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["two_wheeler", "four_wheeler", "bicycle", "other"],
      default: "two_wheeler",
    },

    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    parkingLevel: {
      type: String,
      enum: ["basement_3", "basement_2", "basement_1", "ground", "outside_society"],
      default: "ground",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    allocatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
parkingSchema.index({ society: 1, parkingNumber: 1 }, { unique: true });
parkingSchema.index({ society: 1, allocationType: 1 });
parkingSchema.index({ unit: 1 });
parkingSchema.index({ member: 1 });

export const Parking = mongoose.model("Parking", parkingSchema, "parkings");
