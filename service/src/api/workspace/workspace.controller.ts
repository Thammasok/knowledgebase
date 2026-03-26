import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import RequestWithAccount from '../../boot/express.dto'
import * as WorkspaceService from './workspace.service'
import logger from '../../boot/logger'

const LOGGER_NAME = 'WORKSPACE:'

export const createWorkspace = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, logo, color } = req.body
    const workspace = await WorkspaceService.createWorkspace({
      accountId: req.account.id,
      name,
      logo,
      color,
    })

    return res.status(StatusCodes.CREATED).json(workspace)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const updateWorkspace = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const { name, logo, color } = req.body
    const workspace = await WorkspaceService.updateWorkspace({
      id,
      accountId: req.account.id,
      name,
      logo,
      color,
    })

    return res.status(StatusCodes.OK).json(workspace)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const getWorkspaces = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query
    const result = await WorkspaceService.getWorkspaces({
      accountId: req.account.id,
      search: String(search),
      page: Number(page),
      limit: Number(limit),
    })

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}
