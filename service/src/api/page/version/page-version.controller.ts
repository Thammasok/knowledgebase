import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import RequestWithAccount from '../../../boot/express.dto'
import * as PageVersionService from './page-version.service'
import logger from '../../../boot/logger'

const LOGGER_NAME = 'PAGE_VERSION:'

export const getVersions = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, pageId } = req.params
    const versions = await PageVersionService.listVersions({
      pageId,
      workspaceId,
      accountId: req.account.id,
    })
    return res.status(StatusCodes.OK).json(versions)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const restoreVersion = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, pageId, versionId } = req.params
    const page = await PageVersionService.restoreVersion({
      pageId,
      versionId,
      workspaceId,
      accountId: req.account.id,
    })
    return res.status(StatusCodes.OK).json(page)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}
