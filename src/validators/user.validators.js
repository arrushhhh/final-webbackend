import Joi from "joi";

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(80).optional(),
  city: Joi.string().max(60).allow("").optional(),
  preferredFaculty: Joi.string().max(60).allow("").optional()
});
