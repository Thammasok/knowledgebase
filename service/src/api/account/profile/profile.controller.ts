import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import logger from '../../../boot/logger'
import RequestWithAccount from '../../../boot/express.dto'
import {
  getAccountProfileById,
  updateAccountProfileById,
} from './profile.repository'

const LOGGER_NAME = 'ACCOUNT_PROFILE:'

export const getAccountProfile = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = req.account

    if (account) {
      const accountInfo = await getAccountProfileById(account.id)

      return res.status(StatusCodes.OK).json(accountInfo)
    }
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}

export const updateAccountProfile = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = req.account

    if (account) {
      const { displayName, firstName, lastName } = req.body
      const updated = await updateAccountProfileById(account.id, {
        displayName,
        firstName,
        lastName,
      })

      return res.status(StatusCodes.OK).json(updated)
    }
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}
