import { Request } from 'express'
import { Accounts } from '../../generated/prisma/client'

export interface RequestWithAccount extends Request {
  account: Accounts
  file?: Express.Multer.File
}

export default RequestWithAccount
