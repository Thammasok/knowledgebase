import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import logger from '../../boot/logger'
import RequestWithAccount from '../../boot/express.dto'
import * as AuthSessionRepository from './auth-session.repository'

const LOGGER_NAME = 'AUTH_SESSION:'

export const getSessionLists = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = req.account
    const { page = 1, limit = 10 } = req.query

    const sessions = await AuthSessionRepository.getAuthSessionsAllByAccountId({
      accountId: account.id,
      page: Number(page),
      limit: Number(limit),
    })

    return res.status(StatusCodes.OK).json(sessions)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}

export const deactivateAuthSession = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = req.account
    const sessionId = req.params.id
    const deviceId = req.headers['x-device-id']

    const session = await AuthSessionRepository.getAuthSessionById(sessionId)

    if (session?.deviceId === deviceId) {
      return res.status(StatusCodes.CONFLICT).json({
        message: 'cannot deactivate own session',
      })
    }

    await AuthSessionRepository.deactivateAuthSessionByAccountIdAndSessionId({
      sessionId,
      accountId: account.id,
      deviceId: deviceId as string,
    })

    return res.status(StatusCodes.OK).json({
      message: 'deactivate success',
    })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}
