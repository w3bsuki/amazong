"use server"

import { z } from "zod"
import { revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/auth/require-auth"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import {
  blockUserRpc,
  getBlockedUsersRpc,
  isBlockedBidirectionalRpc,
  unblockUserRpc,
} from "@/lib/data/blocked-users"

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

  const result = await blockUserRpc({
    supabase,
    userToBlock: parsedUserId.data,
    ...(reason ? { reason } : {}),
  })

  if (!result.ok) {
    logger.error("Error blocking user:", result.error)
    const message =
      typeof result.error === "object" && result.error !== null && "message" in result.error
        ? String((result.error as { message?: unknown }).message ?? "")
        : "Failed to block user"
    return errorEnvelope({ error: message })
  }

  if (!result.success) {
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

  const result = await unblockUserRpc({ supabase, userToUnblock: parsedUserId.data })

  if (!result.ok) {
    logger.error("Error unblocking user:", result.error)
    const message =
      typeof result.error === "object" && result.error !== null && "message" in result.error
        ? String((result.error as { message?: unknown }).message ?? "")
        : "Failed to unblock user"
    return errorEnvelope({ error: message })
  }

  if (!result.success) {
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

  const result = await getBlockedUsersRpc({ supabase })

  if (!result.ok) {
    logger.error("Error getting blocked users:", result.error)
    const message =
      typeof result.error === "object" && result.error !== null && "message" in result.error
        ? String((result.error as { message?: unknown }).message ?? "")
        : "Failed to load blocked users"
    return errorEnvelope({ data: null, error: message })
  }

  const parsedBlockedUsers = BlockedUsersSchema.safeParse(result.data ?? [])
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

  const result = await isBlockedBidirectionalRpc({
    supabase,
    userA: user.id,
    userB: parsedUserId.data,
  })

  if (!result.ok) {
    logger.error("Error checking block status:", result.error)
    return errorEnvelope({ blocked: false, error: "Failed to check block status" })
  }

  return successEnvelope({ blocked: result.blocked, error: null })
}
