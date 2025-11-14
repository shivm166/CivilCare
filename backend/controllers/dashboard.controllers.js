import { User } from "../models/user.model.js";
import { UserSocietyRel } from "../models/user_society_rel.model.js";

export const getDashboardCounts = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSocietyMembers = await UserSocietyRel.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSocietyMembers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
