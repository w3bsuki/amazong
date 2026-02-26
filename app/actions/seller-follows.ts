"use server"

import { z } from "zod"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { deleteStoreFollow, fetchStoreFollow, insertStoreFollow } from "@/lib/data/seller-follows"
import { revalidateTag } from "next/cache"

// =====================================================
// SELLER FOLLOWS SERVER ACTIONS
// Mutation actions only - page.tsx handles data fetching
// =====================================================

const SellerIdSchema = z.string().uuid()

type SellerFollowMutationResult = Envelope<Record<string, never>, { error: string }>
type IsFollowingSellerResult = Envelope<{ following: boolean }, { error: string }>
type RequireAuthResult = Awaited<ReturnType<typeof requireAuth>>
type AuthedSupabaseClient = NonNullable<RequireAuthResult>["supabase"]

async function getSellerFollowMutationContext(
  sellerId: string,
): Promise<
  | { ok: true; sellerId: string; userId: string; supabase: AuthedSupabaseClient }
  | { ok: false; result: SellerFollowMutationResult }
> {
  const parsedSellerId = SellerIdSchema.safeParse(sellerId)
  if (!parsedSellerId.success) {
    return { ok: false, result: errorEnvelope({ error: "Invalid sellerId" }) }
  }

  const auth = await requireAuth()
  if (!auth) {
    return { ok: false, result: errorEnvelope({ error: "Not authenticated" }) }
  }

  return { ok: true, sellerId: parsedSellerId.data, userId: auth.user.id, supabase: auth.supabase }
}

async function revalidateSellerFollowTags(supabase: AuthedSupabaseClient, sellerId: string) {
  revalidateTag("follows", "max")
  await revalidatePublicProfileTagsForUser(supabase, sellerId, "max")
}

export async function isFollowingSeller(sellerId: string): Promise<IsFollowingSellerResult> {
  const parsedSellerId = SellerIdSchema.safeParse(sellerId)
  if (!parsedSellerId.success) return errorEnvelope({ error: "Invalid sellerId" })

  const auth = await requireAuth()
  if (!auth) return errorEnvelope({ error: "Not authenticated" })

  const { supabase, user } = auth

  const result = await fetchStoreFollow({
    supabase,
    followerId: user.id,
    sellerId: parsedSellerId.data,
  })

  if (!result.ok) {
    const message =
      typeof result.error === "object" && result.error !== null && "message" in result.error
        ? String((result.error as { message?: unknown }).message ?? "")
        : "Failed to check follow status"

    return errorEnvelope({ error: message })
  }

  return successEnvelope({ following: result.exists })
}

export async function followSeller(sellerId: string): Promise<SellerFollowMutationResult> {
  const ctx = await getSellerFollowMutationContext(sellerId)
  if (!ctx.ok) return ctx.result

  const result = await insertStoreFollow({
    supabase: ctx.supabase,
    followerId: ctx.userId,
    sellerId: ctx.sellerId,
  })

  if (!result.ok) {
    const code =
      typeof result.error === "object" && result.error !== null && "code" in result.error
        ? String((result.error as { code?: unknown }).code ?? "")
        : ""

    if (code === "23505") return successEnvelope<Record<string, never>>() // Already following

    const message =
      typeof result.error === "object" && result.error !== null && "message" in result.error
        ? String((result.error as { message?: unknown }).message ?? "")
        : "Failed to follow seller"

    return errorEnvelope({ error: message })
  }

  await revalidateSellerFollowTags(ctx.supabase, ctx.sellerId)
  return successEnvelope<Record<string, never>>()
}

export async function unfollowSeller(sellerId: string): Promise<SellerFollowMutationResult> {
  const ctx = await getSellerFollowMutationContext(sellerId)
  if (!ctx.ok) return ctx.result

  const result = await deleteStoreFollow({
    supabase: ctx.supabase,
    followerId: ctx.userId,
    sellerId: ctx.sellerId,
  })

  if (!result.ok) {
    const message =
      typeof result.error === "object" && result.error !== null && "message" in result.error
        ? String((result.error as { message?: unknown }).message ?? "")
        : "Failed to unfollow seller"

    return errorEnvelope({ error: message })
  }

  await revalidateSellerFollowTags(ctx.supabase, ctx.sellerId)
  return successEnvelope<Record<string, never>>()
}
