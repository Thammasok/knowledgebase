import { StatusCodes } from 'http-status-codes'
import db from '../db/prisma'

const FREE_TIER_LIMIT = 1000

/**
 * Atomically increment the workspace block count.
 * Throws 403 if the workspace is at the Free tier limit.
 */
export const incrementBlockCount = async (workspaceId: string, delta: number, tier: string) => {
  if (delta <= 0) return

  if (tier === 'free') {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId, isRemove: false },
      select: { blockCount: true },
    })

    if (!workspace) return

    if (workspace.blockCount + delta > FREE_TIER_LIMIT) {
      const error: any = new Error('Block limit reached. Upgrade to add more content.')
      error.status = StatusCodes.FORBIDDEN
      error.code = 'BLOCK_LIMIT_REACHED'
      error.limit = FREE_TIER_LIMIT
      error.current = workspace.blockCount
      throw error
    }
  }

  await db.workspace.update({
    where: { id: workspaceId },
    data: { blockCount: { increment: delta } },
  })
}
