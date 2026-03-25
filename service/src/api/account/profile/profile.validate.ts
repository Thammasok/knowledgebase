import Joi from 'joi'

export const updateProfileSchema = {
  displayName: Joi.string().max(255).optional(),
  firstName: Joi.string().max(255).allow('').optional(),
  lastName: Joi.string().max(255).allow('').optional(),
}
