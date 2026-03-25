import axios, { AxiosRequestConfig } from 'axios'
import { getCookies } from '@/lib/cookie'
import { getSession } from '@/lib/session'
import refreshService from '@/services/refresh.service'
import { authApiPath } from '@/configs/service.config'

const callWithAuth = axios.create({
  baseURL: authApiPath.defaultUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

callWithAuth.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    const deviceId = getCookies('deviceId')

    config.headers['Authorization'] = `Bearer ${session?.token.accessToken}`
    config.headers['x-device-id'] = deviceId

    return config
  },
  (error) => Promise.reject(new Error(error)),
)

interface IRetryQueueItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value?: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (error?: any) => void
  config: AxiosRequestConfig
}

const refreshAndRetryQueue: IRetryQueueItem[] = []
let isRefreshing = false

callWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig = error.config

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
      // return Promise.reject(new Error(error instanceof Error ? error.message : 'An error occurred'))
    }

    if (!isRefreshing) {
      isRefreshing = true

      try {
        const accessToken: string = await refreshService()

        if (!accessToken) {
          throw new Error('Failed to refresh token')
        }

        // Repeat all miss request by 401
        refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
          callWithAuth(config)
            .then((response) => resolve(response))
            .catch((err) => reject(err))
        })

        refreshAndRetryQueue.length = 0
        isRefreshing = false

        return callWithAuth(originalRequest)
      } catch (error) {
        // If the retrying request fails, reject the original error and re-render the component with a loading indicator
        return Promise.reject(
          new Error(
            error instanceof Error ? error.message : 'An error occurred',
          ),
        )
      }
    }

    // If there's already an ongoing refresh operation, push the original request to the queue and re-render the component with a loading indicator
    return new Promise<void>((resolve, reject) => {
      refreshAndRetryQueue.push({ config: originalRequest, resolve, reject })
      return null
    })
  },
)
export default callWithAuth
