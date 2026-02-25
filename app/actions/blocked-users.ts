"use server"

import { z } from "zod"
import { revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/auth/require-auth"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"

import { logger } from "@/lib/logger"
export interface BlockedUser {
  blocked_id: string
  blocked_at: string
  reason: string | null
  full_name: string | null
  avatar_url: string | null
}

const UserIdSchema = z.string().uuid()
const BlockedUserSchema = z.object({
  blocked_id: z.string().uuid(),
  blocked_at: z.string(),
  reason: z.string().nullable(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
})
const BlockedUsersSchema = z.array(BlockedUserSchema)

type BlockUserResult = Envelope<
  { error: null },
  { error: string }
>

type BlockedUsersResult = Envelope<
  { data: BlockedUser[]; error: null },
  { data: null; error: string }
>

type IsUserBlockedResult = Envelope<
  { blocked: boolean; error: null },
  { blocked: boolean; error: string }
>

/**
 * Block a user
 * Prevents them from messaging you
 */
export async function blockUser(userId: string, reason?: string): Promise<BlockUserResult> {
  const parsedUserId = UserIdSchema.safeParse(userId)
  if (!parsedUserId.success) return errorEnvelope({ error: "Invalid userId" })

  const auth = await requireAuth()
  if (!auth) return errorEnvelope({ error: "Not authenticated" })

  const { supabase, user } = auth

  // Can't block yourself
  if (user.id === parsedUserId.data) {
    return errorEnvelope({ error: "Cannot block yourself" })
  }

  const { data, error } = await supabase.rpc("block_user", {
    p_user_to_block: parsedUserId.data,
    ...(reason ? { p_reason: reason } : {}),
  })

  if (error) {
    logger.error("Error blocking user:", error)
    return errorEnvelope({ error: error.message })
  }

  if (data !== true) {
    return errorEnvelope({ error: "Failed to block user" })
  }

  // Revalidate relevant caches
  revalidateTag("blocked-users", "max")
  revalidateTag("conversations", "max")

  return successEnvelope({ error: null })
}

/**
 * Unblock a user
 */
export async function unblockUser(userId: string): Promise<BlockUserResult> {
  const parsedUserId = UserIdSchema.safeParse(userId)
  if (!parsedUserId.success) return errorEnvelope({ error: "Invalid userId" })

  const auth = await requireAuth()
  if (!auth) return errorEnvelope({ error: "Not authenticated" })

  const { supabase } = auth

  const { data, error } = await supabase.rpc("unblock_user", {
    p_user_to_unblock: parsedUserId.data,
  })

  if (error) {
    logger.error("Error unblocking user:", error)
    return errorEnvelope({ error: error.message })
  }

  if (data !== true) {
    return errorEnvelope({ error: "Failed to unblock user" })
  }

  // Revalidate relevant caches
  revalidateTag("blocked-users", "max")
  revalidateTag("conversations", "max")

  return successEnvelope({ error: null })
}

/**
 * Get list of blocked users
 */
export async function getBlockedUsers(): Promise<BlockedUsersResult> {
  const auth = await requireAuth()
  if (!auth) return errorEnvelope({ data: null, error: "Not authenticated" })

  const { supabase } = auth

  const { data, error } = await supabase.rpc("get_blocked_users")

  if (error) {
    logger.error("Error getting blocked users:", error)
    return errorEnvelope({ data: null, error: error.message })
  }

  const parsedBlockedUsers = BlockedUsersSchema.safeParse(data ?? [])
  if (!parsedBlockedUsers.success) {
    logger.error("Invalid blocked users payload:", parsedBlockedUsers.error)
    return errorEnvelope({ data: null, error: "Invalid blocked users response" })
  }

  return successEnvelope({ data: parsedBlockedUsers.data, error: null })
}

/**
 * Check if a user is blocked
 */
export async function isUserBlocked(userId: string): Promise<IsUserBlockedResult> {
  const parsedUserId = UserIdSchema.safeParse(userId)
  if (!parsedUserId.success) return errorEnvelope({ blocked: false, error: "Invalid userId" })

  const auth = await requireAuth()
  if (!auth) return errorEnvelope({ blocked: false, error: "Not authenticated" })

  const { supabase, user } = auth

  const { data, error } = await supabase.rpc("is_blocked_bidirectional", {
    p_user_a: user.id,
    p_user_b: parsedUserId.data,
  })

  if (error) {
    logger.error("Error checking block status:", error)
    return errorEnvelope({ blocked: false, error: "Failed to check block status" })
  }

  return successEnvelope({ blocked: data === true, error: null })
}
