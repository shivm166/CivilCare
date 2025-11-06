import { UserSocietyRel } from "../models/user_society_rel.model.js";

const attachSocietyContext = async (req, res, next) => {
  // Frontend માંથી મોકલેલ society-id header વાંચો
  const societyId = req.headers["society-id"];

  // જો user authenticated ન હોય અથવા societyId ન હોય તો આગળ વધો (Public Routes અથવા society independent routes માટે)
  if (!req.user || !societyId) {
    return next();
  }

  try {
    // UserSocietyRel માંથી user અને society ID match કરીને role અને society details મેળવો.
    const rel = await UserSocietyRel.findOne({
      user: req.user._id,
      society: societyId,
      isActive: true,
    }).populate("society", "name city state");

    if (rel) {
      // req object ને society context અને role થી સજ્જ કરો
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
