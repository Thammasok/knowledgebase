import { getSession, removeSession, setSession } from '@/lib/session'
import { getCookies } from '@/lib/cookie'
import callGlobal from '@/services/global.service'
import globalConfig from '@/configs/global.config'
import { globalApiPath } from '@/configs/service.config'
import customServiceError from '@/utils/custom-service-error'

const refreshService = async () => {
  try {
    const session = await getSession()
    const deviceId = getCookies('deviceId')

    const result = await callGlobal.post(
      globalApiPath.all.path.refresh,
      {},
      {
        headers: {
          Authorization: `Bearer ${session?.token.refreshToken as string}`,
          'x-device-id': deviceId,
        },
      },
    )

    if (result.data) {
      const data = result.data

      setSession({
        token: {
          accessToken: data.token.accessToken,
          refreshToken: data.token.refreshToken,
        },
        user: {
          name: data.account.displayName,
          email: data.account.email,
          image: data.account.image,
          isVerify: data.account.isVerify,
        },
      })

      return data.token.accessToken
    }

    return ''
  } catch (error) {
    const err = customServiceError(error)

    if (err?.statusCode === 401) {
      // Logout
      removeSession()

      const pathname = globalThis.location.pathname
      globalThis.location.replace(
        `${globalConfig.auth.afterSignoutUrl}?callbackUrl=${pathname}`,
      )
    } else {
      console.log('refresh error', error)
    }
  }
}

export default refreshService
