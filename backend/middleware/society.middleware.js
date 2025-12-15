export const validateSociety = (req, res, next) => {
  try {
    if (!req.society) {
      return res.status(400).json({
        success: false,
        message: "Society not found in request",
      });
    }
    next();
  } catch (error) {
    console.error("Society middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
