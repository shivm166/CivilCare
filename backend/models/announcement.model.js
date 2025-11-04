import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true, 
            trim: true 
        },
        message: { 
            type: String, 
            trim: true 
        },
        attachments: [String],
        society: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Society" 
        },
        visibleToRoles: {
            type: [String],
            enum: ["all", "admin", "member"],
            default: ["all"]
        },
    }, 
    { 
        timestamps: true 
    }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);