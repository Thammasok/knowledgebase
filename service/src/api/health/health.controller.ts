import { Response, Request, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

const healthCheck = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  return res.status(StatusCodes.OK).json({ msg: 'alive' })
}

export default {
  healthCheck,
}
