import Joi from "joi";

// -------------------- Society Creation Validation --------------------
export const validateSocietyCreate = (societyData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        "string.base": "Society name must be a string",
        "string.empty": "Society name is required",
        "string.min": "Society name must be at least 3 characters",
        "string.max": "Society name cannot exceed 100 characters",
        "any.required": "Society name is required",
    }),
    address: Joi.string().max(200).required().messages({
      "string.max": "Address cannot exceed 200 characters",
      "any.required": "Society address is required",
    }),
    city: Joi.string().max(50).required().messages({
      "string.max": "City name cannot exceed 50 characters",
      "any.required": "Society city is required",
    }),
    state: Joi.string().max(50).required().messages({
      "string.max": "State name cannot exceed 50 characters",
      "any.required": "Society state is required",
    }),
    pincode: Joi.string().required()
      .pattern(/^[0-9]{4,10}$/)
      .messages({
        "string.pattern.base": "Pincode must be numeric (4–10 digits)",
        "any.required": "Society pincode is required",
      }),
  })

  return schema.validate(societyData, {abortEarly: false})
}

export const validateSocietyUpdate = (societyData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
      "string.min": "Society name must be at least 3 characters",
      "string.max": "Society name cannot exceed 100 characters",
    }),
    address: Joi.string().max(200).allow("", null),
    city: Joi.string().max(50).allow("", null),
    state: Joi.string().max(50).allow("", null),
    pincode: Joi.string()
      .pattern(/^[0-9]{4,10}$/)
      .allow("", null)
      .messages({
        "string.pattern.base": "Pincode must be numeric (4–10 digits)",
      }),
  }).min(1); // require at least one field

  return schema.validate(societyData, { abortEarly: false });
};