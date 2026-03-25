import Joi from "joi";

export const otpForVerifyEmailSchema = {
  // name: Joi.string().required(),
  email: Joi.string().required(),
}

export const verifyOtpEmailSchema = {
  email: Joi.string().required(),
  ref: Joi.string().required(),
  otp: Joi.string().required(),
}