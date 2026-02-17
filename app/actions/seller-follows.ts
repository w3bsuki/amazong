"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { revalidateTag } from "next/cache"

// =====================================================
// SELLER FOLLOWS SERVER ACTIONS
// Mutation actions only - page.tsx handles data fetching
// =====================================================

export async function isFollowingSeller(sellerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  const { data } = await supabase
    .from("store_followers")
    .select("id")
    .eq("follower_id", user.id)
    .eq("seller_id", sellerId)
    .maybeSingle()

  return !!data
}

export async function followSeller(sellerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

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

async function toggleFollowSeller(sellerId: string) {
  const isFollowing = await isFollowingSeller(sellerId)
  
  if (isFollowing) {
    const result = await unfollowSeller(sellerId)
    return { ...result, isFollowing: false }
  } else {
    const result = await followSeller(sellerId)
    return { ...result, isFollowing: true }
  }
}
