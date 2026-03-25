import logger from '../../../boot/logger'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { verifyAccountWithOTP, verifyMailViaOTP } from './otp.service'

const LOGGER_NAME = 'AUTH_OTP:'

export const sendOTPForVerifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sended = await verifyMailViaOTP(req.body.email)

    if (sended) {
      return res.status(StatusCodes.OK).json(sended)
    }
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body

    const result = await verifyAccountWithOTP({
      email: body.email,
      otp: body.otp,
      ref: body.ref,
    })

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}
