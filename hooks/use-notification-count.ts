"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSupabasePostgresChanges } from "@/hooks/use-supabase-postgres-changes"
import type { User } from "@supabase/supabase-js"

/**
 * Hook to fetch and subscribe to unread notification count.
 * Used by AccountDropdown to show notification badge on avatar.
 */
export function useNotificationCount(user: User | null) {
  const [count, setCount] = useState(0)
  const userId = user?.id ?? null
  const requestIdRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const realtimeSpecs = useMemo(() => {
    if (!userId) return []

    return [
      {
        channel: "notification-count",
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
    ] as const
  }, [userId])

  const fetchCount = useCallback(async () => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current

    if (!userId) {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setCount(0)
      }
      return
    }

    try {
      const supabase = createClient()
      const { count: unreadCount, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false)
        .neq("type", "message") // Messages handled separately

      if (!mountedRef.current || requestId !== requestIdRef.current) return

      if (!error && unreadCount !== null) {
        setCount(unreadCount)
      }
    } catch {
      // Keep resilient
    }
  }, [userId])

  // Initial fetch
  useEffect(() => {
    void fetchCount()
  }, [fetchCount])

  useSupabasePostgresChanges({
    enabled: Boolean(userId),
    specs: realtimeSpecs,
    onChange: fetchCount,
  })

  return count
}
