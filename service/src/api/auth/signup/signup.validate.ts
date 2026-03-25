import Joi from 'joi'

export const signupSchema = {
  displayName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().max(80).required(),
  password: Joi.string()
    .min(8)
    .max(32)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .messages({
      'string.pattern.base':
        'Must contain 8 characters one uppercase one lowercase one number and one special case character',
    })
    .required(),
}

export const requestAccessSchema = {
  email: Joi.string().email().max(80).required(),
}

export const signupRequestAccessSchema = {
  requestId: Joi.string().required(),
  displayName: Joi.string().min(3).max(50).required(),
  password: Joi.string()
    .min(8)
    .max(32)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .messages({
      'string.pattern.base':
        'Must contain 8 characters one uppercase one lowercase one number and one special case character',
    })
    .required(),
}
