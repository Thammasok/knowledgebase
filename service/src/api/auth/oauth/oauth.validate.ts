import Joi from 'joi'

export const oauthSchema = {
  provider: Joi.string().valid('google', 'github', 'facebook').required(),
  providerId: Joi.string().required(),
  email: Joi.string().email().required(),
  displayName: Joi.string().required(),
  image: Joi.string().optional().allow('', null),
}
