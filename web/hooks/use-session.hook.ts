'use client'

import { useEffect, useState } from 'react'
import { TSessionInfoTypes, TTokenTypes, TUserInfoTypes } from '@/lib/session'
import globalConfig from '@/configs/global.config'
import { JwtSign, JwtVerify } from '@/lib/jwt'
import { getCookies, removeCookies, setCookies } from '@/lib/cookie'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

const useSession = () => {
  const [data, setData] = useState<TSessionInfoTypes | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const getSession = async () => {
    try {
      const sessionCookie = getCookies(globalConfig.session.cookieKey)

      if (sessionCookie) {
        const decodedToken = await JwtVerify(
          sessionCookie,
          globalConfig.session.jwtSecret,
        )

        const session: TSessionInfoTypes = {
          token: decodedToken.token as TTokenTypes,
          user: decodedToken.user as TUserInfoTypes,
        }

        return session
      } else {
        // const path = pathname.split('/')
        // ignore if pathname is auth
        if (!globalConfig.session.ignorePath.includes(pathname)) {
          setTimeout(() => {
            toast.error('Session expired', {
              description: 'Session expired, please login again',
              duration: 2000,
              onAutoClose: () => {
                router.push(
                  `${globalConfig.auth.afterSignoutUrl}?callbackUrl=${pathname}`,
                )
              },
            })
          }, 500)
        }

        return null
      }
    } catch (error) {
      setTimeout(() => {
        toast.error((error as Error)?.message || 'An unknown error occurred')
      }, 1000)
    }
  }

  const setSession = async (user: TSessionInfoTypes) => {
    try {
      if (user) {
        const sessionEndcode = await JwtSign(
          user,
          globalConfig.session.jwtSecret,
          {
            expiresIn: globalConfig.session.expiresIn.jwt,
          },
        )

        setCookies(globalConfig.session.cookieKey, sessionEndcode, {
          secure: true,
          sameSite: 'strict',
          expires: globalConfig.session.expiresIn.cookie,
        })

        setData(user)
      } else {
        removeCookies(globalConfig.session.cookieKey)
        setData(null)
      }
    } catch (error) {
      setTimeout(() => {
        toast.error((error as Error)?.message || 'An unknown error occurred')
      }, 1000)
    }
  }

  const removeSession = () => {
    removeCookies(globalConfig.session.cookieKey)
    setData(null)
  }

  useEffect(() => {
    const initialToken = async () => {
      try {
        const sessionCookie = getCookies(globalConfig.session.cookieKey)

        if (sessionCookie) {
          const decodedToken = await JwtVerify(
            sessionCookie,
            globalConfig.session.jwtSecret,
          )

          const session: TSessionInfoTypes = {
            token: decodedToken.token as TTokenTypes,
            user: decodedToken.user as TUserInfoTypes,
          }

          setData(session)
        } else {
          // const path = pathname.split('/')
          // ignore if pathname is auth
          if (!globalConfig.session.ignorePath.includes(pathname)) {
            setTimeout(() => {
              toast.error('Session expired', {
                description: 'Session expired, please login again',
                duration: 2000,
                onAutoClose: () => {
                  router.push(
                    `${globalConfig.auth.afterSignoutUrl}?callbackUrl=${pathname}`,
                  )
                },
              })
            }, 500)
          }

          setData(null)
        }
      } catch (error) {
        setTimeout(() => {
          toast.error((error as Error)?.message || 'An unknown error occurred')
        }, 1000)
        setData({} as TSessionInfoTypes)
      }
    }
    initialToken()
  }, [pathname, router, setData])

  return {
    session: data,
    setSession,
    getSession,
    removeSession,
  }
}

export default useSession
