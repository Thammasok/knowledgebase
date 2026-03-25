'use client'

import { useEffect, useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { getCookies, setCookies } from '@/lib/cookie'

function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string>('')

  useEffect(() => {
    const loadDeviceId = async () => {
      try {
        const existingDeviceId = getCookies('deviceId')

        if (existingDeviceId) {
          setDeviceId(existingDeviceId)
        } else {
          const fp = await FingerprintJS.load()
          const result = await fp.get()

          setCookies('deviceId', result.visitorId)
          setDeviceId(result.visitorId)
        }
      } catch (error) {
        console.warn('Failed to load device ID:', error)
        // Fallback to a random ID if FingerprintJS fails
        const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        setCookies('deviceId', fallbackId)
        setDeviceId(fallbackId)
      }
    }

    loadDeviceId()
  }, [])

  return { deviceId }
}

export default useDeviceId
