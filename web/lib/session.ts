import { toast } from 'sonner'
import { JwtSign, JwtVerify } from '@/lib/jwt'
import { getCookies, removeCookies, setCookies } from '@/lib/cookie'
import globalConfig from '@/configs/global.config'

export type TUserInfoTypes = {
  name: string
  email: string
  image: string
  isVerify: boolean
  package?: string
}

export type TTokenTypes = {
  accessToken: string
  refreshToken: string
}

export type TSessionInfoTypes = {
  token: TTokenTypes
  user: TUserInfoTypes
}

export type TAuthSessionTypes = {
  data: TSessionInfoTypes | null
  setData: (data: TSessionInfoTypes | null) => void
}

export const getSession = async () => {
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
      // ignore if pathname is auth
      const pathname = window.location.pathname
      if (!globalConfig.session.ignorePath.includes(pathname)) {
        setTimeout(() => {
          toast.error('Session expired', {
            description: 'Session expired, please login again',
            duration: 3000,
            onAutoClose: () => {
              window.location.replace(
                `${globalConfig.auth.afterSignoutUrl}?callbackUrl=${pathname}`,
              )
            },
          })
        }, 500)
      }

      return null
    }
  } catch (error) {
    console.warn('Error initial token', error)
    setTimeout(() => {
      toast.error((error as Error)?.message || 'An unknown error occurred')
    }, 1000)
  }
}

export const setSession = async (user: TSessionInfoTypes) => {
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
    } else {
      removeCookies(globalConfig.session.cookieKey)
    }
  } catch (error) {
    console.log('set session error', error)
  }
}

export const removeSession = () => {
  removeCookies(globalConfig.session.cookieKey)
}
