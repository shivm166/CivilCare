import Resident from "../models/resident.js";
import Complaint from "../models/complaint.model.js"; // FIXED

export const getTotalUsers = async (req, res) => {
  try {
    const total = await Resident.countDocuments();
    return res.json({ success: true, total });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTotalComplaints = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const open = total - resolved;

    return res.json({
      success: true,
      total,
      resolved,
      open,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
