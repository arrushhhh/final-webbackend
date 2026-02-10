import Joi from "joi";

export const createResultSchema = Joi.object({
  math: Joi.number().min(0).max(60).required(),
  reading: Joi.number().min(0).max(60).required(),
  majorSubject1: Joi.number().min(0).max(60).required(),
  majorSubject2: Joi.number().min(0).max(60).required(),
  preferredFaculty: Joi.string().max(60).allow("").default("")
});

export const updateResultSchema = Joi.object({
  math: Joi.number().min(0).max(60).optional(),
  reading: Joi.number().min(0).max(60).optional(),
  majorSubject1: Joi.number().min(0).max(60).optional(),
  majorSubject2: Joi.number().min(0).max(60).optional(),
  preferredFaculty: Joi.string().max(60).allow("").optional()
});
