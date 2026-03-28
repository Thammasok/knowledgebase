import Joi from 'joi'

export const createFolderSchema = {
  name: Joi.string().min(1).max(255).required(),
  parentId: Joi.string().optional().allow(null, ''),
  order: Joi.number().integer().min(0).optional(),
}

export const updateFolderSchema = {
  name: Joi.string().min(1).max(255).optional(),
  order: Joi.number().integer().min(0).optional(),
}
