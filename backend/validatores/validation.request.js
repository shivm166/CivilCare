import Joi from "joi";

// -------------------- Send Join Request Validation --------------------
export const validateSendRequest = (requestData) => {
  const schema = Joi.object({
    societyId: Joi.string().required().messages({
      "string.empty": "Society ID is required",
      "any.required": "Society ID is required",
    }),
    message: Joi.string().max(500).optional().allow("").messages({
      "string.max": "Message cannot exceed 500 characters",
    }),
  });

  return schema.validate(requestData, { abortEarly: false });
};

// -------------------- Accept/Reject Request Validation --------------------
export const validateRequestId = (params) => {
  const schema = Joi.object({
    requestId: Joi.string().required().messages({
      "string.empty": "Request ID is required",
      "any.required": "Request ID is required",
    }),
  });

  return schema.validate(params, { abortEarly: false });
};
