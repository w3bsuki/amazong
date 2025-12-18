"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * Hook to detect if a media query matches.
 * Uses useSyncExternalStore for proper SSR hydration support.
 * 
 * Note: Returns `false` during SSR to ensure consistent server/client rendering.
 * This prevents hydration mismatches.
 * 
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => {
    // During SSR, return false to ensure consistent hydration.
    // The actual value will be determined client-side after hydration.
    return false;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
