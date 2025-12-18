import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768

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
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', callback)
  window.addEventListener('resize', callback)
  return () => {
    mql.removeEventListener('change', callback)
    window.removeEventListener('resize', callback)
  }
}

function getSnapshot(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot(): boolean {
  // During SSR, return false (assume desktop) to ensure consistent hydration.
  // The actual value will be determined client-side after hydration.
  return false
}
