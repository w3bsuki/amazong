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
  const parsedSellerId = SellerIdSchema.safeParse(sellerId)
  if (!parsedSellerId.success) return { success: false, error: "Invalid sellerId" }

  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }

  const { supabase, user } = auth

  const { error } = await supabase
    .from("store_followers")
    .insert({ follower_id: user.id, seller_id: parsedSellerId.data })

  if (error) {
    if (error.code === "23505") return { success: true } // Already following
    return { success: false, error: error.message }
  }

  revalidateTag("follows", "max")
  await revalidatePublicProfileTagsForUser(supabase, parsedSellerId.data, "max")
  return { success: true }
}

export async function unfollowSeller(sellerId: string) {
  const parsedSellerId = SellerIdSchema.safeParse(sellerId)
  if (!parsedSellerId.success) return { success: false, error: "Invalid sellerId" }

  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }

  const { supabase, user } = auth

  const { error } = await supabase
    .from("store_followers")
    .delete()
    .eq("follower_id", user.id)
    .eq("seller_id", parsedSellerId.data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidateTag("follows", "max")
  await revalidatePublicProfileTagsForUser(supabase, parsedSellerId.data, "max")
  return { success: true }
}
