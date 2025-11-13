import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    flatNumber: { type: String, required: true },
    block: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Resident = mongoose.model("Resident", residentSchema);

export default Resident;
