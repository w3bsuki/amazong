"use server"

import { revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export interface BlockedUser {
  blocked_id: string
  blocked_at: string
  reason: string | null
  full_name: string | null
  avatar_url: string | null
}

/**
 * Block a user
 * Prevents them from messaging you
 */
export async function blockUser(userId: string, reason?: string) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "Not authenticated" }

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { success: false, error: "Not authenticated" }

  // Can't block yourself
  if (userData.user.id === userId) {
    return { success: false, error: "Cannot block yourself" }
  }

  const { data, error } = await supabase.rpc("block_user", {
    p_user_to_block: userId,
    ...(reason ? { p_reason: reason } : {})
  })

  if (error) {
    console.error("Error blocking user:", error)
    return { success: false, error: error.message }
  }

  // Revalidate relevant caches
  revalidateTag("blocked-users", "max")
  revalidateTag("conversations", "max")

  return { success: data === true, error: null }
}

/**
 * Unblock a user
 */
async function unblockUser(userId: string) {
  const supabase = await createClient()
  if (!supabase) return { success: false, error: "Not authenticated" }

  const { data, error } = await supabase.rpc("unblock_user", {
    p_user_to_unblock: userId
  })

  if (error) {
    console.error("Error unblocking user:", error)
    return { success: false, error: error.message }
  }

  // Revalidate relevant caches
  revalidateTag("blocked-users", "max")
  revalidateTag("conversations", "max")

  return { success: data === true, error: null }
}

/**
 * Get list of blocked users
 */
async function getBlockedUsers(): Promise<{ data: BlockedUser[] | null; error: string | null }> {
  const supabase = await createClient()
  if (!supabase) return { data: null, error: "Not authenticated" }

  const { data, error } = await supabase.rpc("get_blocked_users")

  if (error) {
    console.error("Error getting blocked users:", error)
    return { data: null, error: error.message }
  }

  return { data: data as BlockedUser[], error: null }
}

/**
 * Check if a user is blocked
 */
async function isUserBlocked(userId: string): Promise<boolean> {
  const supabase = await createClient()
  if (!supabase) return false

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return false

  const { data, error } = await supabase.rpc("is_blocked_bidirectional", {
    p_user_a: userData.user.id,
    p_user_b: userId
  })

  if (error) {
    console.error("Error checking block status:", error)
    return false
  }

  return data === true
}
