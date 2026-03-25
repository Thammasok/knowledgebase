import Joi from 'joi'

export const basicSettingSchema = {
  language: Joi.string().valid('en', 'th').optional(),
  theme: Joi.string().valid('light', 'dark', 'auto').optional(),
}
