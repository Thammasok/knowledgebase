import Joi from 'joi'

export const sendInvitationSchema = {
  email: Joi.string().email().required(),
  role: Joi.string().valid('member', 'viewer').required(),
}

export const updateMemberRoleSchema = {
  role: Joi.string().valid('member', 'viewer').required(),
}

export const acceptInvitationSchema = {
  token: Joi.string().required(),
}
