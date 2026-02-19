import { useState, useEffect, useCallback } from "react"
import { z } from "zod"
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

const toggleFeaturedResponseSchema = z.object({
  success: z.boolean().optional(),
  is_featured: z.boolean(),
})

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

      const data = (await response.json()) as { badges?: BadgeWithMeta[] }
      setBadges(Array.isArray(data.badges) ? data.badges : [])
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
        const data = (await response.json().catch(() => null)) as { error?: unknown } | null
        const message = typeof data?.error === "string" ? data.error : "Failed to update badge"
        throw new Error(message)
      }

      const data = (await response.json()) as unknown
      const parsedResponse = toggleFeaturedResponseSchema.safeParse(data)
      if (!parsedResponse.success) {
        throw new Error("Invalid badge feature response: expected { is_featured: boolean }")
      }

      const isFeatured = parsedResponse.data.is_featured

      // Update local state
      setBadges((prev) =>
        prev.map((badge) =>
          badge.id === badgeId
            ? { ...badge, is_featured: isFeatured }
            : badge
        )
      )

      return isFeatured
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

      const data = (await response.json()) as { total_awarded?: number; awarded?: string[] }

      // Refetch badges if new ones were awarded
      if ((data.total_awarded ?? 0) > 0) {
        await fetchBadges()
      }

      return Array.isArray(data.awarded)
        ? data.awarded.filter((badgeId): badgeId is string => typeof badgeId === "string")
        : []
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

