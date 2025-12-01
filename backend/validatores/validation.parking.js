import Joi from "joi";
import { sendErrorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../utils/status.js";

// Validation schema for unit-based parking allocation
export const validateUnitParkingAllocation = (req, res, next) => {
  const schema = Joi.object({
    parkingNumber: Joi.string().trim().required().messages({
      "string.empty": "Parking number is required",
      "any.required": "Parking number is required",
    }),
    unitId: Joi.string().trim().required().messages({
      "string.empty": "Unit is required",
      "any.required": "Unit is required",
    }),
    vehicleType: Joi.string()
      .valid("two_wheeler", "four_wheeler", "bicycle", "other")
      .default("two_wheeler"),
    vehicleNumber: Joi.string().trim().allow("").optional(),
    parkingLevel: Joi.string()
      .valid("basement_3", "basement_2", "basement_1", "ground", "outside_society")
      .default("ground"),
    remarks: Joi.string().trim().allow("").optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return sendErrorResponse(res, STATUS_CODES.BAD_REQUEST, error, error.details[0].message);
  }
  next();
};

// Validation schema for general parking allocation
export const validateGeneralParkingAllocation = (req, res, next) => {
  const schema = Joi.object({
    parkingNumber: Joi.string().trim().required().messages({
      "string.empty": "Parking number is required",
      "any.required": "Parking number is required",
    }),
    memberId: Joi.string().trim().required().messages({
      "string.empty": "Member is required",
      "any.required": "Member is required",
    }),
    vehicleType: Joi.string()
      .valid("two_wheeler", "four_wheeler", "bicycle", "other")
      .default("two_wheeler"),
    vehicleNumber: Joi.string().trim().allow("").optional(),
    parkingLevel: Joi.string()
      .valid("basement_3", "basement_2", "basement_1", "ground", "outside_society")
      .default("ground"),
    remarks: Joi.string().trim().allow("").optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return sendErrorResponse(res, STATUS_CODES.BAD_REQUEST, error, error.details[0].message);
  }
  next();
};

// Validation schema for parking update
export const validateParkingUpdate = (req, res, next) => {
  const schema = Joi.object({
    vehicleType: Joi.string()
      .valid("two_wheeler", "four_wheeler", "bicycle", "other")
      .optional(),
    vehicleNumber: Joi.string().trim().allow("").optional(),
    parkingLevel: Joi.string()
      .valid("basement_3", "basement_2", "basement_1", "ground", "outside_society")
      .optional(),
    status: Joi.string().valid("active", "inactive").optional(),
    remarks: Joi.string().trim().allow("").optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return sendErrorResponse(res, STATUS_CODES.BAD_REQUEST, error, error.details[0].message);
  }
  next();
};
