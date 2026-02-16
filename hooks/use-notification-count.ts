"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

/**
 * Hook to fetch and subscribe to unread notification count.
 * Used by AccountDropdown to show notification badge on avatar.
 */
export function useNotificationCount(user: User | null) {
  const [count, setCount] = useState(0)

  const fetchCount = useCallback(async () => {
    if (!user) {
      setCount(0)
      return
    }

    const supabase = createClient()
    const { count: unreadCount, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false)
      .neq("type", "message") // Messages handled separately

    if (!error && unreadCount !== null) {
      setCount(unreadCount)
    }
  }, [user])

  // Initial fetch
  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!user) return

    const supabase = createClient()
    const channel = supabase
      .channel("notification-count")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch count on any change
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchCount])

  return count
}
