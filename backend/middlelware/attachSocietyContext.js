import { UserSocietyRel } from "../models/user_society_rel.model.js";

const attachSocietyContext = async (req, res, next) => {
  const societyId = req.headers["society-id"];

  // 1. Skip if user is not authenticated or no society is selected
  if (!req.user || !societyId) {
    // Assumes 'req.user' is set by isProtected.js
    return next();
  }

  try {
    // 2. Find the relationship and populate society details in one query
    const rel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      isActive: true,
    }).populate("society", "name city state");

    // 3. Attach context for downstream controllers to use
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
