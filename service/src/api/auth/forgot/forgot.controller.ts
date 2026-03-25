import { Response, Request, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as ForgotRepository from './forgot.repository'
import * as ForgotService from './forgot.service'
import logger from '../../../boot/logger'

const LOGGER_NAME = 'AUTH_FORGOT:'

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body
    const account = await ForgotRepository.getAccountByEmail(body.email)

    if (!account) {
      throw new Error('account not found')
    }

    await ForgotService.getRequestResetPassword({
      accountId: account.id,
      email: account.email,
    })

    return res.status(StatusCodes.OK).json({
      message: 'send mail for request change password success',
    })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}

export const createNewPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body

    const passwordSaved = await ForgotService.createNewPassword(body)

    return res.status(StatusCodes.OK).json({
      ...passwordSaved,
    })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}
