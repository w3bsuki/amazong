import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export async function blockUserRpc(params: {
  supabase: DbClient
  userToBlock: string
  reason?: string
}): Promise<{ ok: true; success: boolean } | { ok: false; error: unknown }> {
  const { supabase, userToBlock, reason } = params

  const { data, error } = await supabase.rpc("block_user", {
    p_user_to_block: userToBlock,
    ...(reason ? { p_reason: reason } : {}),
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, success: data === true }
}

export async function unblockUserRpc(params: {
  supabase: DbClient
  userToUnblock: string
}): Promise<{ ok: true; success: boolean } | { ok: false; error: unknown }> {
  const { supabase, userToUnblock } = params

  const { data, error } = await supabase.rpc("unblock_user", {
    p_user_to_unblock: userToUnblock,
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, success: data === true }
}

export async function getBlockedUsersRpc(params: {
  supabase: DbClient
}): Promise<{ ok: true; data: unknown } | { ok: false; error: unknown }> {
  const { supabase } = params

  const { data, error } = await supabase.rpc("get_blocked_users")
  if (error) {
    return { ok: false, error }
  }

  return { ok: true, data }
}

export async function isBlockedBidirectionalRpc(params: {
  supabase: DbClient
  userA: string
  userB: string
}): Promise<{ ok: true; blocked: boolean } | { ok: false; error: unknown }> {
  const { supabase, userA, userB } = params

  const { data, error } = await supabase.rpc("is_blocked_bidirectional", {
    p_user_a: userA,
    p_user_b: userB,
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, blocked: data === true }
}

