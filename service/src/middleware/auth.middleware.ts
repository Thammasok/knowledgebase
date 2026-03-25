import config from '../config'
import logger from '../boot/logger'
import RequestWithAccount from '../boot/express.dto'
import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'
import { getAuthSessionsActiveByAccountIdAndDeviceId } from '../api/auth-session/auth-session.repository'
import { getAccountById } from '../api/account/profile/profile.repository'
import * as jwt from '../libs/jwt'

const LOGGER_NAME = 'AUTH_MIDDLEWARE:'

export const authAccessMiddleware = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization

    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Unauthorized',
      })
    }

    const bearerToken = authorization.split(' ')
    const token = bearerToken[1]

    const data = (await jwt.verifyAsync(token, config.JWT.JWT_SECRET, {
      algorithms: ['HS256'],
    })) as JwtPayload

    const deviceId = req.headers['x-device-id'] as string

    if (!deviceId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Device id not found',
      })
    }

    if (data.sub === 'access_token') {
      const isAuthSessionActive =
        await getAuthSessionsActiveByAccountIdAndDeviceId({
          accountId: data.accountId,
          deviceId,
        })

      // If have session
      if (isAuthSessionActive.length > 0) {
        const account = await getAccountById(data.accountId)

        if (account) {
          req.account = account

          return next()
        }

        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Account not found',
        })
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Session not found',
        })
      }
    }

    return res.status(StatusCodes.UNAUTHORIZED).json('Unauthorized')
  } catch (error) {
    logger.warn({ type: LOGGER_NAME, error })

    return res.status(StatusCodes.UNAUTHORIZED).json(error)
  }
}

export const authRefreshMiddleware = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization = req.headers.authorization

    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Unauthorized',
      })
    }

    const bearerToken = authorization.split(' ')
    const token = bearerToken[1]

    const data = (await jwt.verifyAsync(token, config.JWT.JWT_SECRET, {
      algorithms: ['HS256'],
    })) as JwtPayload

    const deviceId = req.headers['x-device-id'] as string

    if (!deviceId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Device id not found',
      })
    }

    if (data.sub === 'refresh_token') {
      const isAuthSessionActive =
        await getAuthSessionsActiveByAccountIdAndDeviceId({
          accountId: data.accountId,
          deviceId,
        })

      // If have session
      if (isAuthSessionActive.length > 0) {
        const account = await getAccountById(data.accountId)

        if (account) {
          req.account = account

          return next()
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Account not found',
        })
      }
    }

    return res.status(StatusCodes.UNAUTHORIZED).json('Unauthorized')
  } catch (error) {
    logger.warn({ type: LOGGER_NAME, error })

    return res.status(StatusCodes.UNAUTHORIZED).json(error)
  }
}
