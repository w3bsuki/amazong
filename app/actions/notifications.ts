"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export interface Notification {
  id: string
  user_id: string
  type: "purchase" | "order_status" | "message" | "review" | "system" | "promotion"
  title: string
  body: string | null
  data: Record<string, unknown>
  order_id: string | null
  product_id: string | null
  conversation_id: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  expires_at: string | null
}

/**
 * Get notifications for the current user
 * Uses cache tag for efficient revalidation
 */
export async function getNotifications(options?: {
  limit?: number
  unreadOnly?: boolean
  type?: Notification["type"]
}) {
  const supabase = await createClient()
  if (!supabase) return { data: null, error: "Not authenticated" }

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { data: null, error: "Not authenticated" }

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })

  if (options?.unreadOnly) {
    query = query.eq("is_read", false)
  }

  if (options?.type) {
    query = query.eq("type", options.type)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  return { data: data as Notification[] | null, error: error?.message || null }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient()
  if (!supabase) return 0

  const { data, error } = await supabase.rpc("get_unread_notification_count")
  
  if (error) {
    console.error("Error getting unread count:", error)
    return 0
  }

  return data || 0
}

/**
 * Mark a single notification as read
 * Revalidates the notifications cache tag
 */
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "Not authenticated" }

  const { error } = await supabase.rpc("mark_notification_read", {
    p_notification_id: notificationId
  })

  if (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: error.message }
  }

  // Revalidate notifications cache
  revalidatePath('/[locale]/(main)', 'layout')
  
  return { success: true, error: null }
}

/**
 * Mark all notifications as read
 * Revalidates the notifications cache tag
 */
export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  if (!supabase) return { success: false, count: 0, error: "Not authenticated" }

  const { data, error } = await supabase.rpc("mark_all_notifications_read")

  if (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, count: 0, error: error.message }
  }

  // Revalidate notifications cache
  revalidatePath('/[locale]/(main)', 'layout')
  
  return { success: true, count: data || 0, error: null }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "Not authenticated" }

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userData.user.id)

  if (error) {
    console.error("Error deleting notification:", error)
    return { success: false, error: error.message }
  }

  // Revalidate notifications cache
  revalidatePath('/[locale]/(main)', 'layout')
  
  return { success: true, error: null }
}

/**
 * Create a notification (for server-side use)
 * This can be called from webhooks, triggers, etc.
 */
export async function createNotification(notification: {
  user_id: string
  type: Notification["type"]
  title: string
  body?: string
  data?: Record<string, unknown>
  order_id?: string
  product_id?: string
  conversation_id?: string
  expires_at?: string
}) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "Server error" }

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      body: notification.body || null,
      data: (notification.data || {}) as import('@/lib/supabase/database.types').Json,
      order_id: notification.order_id || null,
      product_id: notification.product_id || null,
      conversation_id: notification.conversation_id || null,
      expires_at: notification.expires_at || null
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating notification:", error)
    return { success: false, data: null, error: error.message }
  }

  // Revalidate notifications cache
  revalidatePath('/[locale]/(main)', 'layout')
  
  return { success: true, data, error: null }
}
