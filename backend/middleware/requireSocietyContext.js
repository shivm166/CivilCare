import { UserSocietyRel } from "../models/user_society_rel.model.js";

const requireSocietyContext = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const societyId = req.headers["society-id"];

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: "Society context is required. Please select a society.",
      });
    }

    // Verify user belongs to this society
    const membership = await UserSocietyRel.findOne({
      user: userId,
      society: societyId,
    }).populate("society");

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this society.",
      });
    }

    // Attach society and role to request
    req.society = membership.society;
    req.userRole = membership.role;

    next();
  } catch (error) {
    console.error("Error in requireSocietyContext:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default requireSocietyContext;
