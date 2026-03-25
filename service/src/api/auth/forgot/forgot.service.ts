import { StatusCodes } from 'http-status-codes'
import HttpException from '../../../exceptions/http-exception'
import config from '../../../config'
import * as hash from '../../../utils/hash-password'
import * as ForgotRepository from './forgot.repository'
import { createResetToken } from './forgot-token.logic'
import { type Mail } from 'mailtrap'
import mailConfig from '../../../config/mail'
import e from 'express'
import { sendMail } from '../../../libs/mail'

export interface IGetRequestResetPasswordService {
  accountId: string
  email: string
}

export const getRequestResetPassword = async ({
  accountId,
  email,
}: IGetRequestResetPasswordService) => {
  const token = createResetToken()

  const requestResetPassword =
    await ForgotRepository.updateRequestResetPassword({
      accountId,
      token,
      ttl: config.MAIL.OTP_EXPIRE_TIME * 60,
    })

  if (!requestResetPassword) {
    throw new HttpException(
      StatusCodes.BAD_REQUEST,
      `send OTP failed ${requestResetPassword}`,
    )
  }

  // Send mail
  const mail = await sendMailForRequestResetPassword({
    email,
    token,
  })

  return mail
}

export interface ISendMailForRequestResetPasswordService {
  email: string
  token: string
}

export const sendMailForRequestResetPassword = async ({
  email,
  token,
}: ISendMailForRequestResetPasswordService) => {
  const data: Mail = {
    to: [
      {
        name: email,
        email,
      },
    ],
    from: {
      name: config.MAIL.MAIL_DEFAULT_FROM_NANE,
      email: config.MAIL.MAIL_DEFAULT_FROM_EMAIL,
    },
    template_uuid: mailConfig.MAIL_TEMPLATE.REQUEST_RESET_PASSWORD.TEMPLATE_UUID,
    template_variables: {
      name: email,
      email,
      reset_password_url: `${config.RESET_PASSWORD.RESET_PASSWORD_URL}?token=${token}`,
      expire_time: mailConfig.MAIL.OTP_EXPIRE_TIME,
      expire_unit: mailConfig.MAIL.OTP_EXPIRE_UNIT
    }
  }

  await sendMail(data)

  return {
    message: 'send mail for request reset success',
  }
}

// ---------------- Reset Password ----------------

export interface ICreateNewPasswordService {
  token: string
  password: string
}
export const createNewPassword = async ({
  token,
  password,
}: ICreateNewPasswordService) => {
  const accountId = await ForgotRepository.getRequestResetPasswordByToken(token)

  if (!accountId) {
    throw new TypeError('token invalid or expired')
  }

  const hashPassword = await hash.hashPassword(password)

  await ForgotRepository.updatePassword(accountId, hashPassword)
  await ForgotRepository.deleteRequestResetPassword(token)

  return {
    message: 'update password success',
  }
}
