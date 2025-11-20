export const checkAdmin = (req, res, next) => {
  if (!req.society) {
    return res.status(400).json({
      success: false,
      message: "Society context missing. Please select a society.",
    });
  }

  if (req.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. You are not an admin of this society.",
    });
  }

  next();
};
