import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
    {
        society: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Society", required: true, 
            index: true 
        },
        unitNumber: { 
            type: String, 
            required: true, 
            trim: true 
        }, // e.g., A-101, B-502
        type: {
            type: String,
            enum: ["owner_occupied", "tenant_occupied", "vacant"],
            default: "owner_occupied"
        },
        primaryResident: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        },
        owner: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        },
    }, 
    { 
        timestamps: true 
    }
);

unitSchema.index({ society: 1, unitNumber: 1 }, { unique: true });

export const Unit = mongoose.model("Unit", unitSchema);