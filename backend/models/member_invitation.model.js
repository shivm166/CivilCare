import mongoose from "mongoose";

const memberInvitationSchema = new mongoose.Schema(
  {
    invitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roleInSociety: {
      type: String,
      enum: ["admin", "member", "tenant", "owner"],
      default: "member",
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one pending invitation per user per society
memberInvitationSchema.index(
  { invitedUser: 1, society: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  }
);

export const MemberInvitation = mongoose.model(
  "MemberInvitation",
  memberInvitationSchema,
  "member_invitation"
);
