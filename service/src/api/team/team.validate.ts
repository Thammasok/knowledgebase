import Joi from 'joi'

export const createTeamSchema = {
  name: Joi.string().min(1).max(255).required(),
  logo: Joi.string().max(128).optional().allow('', null),
  color: Joi.string().max(32).optional(),
}

export const updateTeamSchema = {
  name: Joi.string().min(1).max(255).required(),
  logo: Joi.string().max(128).optional().allow('', null),
  color: Joi.string().max(32).optional(),
}

export const getTeamsSchema = {
  search: Joi.string().max(100).optional().allow(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
}
