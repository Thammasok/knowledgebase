import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as AuthSignupService from './signup.service'
import HttpException from '../../../exceptions/http-exception'
import logger from '../../../boot/logger'

const LOGGER_NAME = 'AUTH_SIGNUP:'

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = await AuthSignupService.createNewAccount(req.body)

    if (!account) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'something went wrong')
    }

    return res.status(StatusCodes.CREATED).json({
      message: 'account created',
    })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}

export const requestAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = await AuthSignupService.createRequestAccess(req.body.email)

    if (!account) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'something went wrong 2')
    }

    return res.status(StatusCodes.CREATED).json({})
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}

export const signupFromRequestAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = await AuthSignupService.createNewAccountByRequest(req.body)

    if (!account) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'something went wrong')
    }

    return res.status(StatusCodes.CREATED).json({
      message: 'account created',
    })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}
