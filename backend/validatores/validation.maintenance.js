import Joi from "joi";

export const validateRuleCreate = (data) => {
  const schema = Joi.object({
    ruleName: Joi.string().trim().min(3).max(100).required().messages({
      "string.empty": "Rule name is required",
      "string.min": "Rule name must be at least 3 characters",
      "string.max": "Rule name cannot exceed 100 characters",
    }),
    ruleType: Joi.string()
      .valid("general", "building_specific")
      .required()
      .messages({
        "any.only": "Rule type must be general or building_specific",
        "any.required": "Rule type is required",
      }),
    building: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        "string.pattern.base": "Invalid building ID format",
      }),
    amountType: Joi.string()
      .valid("flat", "bhk_wise")
      .default("flat")
      .messages({
        "any.only": "Amount type must be flat or bhk_wise",
      }),
    amount: Joi.number().min(0).default(0).messages({
      "number.min": "Amount cannot be negative",
    }),
    bhkWiseAmounts: Joi.object({
      "1bhk": Joi.number().min(0).default(0),
      "2bhk": Joi.number().min(0).default(0),
      "3bhk": Joi.number().min(0).default(0),
      penthouse: Joi.number().min(0).default(0),
    })
      .default({})
      .messages({
        "number.min": "BHK amount cannot be negative",
      }),
    billingDay: Joi.number().integer().min(1).max(28).required().messages({
      "number.base": "Billing day must be a number",
      "number.min": "Billing day must be between 1 and 28",
      "number.max": "Billing day must be between 1 and 28",
      "any.required": "Billing day is required",
    }),
    dueDays: Joi.number().integer().min(0).max(30).default(5).messages({
      "number.base": "Due days must be a number",
      "number.min": "Due days cannot be negative",
      "number.max": "Due days cannot exceed 30",
    }),
    penaltyEnabled: Joi.boolean().default(false),
    penaltyType: Joi.string()
      .valid("percentage", "fixed", "daily")
      .default("percentage")
      .messages({
        "any.only": "Penalty type must be percentage, fixed, or daily",
      }),
    penaltyValue: Joi.number().min(0).default(0).messages({
      "number.min": "Penalty value cannot be negative",
    }),
    description: Joi.string().trim().max(500).allow("").default("").messages({
      "string.max": "Description cannot exceed 500 characters",
    }),
    isActive: Joi.boolean().default(true),
  }).custom((value, helpers) => {
    if (value.ruleType === "building_specific" && !value.building) {
      return helpers.error("any.invalid", {
        message: "Building is required for building_specific rules",
      });
    }

    if (value.amountType === "flat" && (!value.amount || value.amount <= 0)) {
      return helpers.error("any.invalid", {
        message: "Amount is required for flat amount type",
      });
    }

    if (value.amountType === "bhk_wise") {
      const hasAmount = Object.values(value.bhkWiseAmounts || {}).some(
        (amt) => amt > 0
      );
      if (!hasAmount) {
        return helpers.error("any.invalid", {
          message: "At least one BHK amount must be greater than 0",
        });
      }
    }

    if (value.penaltyEnabled && (!value.penaltyValue || value.penaltyValue <= 0)) {
      return helpers.error("any.invalid", {
        message: "Penalty value is required when penalty is enabled",
      });
    }

    return value;
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateRuleUpdate = (data) => {
  const schema = Joi.object({
    ruleName: Joi.string().trim().min(3).max(100).messages({
      "string.min": "Rule name must be at least 3 characters",
      "string.max": "Rule name cannot exceed 100 characters",
    }),
    amountType: Joi.string().valid("flat", "bhk_wise").messages({
      "any.only": "Amount type must be flat or bhk_wise",
    }),
    amount: Joi.number().min(0).messages({
      "number.min": "Amount cannot be negative",
    }),
    bhkWiseAmounts: Joi.object({
      "1bhk": Joi.number().min(0),
      "2bhk": Joi.number().min(0),
      "3bhk": Joi.number().min(0),
      penthouse: Joi.number().min(0),
    }).messages({
      "number.min": "BHK amount cannot be negative",
    }),
    billingDay: Joi.number().integer().min(1).max(28).messages({
      "number.min": "Billing day must be between 1 and 28",
      "number.max": "Billing day must be between 1 and 28",
    }),
    dueDays: Joi.number().integer().min(0).max(30).messages({
      "number.min": "Due days cannot be negative",
      "number.max": "Due days cannot exceed 30",
    }),
    penaltyEnabled: Joi.boolean(),
    penaltyType: Joi.string()
      .valid("percentage", "fixed", "daily")
      .messages({
        "any.only": "Penalty type must be percentage, fixed, or daily",
      }),
    penaltyValue: Joi.number().min(0).messages({
      "number.min": "Penalty value cannot be negative",
    }),
    description: Joi.string().trim().max(500).allow("").messages({
      "string.max": "Description cannot exceed 500 characters",
    }),
    isActive: Joi.boolean(),
  });

  return schema.validate(data, { abortEarly: false });
};
