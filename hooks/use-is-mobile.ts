"use client"

import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

/**
 * Hook to detect if the viewport is mobile-sized.
 * Uses useSyncExternalStore for proper SSR hydration support.
 * 
 * Note: Returns `false` during SSR to ensure consistent server/client rendering.
 * This prevents hydration mismatches.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
}

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(MOBILE_MEDIA_QUERY)
  const onChange = () => callback()

  const addMqlListener = () => {
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }

    const legacyMql = mql as MediaQueryList & {
      addListener: (listener: () => void) => void
      removeListener: (listener: () => void) => void
    }

    legacyMql.addListener(onChange)
    return () => legacyMql.removeListener(onChange)
  }

  const removeMqlListener = addMqlListener()
  window.addEventListener('resize', onChange)
  // Force one immediate client snapshot pass after hydration.
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(callback)
  } else {
    void Promise.resolve().then(callback)
  }

  return () => {
    removeMqlListener()
    window.removeEventListener('resize', onChange)
  }
}

function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

function getServerSnapshot(): boolean {
  // During SSR, return false (assume desktop) to ensure consistent hydration.
  // The actual value will be determined client-side after hydration.
  return false
}
