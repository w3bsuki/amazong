import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export async function fetchStoreFollow(params: {
  supabase: DbClient
  followerId: string
  sellerId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, followerId, sellerId } = params

  const { data, error } = await supabase
    .from("store_followers")
    .select("id")
    .eq("follower_id", followerId)
    .eq("seller_id", sellerId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data) }
}

export async function insertStoreFollow(params: {
  supabase: DbClient
  followerId: string
  sellerId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, followerId, sellerId } = params

  const { error } = await supabase.from("store_followers").insert({ follower_id: followerId, seller_id: sellerId })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function deleteStoreFollow(params: {
  supabase: DbClient
  followerId: string
  sellerId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, followerId, sellerId } = params

  const { error } = await supabase
    .from("store_followers")
    .delete()
    .eq("follower_id", followerId)
    .eq("seller_id", sellerId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

