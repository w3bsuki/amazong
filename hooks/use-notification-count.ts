"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSupabasePostgresChanges } from "@/hooks/use-supabase-postgres-changes"
import { User } from "@supabase/supabase-js"

/**
 * Hook to fetch and subscribe to unread notification count.
 * Used by AccountDropdown to show notification badge on avatar.
 */
export function useNotificationCount(user: User | null) {
  const [count, setCount] = useState(0)
  const userId = user?.id ?? null

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
    if (!userId) {
      setCount(0)
      return
    }

    const supabase = createClient()
    const { count: unreadCount, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)
      .neq("type", "message") // Messages handled separately

    if (!error && unreadCount !== null) {
      setCount(unreadCount)
    }
  }, [userId])

  // Initial fetch
  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  useSupabasePostgresChanges({
    enabled: Boolean(userId),
    specs: realtimeSpecs,
    onChange: fetchCount,
  })

  return count
}
