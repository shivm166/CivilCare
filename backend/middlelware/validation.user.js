import Joi from "joi";

// -------------------- User Registration Validation --------------------
export const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 30 characters",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
    phone: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(10)
      .max(15)
      .required()
      .messages({
        "string.pattern.base": "Phone number must contain only digits",
        "string.min": "Phone number must be at least 10 digits",
        "string.max": "Phone number cannot exceed 15 digits",
        "any.required": "Phone number is required",
      }),
  });

  return schema.validate(user, { abortEarly: false }); // show all errors
};

// -------------------- Login Validation --------------------
export const validateLogin = (credentials) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  });

  return schema.validate(credentials, { abortEarly: false });
};
