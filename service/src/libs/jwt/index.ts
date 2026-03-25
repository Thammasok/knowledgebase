import jwt, { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken'
import logger from '../../boot/logger'

const LOGGER_NAME = 'JWT_LIBS:'

export type JWTSignOptions = SignOptions

export const signAsync = async (
  payload: object,
  secret: Secret,
  options: SignOptions,
) => {
  try {
    return jwt.sign(payload, secret, options)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw error
  }
}

export const verifyAsync = async (
  token: string,
  secret: Secret,
  options: VerifyOptions,
) => {
  try {
    return jwt.verify(token, secret, options)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw error
  }
}
