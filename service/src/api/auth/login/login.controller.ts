import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getIPAddress, getIPLocation } from '../../../utils/ip-address'
import RequestWithAccount from '../../../boot/express.dto'
import * as AuthService from '../../auth/login/login.service'
import * as AuthSessionService from '../../auth-session/auth-session.service'
import { getDeviceInfo } from '../../../utils/user-again-detect'
import { Details } from 'express-useragent'
import { newToken } from './login-token.logic'
import logger from '../../../boot/logger'

const LOGGER_NAME = 'AUTH_LOGIN:'

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body
    const logged = await AuthService.login(body)

    if (logged) {
      // IP Address
      const ipAddress = await getIPAddress(req)
      if (ipAddress) {
        const ipInfo = await getIPLocation(ipAddress)

        const userAgent = getDeviceInfo(req.useragent as Details)

        // Add auth session
        await AuthSessionService.createAuthSession({
          accountId: logged.account.id,
          deviceId: req.headers['x-device-id'] as string,
          ipAddress: ipAddress as string,
          userAgent,
          ipInfo,
        })
      }

      return res.status(StatusCodes.OK).json({
        token: logged.token,
        account: {
          displayName: logged.account.displayName,
          email: logged.account.email,
          image: logged.account.image,
          isVerify: logged.account.isVerify,
        },
      })
    }
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}

export const logout = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Deactivate auth session
    await AuthSessionService.deactivateAuthSession({
      accountId: req.account.id,
      deviceId: req.headers['x-device-id'] as string,
    })

    return res.status(StatusCodes.OK).json({
      message: 'Logout success',
    })
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = req.account

    if (!account) {
      throw new TypeError('cannot create new token')
    }

    const token = await newToken(account.id)

    return res.status(StatusCodes.OK).json({
      token: token,
      account: {
        displayName: account.displayName,
        email: account.email,
        image: account.image,
        isVerify: account.isVerify,
      },
    })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}
