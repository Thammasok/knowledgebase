import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import RequestWithAccount from '../../boot/express.dto'
import * as TeamService from './team.service'
import logger from '../../boot/logger'

const LOGGER_NAME = 'TEAM:'

export const createTeam = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, logo, color } = req.body
    const team = await TeamService.createTeam({
      accountId: req.account.id,
      name,
      logo,
      color,
    })

    return res.status(StatusCodes.CREATED).json(team)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const updateTeam = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const { name, logo, color } = req.body
    const team = await TeamService.updateTeam({
      id,
      accountId: req.account.id,
      name,
      logo,
      color,
    })

    return res.status(StatusCodes.OK).json(team)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })
    next(error)
  }
}

export const getTeams = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query
    const result = await TeamService.getTeams({
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
