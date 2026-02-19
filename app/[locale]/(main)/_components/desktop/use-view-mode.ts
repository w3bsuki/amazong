import { useCallback, useEffect, useState } from "react"

type ViewMode = "grid" | "list"

const STORAGE_KEY = "treido-view-mode"

/**
 * Hook to persist view mode preference in localStorage
 */
export function useViewMode(defaultMode: ViewMode = "grid"): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "grid" || stored === "list") {
      setViewMode(stored)
    }
    setIsHydrated(true)
  }, [])

  // Persist to localStorage
  const setMode = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }, [])

  // Return default until hydrated to avoid hydration mismatch
  return [isHydrated ? viewMode : defaultMode, setMode]
}

