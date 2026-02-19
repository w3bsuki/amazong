"use server"

import { z } from "zod"
import { revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/auth/require-auth"

export interface BlockedUser {
  blocked_id: string
  blocked_at: string
  reason: string | null
  full_name: string | null
  avatar_url: string | null
}

const UserIdSchema = z.string().uuid()

/**
 * Block a user
 * Prevents them from messaging you
 */
export async function blockUser(userId: string, reason?: string) {
  const parsedUserId = UserIdSchema.safeParse(userId)
  if (!parsedUserId.success) return { success: false, error: "Invalid userId" }

  const auth = await requireAuth()
  if (!auth) return { success: false, error: "Not authenticated" }

  const { supabase, user } = auth

  // Can't block yourself
  if (user.id === parsedUserId.data) {
    return { success: false, error: "Cannot block yourself" }
  }

  const { data, error } = await supabase.rpc("block_user", {
    p_user_to_block: parsedUserId.data,
    ...(reason ? { p_reason: reason } : {}),
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
export async function unblockUser(userId: string) {
  const parsedUserId = UserIdSchema.safeParse(userId)
  if (!parsedUserId.success) return { success: false, error: "Invalid userId" }

  const auth = await requireAuth()
  if (!auth) return { success: false, error: "Not authenticated" }

  const { supabase } = auth

  const { data, error } = await supabase.rpc("unblock_user", {
    p_user_to_unblock: parsedUserId.data,
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
export async function getBlockedUsers(): Promise<{ data: BlockedUser[] | null; error: string | null }> {
  const auth = await requireAuth()
  if (!auth) return { data: null, error: "Not authenticated" }

  const { supabase } = auth

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
export async function isUserBlocked(userId: string): Promise<boolean> {
  const parsedUserId = UserIdSchema.safeParse(userId)
  if (!parsedUserId.success) return false

  const auth = await requireAuth()
  if (!auth) return false

  const { supabase, user } = auth

  const { data, error } = await supabase.rpc("is_blocked_bidirectional", {
    p_user_a: user.id,
    p_user_b: parsedUserId.data,
  })

  if (error) {
    console.error("Error checking block status:", error)
    return false
  }

  return data === true
}
