import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import RequestWithAccount from '../../boot/express.dto'
import * as PageService from './page.service'
import logger from '../../boot/logger'

const LOGGER_NAME = 'PAGE:'

export const getPages = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params
    const pages = await PageService.getPages({
      workspaceId,
      accountId: req.account.id,
    })
    return res.status(StatusCodes.OK).json(pages)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const getPage = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, pageId } = req.params
    const page = await PageService.getPage({
      id: pageId,
      workspaceId,
      accountId: req.account.id,
    })
    return res.status(StatusCodes.OK).json(page)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const createPage = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params
    const { title, folderId, parentPageId, order } = req.body
    const page = await PageService.createPage({
      workspaceId,
      accountId: req.account.id,
      title,
      folderId,
      parentPageId,
      order,
    })
    return res.status(StatusCodes.CREATED).json(page)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const updatePage = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, pageId } = req.params
    const { title, order } = req.body
    const page = await PageService.updatePage({
      id: pageId,
      workspaceId,
      accountId: req.account.id,
      title,
      order,
    })
    return res.status(StatusCodes.OK).json(page)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const updatePageContent = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, pageId } = req.params
    const { blocks } = req.body
    const page = await PageService.updatePageContent({
      id: pageId,
      workspaceId,
      accountId: req.account.id,
      blocks,
      tier: req.account.tier,
    })
    return res.status(StatusCodes.OK).json(page)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const deletePage = async (req: RequestWithAccount, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, pageId } = req.params
    await PageService.deletePage({
      id: pageId,
      workspaceId,
      accountId: req.account.id,
    })
    return res.status(StatusCodes.OK).json({ message: 'Page deleted' })
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}
