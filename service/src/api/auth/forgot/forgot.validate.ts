import Joi from 'joi'

export const forgotPasswordSchema = {
  email: Joi.string().required(),
}

export const createNewPasswordSchema = {
  token: Joi.string().required(),
  password: Joi.string().min(8).max(64).required(),
}
