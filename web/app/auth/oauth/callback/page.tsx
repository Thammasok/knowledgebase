'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { setSession } from '@/lib/session'
import globalConfig from '@/configs/global.config'

export default function OAuthCallbackPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated' && session?.accessToken) {
      setSession({
        token: {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        },
        user: {
          name: session.user?.name ?? '',
          email: session.user?.email ?? '',
          image: session.user?.image ?? '',
          isVerify: session.user?.isVerify ?? false,
        },
      }).then(() => {
        router.replace(globalConfig.auth.afterLoginUrl)
      })
    } else if (status === 'unauthenticated') {
      router.replace('/auth/login?error=oauth_failed')
    }
  }, [status, session, router])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-muted-foreground text-sm">Setting up your session…</p>
    </div>
  )
}
