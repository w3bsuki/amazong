"use server"

import { z } from "zod"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { revalidateTag } from "next/cache"

// =====================================================
// SELLER FOLLOWS SERVER ACTIONS
// Mutation actions only - page.tsx handles data fetching
// =====================================================

const SellerIdSchema = z.string().uuid()

type SellerFollowMutationResult = { success: true } | { success: false; error: string }
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
    return { ok: false, result: { success: false, error: "Invalid sellerId" } }
  }

  const auth = await requireAuth()
  if (!auth) {
    return { ok: false, result: { success: false, error: "Not authenticated" } }
  }

  return { ok: true, sellerId: parsedSellerId.data, userId: auth.user.id, supabase: auth.supabase }
}

async function revalidateSellerFollowTags(supabase: AuthedSupabaseClient, sellerId: string) {
  revalidateTag("follows", "max")
  await revalidatePublicProfileTagsForUser(supabase, sellerId, "max")
}

export async function isFollowingSeller(sellerId: string) {
  const parsedSellerId = SellerIdSchema.safeParse(sellerId)
  if (!parsedSellerId.success) return false

  const auth = await requireAuth()
  if (!auth) return false

  const { supabase, user } = auth

  const { data } = await supabase
    .from("store_followers")
    .select("id")
    .eq("follower_id", user.id)
    .eq("seller_id", parsedSellerId.data)
    .maybeSingle()

  return !!data
}

export async function followSeller(sellerId: string) {
  const ctx = await getSellerFollowMutationContext(sellerId)
  if (!ctx.ok) return ctx.result

  const { error } = await ctx.supabase
    .from("store_followers")
    .insert({ follower_id: ctx.userId, seller_id: ctx.sellerId })

  if (error) {
    if (error.code === "23505") return { success: true } // Already following
    return { success: false, error: error.message }
  }

  await revalidateSellerFollowTags(ctx.supabase, ctx.sellerId)
  return { success: true }
}

export async function unfollowSeller(sellerId: string) {
  const ctx = await getSellerFollowMutationContext(sellerId)
  if (!ctx.ok) return ctx.result

  const { error } = await ctx.supabase
    .from("store_followers")
    .delete()
    .eq("follower_id", ctx.userId)
    .eq("seller_id", ctx.sellerId)

  if (error) {
    return { success: false, error: error.message }
  }

  await revalidateSellerFollowTags(ctx.supabase, ctx.sellerId)
  return { success: true }
}
