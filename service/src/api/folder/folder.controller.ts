import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import RequestWithAccount from '../../boot/express.dto'
import * as FolderService from './folder.service'
import logger from '../../boot/logger'

const LOGGER_NAME = 'FOLDER:'

export const getFolders = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params
    const folders = await FolderService.getFolders({
      workspaceId,
      accountId: req.account.id,
    })
    return res.status(StatusCodes.OK).json(folders)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const createFolder = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params
    const { name, parentId, order } = req.body
    const folder = await FolderService.createFolder({
      workspaceId,
      accountId: req.account.id,
      name,
      parentId,
      order,
    })
    return res.status(StatusCodes.CREATED).json(folder)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const updateFolder = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, folderId } = req.params
    const { name, order } = req.body
    const folder = await FolderService.updateFolder({
      id: folderId,
      workspaceId,
      accountId: req.account.id,
      name,
      order,
    })
    return res.status(StatusCodes.OK).json(folder)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const deleteFolder = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, folderId } = req.params
    await FolderService.deleteFolder({
      id: folderId,
      workspaceId,
      accountId: req.account.id,
    })
    return res.status(StatusCodes.OK).json({ message: 'Folder deleted' })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}
