import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import RequestWithAccount from '../boot/express.dto'
import db from '../libs/db/prisma'

/**
 * Validates that the authenticated user has access to the workspace
 * identified by req.params.workspaceId.
 *
 * Sets req.workspaceRole = 'owner' | 'member' | 'viewer'.
 * Returns 403 if the user has no access.
 */
export const workspaceGuard = async (
  req: RequestWithAccount,
  res: Response,
  next: NextFunction,
) => {
  const workspaceId = req.params.workspaceId
  const accountId = req.account.id

  const workspace = await db.workspace.findFirst({
    where: { id: workspaceId, isRemove: false },
    select: { accountId: true },
  })

  if (!workspace) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Workspace not found' })
  }

  if (workspace.accountId === accountId) {
    req.workspaceRole = 'owner'
    return next()
  }

  const member = await db.workspaceMember.findUnique({
    where: { workspaceId_accountId: { workspaceId, accountId } },
    select: { role: true },
  })

  if (member) {
    req.workspaceRole = member.role as 'member' | 'viewer'
    return next()
  }

  return res.status(StatusCodes.FORBIDDEN).json({
    message: 'You do not have access to this workspace.',
    code: 'FORBIDDEN',
  })
}

const ROLE_RANK: Record<string, number> = { viewer: 0, member: 1, owner: 2 }

/**
 * Middleware factory that enforces a minimum workspace role.
 * Must be placed after workspaceGuard in the middleware chain.
 * Returns 403 FORBIDDEN when the role is insufficient.
 */
export const roleGuard = (minRole: 'member' | 'owner') => {
  return (req: RequestWithAccount, res: Response, next: NextFunction) => {
    const current = ROLE_RANK[req.workspaceRole ?? 'viewer'] ?? 0
    const required = ROLE_RANK[minRole] ?? 1

    if (current >= required) {
      return next()
    }

    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'You do not have permission to perform this action.',
      code: 'FORBIDDEN',
    })
  }
}
