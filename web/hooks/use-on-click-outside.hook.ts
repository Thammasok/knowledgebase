import { RefObject, useEffect } from 'react'

/**
 * Custom hook that triggers a callback when clicking outside of the referenced element
 * @param ref - React ref object pointing to the target element
 * @param handler - Callback function to execute when clicking outside
 * @param enabled - Optional flag to enable/disable the hook (default: true)
 */
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
): void => {
  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current

      // Do nothing if clicking ref's element or descendent elements
      if (!element || element.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, enabled])
}

// Alternative version that accepts multiple refs
export const useOnClickOutsideMultiple = <T extends HTMLElement = HTMLElement>(
  refs: RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
): void => {
  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      // Check if click is outside all referenced elements
      const isOutside = refs.every((ref) => {
        const element = ref.current
        return !element || !element.contains(event.target as Node)
      })

      if (isOutside) {
        handler(event)
      }
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refs, handler, enabled])
}
