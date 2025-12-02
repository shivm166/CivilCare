export const validateRequest = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }
    next();
  };
};
