import Joi from "joi"

export const validateBuildingCreate = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required().messages({
            "string.empty": "Building name is required",
            "string.min": "Building name must be at least 1 character",
            "string.max": "Building name cannot exceed 100 characters",
            "any.required": "Building name is required",
        }),
        numberOfFloors: Joi.number().integer().min(1).max(200).required().messages({
            "number.base": "Number of floors must be a number",
            "number.min": "Building must have at least 1 floor",
            "number.max": "Building cannot exceed 200 floors",
            "any.required": "Number of floors is required",
        }),
        description: Joi.string().max(500).allow("").optional().messages({
            "string.max": "Description cannot exceed 500 characters",
        }),
    });
    return schema.validate(data, { abortEarly: false });
};

export const validateBuildingUpdate = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).optional().messages({
            "string.min": "Building name must be at least 1 character",
            "string.max": "Building name cannot exceed 100 characters",
        }),
        numberOfFloors: Joi.number().integer().min(1).max(200).optional().messages({
            "number.base": "Number of floors must be a number",
            "number.min": "Building must have at least 1 floor",
            "number.max": "Building cannot exceed 200 floors",
        }),
        description: Joi.string().max(500).allow("").optional().messages({
            "string.max": "Description cannot exceed 500 characters",
        }),
    }).min(1); // At least one field must be present
    return schema.validate(data, { abortEarly: false });
};