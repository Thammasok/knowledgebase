import Joi from "joi";

export const loginSchema = {
  email: Joi.string().required(),
  password: Joi.string().required(),
}
