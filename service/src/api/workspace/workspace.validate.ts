import Joi from 'joi'

export const createWorkspaceSchema = {
  name: Joi.string().min(1).max(255).required(),
  logo: Joi.string().max(128).optional().allow('', null),
  color: Joi.string().max(32).optional(),
}

export const updateWorkspaceSchema = {
  name: Joi.string().min(1).max(255).required(),
  logo: Joi.string().max(128).optional().allow('', null),
  color: Joi.string().max(32).optional(),
}

export const getWorkspacesSchema = {
  search: Joi.string().max(100).optional().allow(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
}
