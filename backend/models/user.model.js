import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.isInvited; // Password not required for invited users initially
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    globalRole: {
      type: String,
      enum: ["super_admin", "user"],
      default: "user",
    },
    
    // ✅ NEW FIELDS FOR INVITATION SYSTEM
    isInvited: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: true, // true for normal signup, false for invited users
    },
    invitationToken: {
      type: String,
      default: null,
    },
    invitationExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(7);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export const User = mongoose.model("User", userSchema, "user");
