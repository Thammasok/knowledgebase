import Joi from 'joi'

export const createPageSchema = {
  title: Joi.string().max(500).optional().allow(''),
  folderId: Joi.string().optional().allow(null, ''),
  parentPageId: Joi.string().optional().allow(null, ''),
  order: Joi.number().integer().min(0).optional(),
}

export const updatePageSchema = {
  title: Joi.string().max(500).optional().allow(''),
  order: Joi.number().integer().min(0).optional(),
}

export const updatePageContentSchema = {
  blocks: Joi.array().required(),
  blockCount: Joi.number().integer().min(0).required(),
}
