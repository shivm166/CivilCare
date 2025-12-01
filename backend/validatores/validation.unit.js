import Joi from "joi";
import { UNIT_BHK_TYPES } from "../config/unit.config.js";

export const validateUnitCreate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
      "string.empty": "Unit name is required",
      "string.min": "Unit name must be at least 1 character",
      "string.max": "Unit name cannot exceed 50 characters",
      "any.required": "Unit name is required",
    }),
    floor: Joi.number().integer().min(0).max(200).required().messages({
      "number.base": "Floor must be a number",
      "number.min": "Floor cannot be negative",
      "number.max": "Floor cannot exceed 200",
      "any.required": "Floor is required",
    }),
    bhkType: Joi.string()
      .valid(...UNIT_BHK_TYPES)
      .required()
      .messages({
        "any.only": `BHK type must be one of: ${UNIT_BHK_TYPES}`,
        "any.required": "BHK type is required",
      }),
    type: Joi.string()
      .valid("owner_occupied", "tenant_occupied", "vacant")
      .optional()
      .messages({
        "any.only": "Type must be owner_occupied, tenant_occupied, or vacant",
      }),
    owner: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Owner must be a valid user ID",
      }),
    primaryResident: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Primary resident must be a valid user ID",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateUnitUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).optional().messages({
      "string.min": "Unit name must be at least 1 character",
      "string.max": "Unit name cannot exceed 50 characters",
    }),
    floor: Joi.number().integer().min(0).max(200).optional().messages({
      "number.base": "Floor must be a number",
      "number.min": "Floor cannot be negative",
      "number.max": "Floor cannot exceed 200",
    }),
    bhkType: Joi.string()
    .valid(...UNIT_BHK_TYPES)
    .optional()
    .messages({
      "any.only": `BHK type must be one of: ${UNIT_BHK_TYPES}`,
    }),
    type: Joi.string()
      .valid("owner_occupied", "tenant_occupied", "vacant")
      .optional()
      .messages({
        "any.only": "Type must be owner_occupied, tenant_occupied, or vacant",
      }),
    owner: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Owner must be a valid user ID",
      }),
    primaryResident: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Primary resident must be a valid user ID",
      }),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};

// ==================== Assign Resident Validation ====================
// 🔥 UPDATED: Changed 'role' to 'unitRole' and made it required
export const validateAssignResident = (data) => {
  const schema = Joi.object({
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.empty": "User ID is required",
        "string.pattern.base": "User ID must be a valid ID",
        "any.required": "User ID is required",
      }),
    unitRole: Joi.string() // 🔥 Changed from 'role' to 'unitRole'
      .valid("owner", "member", "tenant")
      .required() // 🔥 Required - frontend always sends it
      .messages({
        "any.only": "Unit role must be owner, member, or tenant",
        "any.required": "Unit role is required",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};
