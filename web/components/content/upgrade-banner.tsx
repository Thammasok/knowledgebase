'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface UpgradeBannerProps {
  feature: string
  requiredTier?: 'personal' | 'startup'
  description?: string
}

const TIER_LABELS: Record<string, string> = {
  personal: 'Personal',
  startup: 'Startup',
}

export function UpgradeBanner({
  feature,
  requiredTier = 'personal',
  description,
}: UpgradeBannerProps) {
  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">
        {TIER_LABELS[requiredTier]} plan required
      </AlertTitle>
      <AlertDescription className="mt-1 flex items-center justify-between gap-4">
        <span className="text-amber-700 dark:text-amber-300 text-sm">
          {description ?? `${feature} is available on the ${TIER_LABELS[requiredTier]} plan and above.`}
        </span>
        <Button size="sm" variant="outline" className="shrink-0 border-amber-400 text-amber-800 hover:bg-amber-100">
          Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  )
}
