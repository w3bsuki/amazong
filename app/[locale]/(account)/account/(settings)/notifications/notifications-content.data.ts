import type { SupabaseClient } from "@supabase/supabase-js"

import type { NotificationRow } from "./notification-types"
import { DEFAULT_PREFS, type NotificationPreferences } from "./notifications-content.types"

type NotificationPreferencesRow = Partial<NotificationPreferences> | null

export async function fetchNotificationData(
  supabase: SupabaseClient,
  userId: string
): Promise<{ prefs: NotificationPreferences; notifications: NotificationRow[] }> {
  let prefs: NotificationPreferences = DEFAULT_PREFS

  try {
    const { data: prefData, error: prefError } = await supabase
      .from("notification_preferences")
      .select(
        "user_id,in_app_purchase,in_app_order_status,in_app_message,in_app_review,in_app_system,in_app_promotion,email_purchase,email_order_status,email_message,email_review,email_system,email_promotion,push_enabled"
      )
      .eq("user_id", userId)
      .maybeSingle()

    if (!prefError && prefData) {
      const row = prefData as NotificationPreferencesRow
      prefs = {
        in_app_purchase: row?.in_app_purchase ?? true,
        in_app_order_status: row?.in_app_order_status ?? true,
        in_app_message: row?.in_app_message ?? true,
        in_app_review: row?.in_app_review ?? true,
        in_app_system: row?.in_app_system ?? true,
        in_app_promotion: row?.in_app_promotion ?? true,
        email_purchase: row?.email_purchase ?? false,
        email_order_status: row?.email_order_status ?? false,
        email_message: row?.email_message ?? false,
        email_review: row?.email_review ?? false,
        email_system: row?.email_system ?? false,
        email_promotion: row?.email_promotion ?? false,
        push_enabled: row?.push_enabled ?? false,
      }
    }
  } catch {
    // If preferences table isn't present yet, keep defaults.
  }

  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id,type,title,body,data,order_id,product_id,conversation_id,is_read,created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return {
    prefs,
    notifications: (data ?? []) as NotificationRow[],
  }
}

export async function markNotificationRead(supabase: SupabaseClient, notificationId: string) {
  await supabase.rpc("mark_notification_read", { p_notification_id: notificationId })
}

export async function markAllNotificationsRead(supabase: SupabaseClient) {
  await supabase.rpc("mark_all_notifications_read")
}

export async function saveNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
  prefs: NotificationPreferences
) {
  await supabase.from("notification_preferences").upsert(
    {
      user_id: userId,
      ...prefs,
    },
    { onConflict: "user_id" }
  )
}
