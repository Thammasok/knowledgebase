import { NextFunction, Response } from 'express'
import RequestWithAccount from '../../../boot/express.dto'
import logger from '../../../boot/logger'
import * as AccountSettingService from './setting.service'

const LOGGER_NAME = 'ACCOUNT_SETTING:'

export const getAccountSetting = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = req.account

    const setting = await AccountSettingService.getAccountSetting(account.id)

    return res.status(200).json(setting)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}

export const updateBasicSetting = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const account = req.account

    const setting = await AccountSettingService.updateBasicSetting(
      account.id,
      req.body,
    )

    return res.status(200).json(setting)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    next(error)
  }
}
