import mongoose from "mongoose"
import { UNIT_BHK_TYPES } from "../config/unit.config"

const maintenanceRuleSchema = new mongoose.Schema(
    {
        society: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Society",
            required: true,
        },
        building: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Building",
            required: true,
        },
        bhkType: {
            type: String,
            enum: UNIT_BHK_TYPES,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        dueDay: {
            type: Number,
            required: true,
            min: 0,
        },
        gracePeriod: {
            type: Number,
            required: true,
            min: 0,
        },
        penaltyType: {
            type: String,
            enum: ["fixed_amount", "percentage_of_maintenance", "daily_rate"],
            required: true,
        },
        penaltyValue: {
            type: Number,
            required: true,
            min: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        },
    },
    {
        timestamps: true,
    }
)

export const MaintenanceRule = mongoose.model("MaintenanceRule", maintenanceRuleSchema, "maintenance_rule") 