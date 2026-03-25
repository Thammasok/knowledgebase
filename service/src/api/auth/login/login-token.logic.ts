import logger from '../../../boot/logger'
import config from '../../../config'
import HttpException from '../../../exceptions/http-exception'
import * as jwt from '../../../libs/jwt'
import { StatusCodes } from 'http-status-codes'

const LOGGER_NAME = 'AUTH_LOGIN_LOGIC:'

export const newToken = async (accountId: string) => {
  try {
    const accessOption = {
      expiresIn: config.JWT.ACCESS_TOKEN_EXPIRES_IN || '1H',
      algorithm: 'HS256',
    } as jwt.JWTSignOptions

    const refreshOption = {
      expiresIn: config.JWT.REFRESH_TOKEN_EXPIRES_IN || '7D',
      algorithm: 'HS256',
    } as jwt.JWTSignOptions

    const accessToken = await jwt.signAsync(
      {
        accountId,
        sub: 'access_token',
      },
      config.JWT.JWT_SECRET,
      accessOption,
    )
    const refreshToken = await jwt.signAsync(
      {
        accountId,
        sub: 'refresh_token',
      },
      config.JWT.JWT_SECRET,
      refreshOption,
    )

    return { accessToken, refreshToken }
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw new HttpException(StatusCodes.UNAUTHORIZED, error)
  }
}
