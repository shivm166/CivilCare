import Resident from "../models/resident.js";

export const getTotalUsers = async (req, res) => {
  try {
    const total = await Resident.countDocuments();
    return res.json({
      success: true,
      totalUsers: total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch total users",
    });
  }
};
