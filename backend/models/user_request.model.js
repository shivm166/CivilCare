import mongoose from "mongoose";

const userRequestSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        },
        society: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Society" 
        },
        message: { 
            type: String, 
            trim: true 
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
    }, 
    { 
        timestamps: true 
    }
);

export const UserRequest = mongoose.model("UserRequest", userRequestSchema);