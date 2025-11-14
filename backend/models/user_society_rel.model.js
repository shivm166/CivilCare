import mongoose from "mongoose";

const userSocietyRelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    roleInSociety: {
      type: String,
      enum: ["admin", "member", "tenant", "owner"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique user + society relation
userSocietyRelSchema.index({ user: 1, society: 1 }, { unique: true });

export const UserSocietyRel = mongoose.model(
  "UserSocietyRel",
  userSocietyRelSchema,
  "user_society_rel"
);
