import axios from 'axios'
import { getCookies } from '@/lib/cookie'
import { globalApiPath } from '@/configs/service.config'

const callGlobal = axios.create({
  baseURL: globalApiPath.defaultUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

callGlobal.interceptors.request.use(async (config) => {
  const deviceId = getCookies('deviceId')

  config.headers['x-device-id'] ??= deviceId

  return config
})

export default callGlobal
