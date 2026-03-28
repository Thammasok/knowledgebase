import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import RequestWithAccount from '../boot/express.dto'

const TIER_RANK: Record<string, number> = { free: 0, personal: 1, startup: 2 }

/**
 * Middleware factory that enforces a minimum subscription tier.
 * Returns 403 PLAN_REQUIRED when the account's tier is insufficient.
 */
export const tierGuard = (requiredTier: 'personal' | 'startup') => {
  return (req: RequestWithAccount, res: Response, next: NextFunction) => {
    const accountTier = req.account?.tier ?? 'free'
    const required = TIER_RANK[requiredTier] ?? 1
    const current = TIER_RANK[accountTier] ?? 0

    if (current >= required) {
      return next()
    }

    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'Plan upgrade required to access this feature.',
      code: 'PLAN_REQUIRED',
      requiredTier,
    })
  }
}
