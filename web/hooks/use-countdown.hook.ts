'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseCountdownProps {
  initialSeconds?: number
  onComplete?: () => void
}

interface UseCountdownReturn {
  seconds: number
  isActive: boolean
  isCompleted: boolean
  start: () => void
  reset: () => void
  pause: () => void
  resume: () => void
  formatTime: (seconds: number) => string
}

export default function useCountdown({
  initialSeconds = 60,
  onComplete,
}: UseCountdownProps = {}): UseCountdownReturn {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const start = useCallback(() => {
    setSeconds(initialSeconds)
    setIsActive(true)
    setIsCompleted(false)
  }, [initialSeconds])

  const reset = useCallback(() => {
    setSeconds(initialSeconds)
    setIsActive(false)
    setIsCompleted(false)
  }, [initialSeconds])

  const pause = useCallback(() => {
    setIsActive(false)
  }, [])

  const resume = useCallback(() => {
    if (seconds > 0) {
      setIsActive(true)
    }
  }, [seconds])

  const formatTime = useCallback((totalSeconds: number): string => {
    if (totalSeconds <= 0) return '00:00'

    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setIsActive(false)
            setIsCompleted(true)
            onComplete?.()
            return 0
          }
          return prevSeconds - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, seconds, onComplete])

  return {
    seconds,
    isActive,
    isCompleted,
    start,
    reset,
    pause,
    resume,
    formatTime,
  }
}
