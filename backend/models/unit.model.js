import { ref, required } from "joi";
import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["owner_occupied", "tenant_occupied", "vacant"],
      default: "owner_occupied",
    },
    primaryResident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

unitSchema.index({ society: 1, unitNumber: 1 }, { unique: true });

export const Unit = mongoose.model("Unit", unitSchema, "unit");
