import { UserSocietyRel } from "../models/user_society_rel.model.js";

const attachSocietyContext = async (req, res, next) => {
  const societyId = req.headers["society-id"];

  if (!req.user || !societyId) {
    return next();
  }

  try {
    const rel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      isActive: true,
    }).populate("society", "name city state");

    if (rel) {
      req.society = rel.society;
      req.role = rel.roleInSociety;
    }
    next();
  } catch (error) {
    console.error("Error in attachSocietyContext:", error);
    res.status(500).json({ message: "Failed to establish society context." });
  }
};

export default attachSocietyContext;
