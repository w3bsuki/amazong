"use client"

import { useState, useEffect, useCallback } from "react"
import type { DisplayBadge } from "@/lib/types/badges"

interface BadgeWithMeta extends DisplayBadge {
  id: string
  earned_at: string
  is_featured: boolean
}

interface UseBadgesResult {
  badges: BadgeWithMeta[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  toggleFeatured: (badgeId: string) => Promise<boolean>
  evaluateBadges: (context?: string) => Promise<string[]>
}

/**
 * Hook for managing user badges
 * Fetches badges, allows featuring/unfeaturing, and evaluating new badges
 */
export function useBadges(): UseBadgesResult {
  const [badges, setBadges] = useState<BadgeWithMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBadges = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/badges")
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("Please sign in to view badges")
        } else {
          setError("Failed to load badges")
        }
        return
      }
      
      const data = await response.json()
      setBadges(data.badges || [])
    } catch (err) {
      setError("Failed to load badges")
      console.error("Error fetching badges:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBadges()
  }, [fetchBadges])

  const toggleFeatured = useCallback(async (badgeId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/badges/feature/${badgeId}`, {
        method: "PATCH",
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update badge")
      }
      
      const data = await response.json()
      
      // Update local state
      setBadges(prev => prev.map(badge => 
        badge.id === badgeId 
          ? { ...badge, is_featured: data.is_featured }
          : badge
      ))
      
      return data.is_featured
    } catch (err) {
      console.error("Error toggling badge feature:", err)
      throw err
    }
  }, [])

  const evaluateBadges = useCallback(async (context?: string): Promise<string[]> => {
    try {
      const response = await fetch("/api/badges/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to evaluate badges")
      }
      
      const data = await response.json()
      
      // Refetch badges if new ones were awarded
      if (data.total_awarded > 0) {
        await fetchBadges()
      }
      
      return data.awarded || []
    } catch (err) {
      console.error("Error evaluating badges:", err)
      return []
    }
  }, [fetchBadges])

  return {
    badges,
    isLoading,
    error,
    refetch: fetchBadges,
    toggleFeatured,
    evaluateBadges,
  }
}

/**
 * Hook to fetch another user's public badges
 */
export function usePublicBadges(userId: string | null) {
  const [badges, setBadges] = useState<BadgeWithMeta[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setBadges([])
      return
    }
    
    let cancelled = false
    
    async function fetchBadges() {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/badges/${userId}`)
        
        if (!response.ok) {
          throw new Error("Failed to load badges")
        }
        
        const data = await response.json()
        
        if (!cancelled) {
          setBadges(data.badges || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load badges")
          console.error("Error fetching public badges:", err)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    
    fetchBadges()
    
    return () => {
      cancelled = true
    }
  }, [userId])

  return { badges, isLoading, error }
}
