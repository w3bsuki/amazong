"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { revalidateTag } from "next/cache"

// =====================================================
// SELLER FOLLOWS SERVER ACTIONS
// Mutation actions only - page.tsx handles data fetching
// =====================================================

export async function isFollowingSeller(sellerId: string) {
  const auth = await requireAuth()
  if (!auth) return false

  const { supabase, user } = auth

  const { data } = await supabase
    .from("store_followers")
    .select("id")
    .eq("follower_id", user.id)
    .eq("seller_id", sellerId)
    .maybeSingle()

  return !!data
}

export async function followSeller(sellerId: string) {
  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }

  const { supabase, user } = auth

  const { error } = await supabase
    .from("store_followers")
    .insert({ follower_id: user.id, seller_id: sellerId })

  if (error) {
    if (error.code === "23505") return { success: true } // Already following
    return { success: false, error: error.message }
  }

  revalidateTag("follows", "max")
  await revalidatePublicProfileTagsForUser(supabase, sellerId, "max")
  return { success: true }
}

export async function unfollowSeller(sellerId: string) {
  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }

  const { supabase, user } = auth

  const { error } = await supabase
    .from("store_followers")
    .delete()
    .eq("follower_id", user.id)
    .eq("seller_id", sellerId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidateTag("follows", "max")
  await revalidatePublicProfileTagsForUser(supabase, sellerId, "max")
  return { success: true }
}
