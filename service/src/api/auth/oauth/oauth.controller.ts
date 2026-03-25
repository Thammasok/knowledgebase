import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as OAuthService from './oauth.service'
import logger from '../../../boot/logger'

const LOGGER_NAME = 'AUTH_OAUTH:'

export const oauthSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await OAuthService.oauthSignIn(req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}
