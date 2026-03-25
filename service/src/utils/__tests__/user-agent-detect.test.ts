import { Details } from 'express-useragent'
import {
  getDeviceInfo,
  detectDevice,
  detectBrowser,
} from '../user-again-detect'

describe('User Agent Detection', () => {
  describe('getDeviceInfo', () => {
    it('should return complete device info object with all properties', () => {
      const mockUserAgent: Details = {
        browser: 'Chrome',
        os: 'Windows',
        platform: 'Microsoft Windows',
        source: 'Mozilla/5.0',
        version: '96.0.4664.110',
        isMobile: false,
        isDesktop: true,
        isWindows: true,
        isChrome: true,
      } as Details

      const result = getDeviceInfo(mockUserAgent)

      expect(result).toHaveProperty('browser', 'Chrome')
      expect(result).toHaveProperty('os', 'Windows')
      expect(result).toHaveProperty('platform', 'Microsoft Windows')
      expect(result).toHaveProperty('source', 'Mozilla/5.0')
      expect(result).toHaveProperty('version', '96.0.4664.110')
      expect(result).toHaveProperty('deviceType', 'Windows')
      expect(result).toHaveProperty('browserType', 'Chrome')
    })

    it('should handle empty user agent details', () => {
      const emptyUserAgent = {} as Details

      const result = getDeviceInfo(emptyUserAgent)

      expect(result).toEqual({
        browser: '',
        os: '',
        platform: '',
        source: '',
        version: '',
        deviceType: 'Unknown Device',
        browserType: 'Unknown Browser',
      })
    })
  })

  describe('detectDevice', () => {
    it('should detect mobile devices correctly', () => {
      const iPhoneAgent = { isMobile: true, isiPhone: true } as Details
      const androidAgent = { isMobile: true, isAndroid: true } as Details
      const tabletAgent = { isMobile: true, isTablet: true } as Details
      const iPadAgent = { isMobile: true, isiPad: true } as Details

      expect(detectDevice(iPhoneAgent)).toBe('iPhone')
      expect(detectDevice(androidAgent)).toBe('Android')
      expect(detectDevice(tabletAgent)).toBe('Tablet')
      expect(detectDevice(iPadAgent)).toBe('iPad')
    })

    it('should detect desktop devices correctly', () => {
      const windowsAgent = { isDesktop: true, isWindows: true } as Details
      const macAgent = { isDesktop: true, isMac: true } as Details
      const linuxAgent = { isDesktop: true, isLinux: true } as Details
      const chromeOSAgent = { isDesktop: true, isChromeOS: true } as Details

      expect(detectDevice(windowsAgent)).toBe('Windows')
      expect(detectDevice(macAgent)).toBe('Mac')
      expect(detectDevice(linuxAgent)).toBe('Linux')
      expect(detectDevice(chromeOSAgent)).toBe('Chrome OS')
    })

    it('should detect special devices correctly', () => {
      const smartTVAgent = { isSmartTV: true } as Details
      const botAgent = {
        isBot: 'Googlebot',
        isMobile: false,
        isMobileNative: false,
        isTablet: false,
        isiPad: false,
      } as unknown as Details

      expect(detectDevice(smartTVAgent)).toBe('Smart TV')
      expect(detectDevice(botAgent)).toBe('Bot (Googlebot)')
    })
  })

  describe('detectBrowser', () => {
    it('should detect common browsers correctly', () => {
      const chromeAgent = { isChrome: true } as Details
      const safariAgent = { isSafari: true } as Details
      const firefoxAgent = { isFirefox: true } as Details
      const edgeAgent = { isEdge: true } as Details
      const ieAgent = { isIE: true } as Details
      const ieCompatAgent = { isIECompatibilityMode: true } as Details
      const operaAgent = { isOpera: true } as Details

      expect(detectBrowser(chromeAgent)).toBe('Chrome')
      expect(detectBrowser(safariAgent)).toBe('Safari')
      expect(detectBrowser(firefoxAgent)).toBe('Firefox')
      expect(detectBrowser(edgeAgent)).toBe('Edge')
      expect(detectBrowser(ieAgent)).toBe('IE')
      expect(detectBrowser(ieCompatAgent)).toBe('IE Compatibility Mode')
      expect(detectBrowser(operaAgent)).toBe('Opera')
    })

    it('should return Unknown Browser for unrecognized browsers', () => {
      const unknownAgent = {} as Details
      expect(detectBrowser(unknownAgent)).toBe('Unknown Browser')
    })
  })
})
