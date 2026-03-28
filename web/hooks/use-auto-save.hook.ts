'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveOptions<T> {
  /** The data to watch for changes */
  data: T
  /** Called when data should be persisted. Return true on success. */
  onSave: (data: T) => Promise<void>
  /** Debounce delay in ms (default: 2000) */
  delay?: number
}

export function useAutoSave<T>({ data, onSave, delay = 2000 }: UseAutoSaveOptions<T>) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSaveRef = useRef(onSave)
  const isFirstRender = useRef(true)

  // Keep the save callback ref fresh without triggering re-schedules
  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  useEffect(() => {
    // Skip the initial render — only auto-save on subsequent changes
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setStatus('saving')

    timerRef.current = setTimeout(async () => {
      try {
        await onSaveRef.current(data)
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data, delay])

  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus('saving')
    try {
      await onSaveRef.current(data)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }, [data])

  return { status, saveNow }
}
