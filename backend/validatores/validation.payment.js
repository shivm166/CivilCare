import Joi from "joi";

export const validatePayment = (data) => {
  const schema = Joi.object({
    billId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid bill ID format",
        "any.required": "Bill ID is required",
      }),
    
    paymentType: Joi.string()
      .valid("maintenance", "penalty")
      .required()
      .messages({
        "any.only": "Payment type must be maintenance or penalty",
        "any.required": "Payment type is required",
      }),
    
    amount: Joi.number()
      .min(1)
      .required()
      .messages({
        "number.min": "Amount must be at least 1",
        "any.required": "Amount is required",
      }),
    
    paymentMethod: Joi.string()
      .valid("upi", "card", "netbanking", "cash")
      .default("upi")
      .messages({
        "any.only": "Invalid payment method",
      }),
    
    paymentNote: Joi.string()
      .max(500)
      .allow("")
      .default("")
      .messages({
        "string.max": "Payment note cannot exceed 500 characters",
      }),
    
    // Dummy payment metadata
    paymentMetadata: Joi.object({
      cardLast4: Joi.string().length(4).optional(),
      upiId: Joi.string().max(100).optional(),
      bankName: Joi.string().max(100).optional(),
    }).optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateWithdrawal = (data) => {
  const schema = Joi.object({
    amount: Joi.number()
      .min(1)
      .required()
      .messages({
        "number.min": "Amount must be at least 1",
        "any.required": "Amount is required",
      }),
    
    reason: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        "string.min": "Reason must be at least 10 characters",
        "string.max": "Reason cannot exceed 500 characters",
        "any.required": "Withdrawal reason is required",
      }),
    
    notes: Joi.string()
      .max(500)
      .allow("")
      .default("")
      .messages({
        "string.max": "Notes cannot exceed 500 characters",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateBillGeneration = (data) => {
  const schema = Joi.object({
    month: Joi.number()
      .integer()
      .min(1)
      .max(12)
      .required()
      .messages({
        "number.min": "Month must be between 1 and 12",
        "number.max": "Month must be between 1 and 12",
        "any.required": "Month is required",
      }),
    
    year: Joi.number()
      .integer()
      .min(2020)
      .max(2100)
      .required()
      .messages({
        "number.min": "Invalid year",
        "number.max": "Invalid year",
        "any.required": "Year is required",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};
