"use client"

import { useEffect, useState } from "react"
import { useAuthOptional } from "@/components/providers/auth-state-manager"
import { createClient } from "@/lib/supabase/client"

/**
 * Hook to get the current user's username for profile navigation.
 * Fetches once on auth and caches the result.
 * 
 * @returns { username: string | null, isLoading: boolean }
 */
export function useCurrentUsername() {
  const auth = useAuthOptional()
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Reset if not authenticated
    if (!auth?.user?.id) {
      setUsername(null)
      setIsLoading(false)
      return
    }

    // Already have username for this user - skip fetch
    // (simple in-memory cache per session)
    let mounted = true
    const userId = auth.user.id

    const fetchUsername = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", userId)
          .single()

        if (mounted && data?.username) {
          setUsername(data.username)
        }
      } catch {
        // Silently fail - will fallback to /account
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUsername()
    return () => {
      mounted = false
    }
  }, [auth?.user?.id])

  return { username, isLoading }
}
