import { StatusCodes } from 'http-status-codes'
import config from '../../../config'
import logger from '../../../boot/logger'
import HttpException from '../../../exceptions/http-exception'
import {
  deleteOTPByAccountId,
  getAccountByEmail,
  getOTPByAccountId,
  saveOTP,
  updateVerifyAccount,
} from './otp.repository'
import { createNewOTP } from './otp.logic'
import { SendResponse, type Mail } from 'mailtrap'
import mailConfig from '../../../config/mail'
import { sendMail } from '../../../libs/mail'

const LOGGER_NAME = 'AUTH_OTP_SERVICE:'

// ------------- send otp for verify email -------------
export const verifyMailViaOTP = async (email: string) => {
  const account = await getAccountByEmail(email)

  if (!account || account.isVerify) {
    throw new TypeError('email not found or email is verified')
  }

  const otp = createNewOTP()

  const accountId = account.id.toString()

  // Save new OTP
  const otpSaved = await saveOTP({
    accountId,
    ttl: config.MAIL.OTP_EXPIRE_TIME * 60,
    otp,
  })

  if (!otpSaved) {
    logger.error({
      type: LOGGER_NAME,
      message: `send OTP failed: ${otpSaved}`,
    })

    throw new HttpException(StatusCodes.BAD_REQUEST, 'send OTP failed')
  }

  const mail = await sendMailForVerifyCode({
    name: account.displayName,
    email: account.email,
    ...otp,
  })

  if (!mail) {
    logger.error({
      type: LOGGER_NAME,
      message: `send OTP failed: ${account.email}`,
    })
  }

  return {
    mail,
    ref: otp.ref,
  }
}

export interface ISendMailForVerifyCodeService {
  name: string
  email: string
  otp: string
  ref: string
}

export const sendMailForVerifyCode = async ({
  name,
  email,
  ref,
  otp,
}: ISendMailForVerifyCodeService) => {
  const data: Mail  = {
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
    template_uuid: mailConfig.MAIL_TEMPLATE.VERIFY_MAIL_WITH_OTP.TEMPLATE_UUID,
    template_variables: {
      name,
      email,
      ref,
      otp,
    }
  }

  const result:SendResponse = await sendMail(data)

  if (!result) {
    logger.error({ type: LOGGER_NAME, message: 'send email is failed', result })
    throw new Error('send email is failed')
  }

  logger.info({ type: LOGGER_NAME, message_id: result.message_ids })

  return {
    message: 'send email is successed',
  }
}

// ------------- verify otp -------------
export interface IverifyAccountWithOTPService {
  email: string
  otp: string
  ref: string
}

export const verifyAccountWithOTP = async ({
  email,
  otp,
  ref,
}: IverifyAccountWithOTPService) => {
  const account = await getAccountByEmail(email)

  if (!account || account?.isVerify) {
    throw new Error('email not found or email is verified')
  }

  const accountId = account.id

  const isOTP = await getOTPByAccountId(accountId)

  if (!isOTP || isOTP?.otp !== otp || isOTP.ref !== ref) {
    throw new Error('OTP is incorrect')
  }

  const [result, otpDeleted] = await Promise.all([
    updateVerifyAccount(accountId),
    deleteOTPByAccountId(accountId),
  ])

  if (!result || !otpDeleted) {
    logger.error({
      type: LOGGER_NAME,
      message: 'verify account is failed',
    })
    throw new Error('verify account is failed')
  }

  return {
    message: 'verify account is successed',
  }
}
