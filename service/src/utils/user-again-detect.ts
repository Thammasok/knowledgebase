import { Details } from 'express-useragent'

export interface IDeviceInfo {
  browser: string
  os: string
  platform: string
  source: string
  version: string
  deviceType: string
  browserType: string
}

export const getDeviceInfo = (userAgent: Details) => {
  const deviceType = detectDevice(userAgent)
  const browserType = detectBrowser(userAgent)

  const deviceInfo: IDeviceInfo = {
    browser: userAgent?.browser || '',
    os: userAgent?.os || '',
    platform: userAgent?.platform || '',
    source: userAgent?.source || '',
    version: userAgent?.version || '',
    deviceType: deviceType,
    browserType: browserType,
  }

  return deviceInfo
}

export const detectDevice = (deviceInfo: Details) => {
  const mobileTypes = {
    isiPhone: 'iPhone',
    isAndroid: 'Android',
    isTablet: 'Tablet',
    isiPad: 'iPad',
  }

  const desktopTypes = {
    isWindows: 'Windows',
    isMac: 'Mac',
    isLinux: 'Linux',
    isChromeOS: 'Chrome OS',
  }

  if (deviceInfo.isMobile) {
    for (const [key, value] of Object.entries(mobileTypes)) {
      if ((deviceInfo as any)[key]) return value
    }
  }

  if (deviceInfo.isDesktop) {
    for (const [key, value] of Object.entries(desktopTypes)) {
      if ((deviceInfo as any)[key]) return value
    }
  }

  if (deviceInfo.isSmartTV) return 'Smart TV'
  if (deviceInfo.isBot) return `Bot (${deviceInfo.isBot})`

  return 'Unknown Device'
}

export const detectBrowser = (deviceInfo: Details) => {
  if (deviceInfo.isChrome) return 'Chrome'
  if (deviceInfo.isSafari) return 'Safari'
  if (deviceInfo.isFirefox) return 'Firefox'
  if (deviceInfo.isEdge) return 'Edge'
  if (deviceInfo.isIE) return 'IE'
  if (deviceInfo.isIECompatibilityMode) return 'IE Compatibility Mode'
  if (deviceInfo.isOpera) return 'Opera'

  return 'Unknown Browser'
}
