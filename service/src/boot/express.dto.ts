import { Request } from 'express'
import { Accounts } from '../../generated/prisma/client'

export interface RequestWithAccount extends Request {
  account: Accounts
  file?: Express.Multer.File
  /** Role of the authenticated user in the current workspace (set by workspaceGuard) */
  workspaceRole?: 'owner' | 'member' | 'viewer'
}

export default RequestWithAccount
