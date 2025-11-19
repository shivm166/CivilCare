import { body } from "express-validator";

// Validate add existing member
export const validateAddMember = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("roleInSociety")
    .optional()
    .isIn(["admin", "member", "tenant", "owner"])
    .withMessage("Invalid role"),
];

// Validate invite new member
export const validateInviteMember = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone must be 10 digits"),
  body("roleInSociety")
    .optional()
    .isIn(["admin", "member", "tenant", "owner"])
    .withMessage("Invalid role"),
];

// Validate update member role
export const validateUpdateRole = [
  body("roleInSociety")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "member", "tenant", "owner"])
    .withMessage("Invalid role"),
];
