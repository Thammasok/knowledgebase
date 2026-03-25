'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import globalConfig from '@/configs/global.config'
import useSession from '@/hooks/use-session.hook'

const useAuthSigned = ({ callbackUrl }: { callbackUrl?: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { session } = useSession()

  useEffect(() => {
    // if have session and not ignore path
    if (session?.token.accessToken) {
      if (globalConfig.session.ignorePath.includes(pathname)) {
        router.push(callbackUrl ?? globalConfig.auth.afterLoginUrl)
      }
    }
  }, [router, callbackUrl, session, pathname])
}

export default useAuthSigned
