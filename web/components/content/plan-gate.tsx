'use client'

import { UpgradeBanner } from './upgrade-banner'

interface PlanGateProps {
  requiredTier: 'personal' | 'startup'
  currentTier: string | undefined
  feature: string
  description?: string
  children: React.ReactNode
}

/**
 * Renders children when the user's tier meets the requirement.
 * Shows an upgrade banner otherwise.
 */
export function PlanGate({ requiredTier, currentTier, feature, description, children }: PlanGateProps) {
  const tierRank: Record<string, number> = { free: 0, personal: 1, startup: 2 }
  const required = tierRank[requiredTier] ?? 1
  const current = tierRank[currentTier ?? 'free'] ?? 0

  if (current >= required) {
    return <>{children}</>
  }

  return (
    <div className="p-4">
      <UpgradeBanner feature={feature} requiredTier={requiredTier} description={description} />
    </div>
  )
}
