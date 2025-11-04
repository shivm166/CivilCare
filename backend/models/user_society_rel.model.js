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
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    roleInSociety: {
      type: String,
      enum: ["admin", "member", "tenant", "owner"], // Added tenant and owner for clarity
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

// Still ensures a user has only one relationship per society
userSocietyRelSchema.index({ user: 1, society: 1 }, { unique: true });

export const UserSocietyRel = mongoose.model(
  "UserSocietyRel",
  userSocietyRelSchema,
  "user_society_rel"
);
