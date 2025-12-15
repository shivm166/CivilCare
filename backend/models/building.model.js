import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        numberOfFloors: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            trim: true
        },
        society: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Society",
            required: true,
        },
        maintenanceRule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MaintenanceRule",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true
    }
)

buildingSchema.index({society: 1, name: 1}, {unique: true})

export const Building = mongoose.model("Building", buildingSchema, "building")