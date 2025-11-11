import { body, param } from "express-validator";

// Validate activation
export const validateActivation = [
  body("token")
    .notEmpty()
    .withMessage("Token is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validate token parameter
export const validateToken = [
  param("token")
    .notEmpty()
    .withMessage("Token is required"),
];

// Validate resend invitation
export const validateResendInvitation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
];
