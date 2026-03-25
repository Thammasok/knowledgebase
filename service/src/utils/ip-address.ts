import { Request } from 'express'
import config from '../config'
import logger from '../boot/logger'
import RequestWithAccount from '../boot/express.dto'

const LOGGER_NAME = 'IP_ADDRESS'

export type IPLocation = {
  ipVersion: number
  ipAddress: string
  latitude: number
  longitude: number
  countryName: string
  countryCode: string
  timeZone: string
  zipCode: string
  cityName: string
  regionName: string
  isProxy: boolean
  continent: string
  continentCode: string
  currency: Currency
  language: string
  timeZones: string[]
  tlds: string[]
}

export type Currency = {
  code: string
  name: string
}

export const getIPLocation = async (ip: string | string[]) => {
  try {
    let url = config.EXTERNAL_API.IP_API_URL
    if (ip !== '::1') {
      url += ip
    }

    const response = await fetch(url)
    const data = await response.json()

    return data
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    return null
  }
}

export const getIPAddress = async (req: Request | RequestWithAccount) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.ip

  if (ipAddress) {
    return ipAddress
  }

  return ''
}
