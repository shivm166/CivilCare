import mongoose from "mongoose";

const maintenancePaymentSchema = new mongoose.Schema(
    {
        bill: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "MaintenanceBill", 
            required: true, 
            index: true 
        },
        paidBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        amount: { 
            type: Number, 
            required: true 
        },
        method: { 
            type: String, 
            enum: ["upi", "cash", "cheque", "other"], 
            default: "upi" 
        },
        transactionId: { 
            type: String, 
            trim: true, 
            default: "" 
        },
        paidAt: { 
            type: Date, 
            default: Date.now 
        },
    },
    {
        timestamps: true,
    }
)

export const maintenancePayment = mongoose.model("MaintenancePayment", maintenancePaymentSchema, "maintenance_payment")