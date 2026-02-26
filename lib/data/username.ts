import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { createStaticClient } from "@/lib/supabase/server"

type DbClient = SupabaseClient<Database>

export async function isUsernameTaken(username: string): Promise<boolean> {
  const supabase = createStaticClient()

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle()

  return Boolean(data)
}

export async function getUserUsernameAndLastChange(params: {
  supabase: DbClient
  userId: string
}): Promise<{ username: string | null; lastUsernameChange: string | null } | null> {
  const { supabase, userId } = params

  const { data } = await supabase
    .from("profiles")
    .select("username, last_username_change")
    .eq("id", userId)
    .single()

  if (!data) return null

  return {
    username: data.username ?? null,
    lastUsernameChange: data.last_username_change ?? null,
  }
}

export type SetUsernameOutcome =
  | { ok: true; previousUsername: string | null }
  | { ok: false; reason: "USERNAME_COOLDOWN_ACTIVE"; daysRemaining: number }
  | { ok: false; reason: "USERNAME_TAKEN" }
  | { ok: false; reason: "USERNAME_UPDATE_FAILED"; error: unknown }

export async function setUsernameForUser(params: {
  supabase: DbClient
  userId: string
  username: string
}): Promise<SetUsernameOutcome> {
  const { supabase, userId, username } = params

  const profile = await getUserUsernameAndLastChange({ supabase, userId })
  const previousUsername = profile?.username ?? null
  const hadUsername = Boolean(previousUsername)

  if (hadUsername && profile?.lastUsernameChange) {
    const lastChange = new Date(profile.lastUsernameChange)
    const cooldownEnd = new Date(lastChange.getTime() + 14 * 24 * 60 * 60 * 1000)

    if (new Date() < cooldownEnd) {
      const daysRemaining = Math.ceil((cooldownEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      return { ok: false, reason: "USERNAME_COOLDOWN_ACTIVE", daysRemaining }
    }
  }

  if (hadUsername && previousUsername) {
    await supabase.from("username_history").insert({
      user_id: userId,
      old_username: previousUsername,
      new_username: username,
    })
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .neq("id", userId)
    .maybeSingle()

  if (existing) {
    return { ok: false, reason: "USERNAME_TAKEN" }
  }

  const now = new Date().toISOString()
  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      last_username_change: hadUsername ? now : null,
      updated_at: now,
    })
    .eq("id", userId)

  if (error) {
    return { ok: false, reason: "USERNAME_UPDATE_FAILED", error }
  }

  return { ok: true, previousUsername }
}

export async function upgradeUserToBusinessAccount(params: {
  userId: string
  businessName: string
  websiteUrl: string | null
  vatNumber: string | null
  updatedAt: string
  supabase: DbClient
  adminSupabase: DbClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { userId, businessName, websiteUrl, vatNumber, updatedAt, supabase, adminSupabase } = params

  const [{ error: updateError }, { error: privateError }] = await Promise.all([
    adminSupabase
      .from("profiles")
      .update({
        account_type: "business",
        business_name: businessName,
        website_url: websiteUrl,
        updated_at: updatedAt,
      })
      .eq("id", userId),
    supabase
      .from("private_profiles")
      .upsert({ id: userId, vat_number: vatNumber, updated_at: updatedAt }, { onConflict: "id" }),
  ])

  if (updateError || privateError) {
    return { ok: false, error: updateError ?? privateError }
  }

  await supabase.from("business_verification").upsert(
    {
      seller_id: userId,
      legal_name: businessName,
      vat_number: vatNumber,
      verification_level: 0,
    },
    { onConflict: "seller_id" }
  )

  return { ok: true }
}

export type DowngradeAccountOutcome =
  | { ok: true }
  | { ok: false; reason: "ACTIVE_BUSINESS_SUBSCRIPTION" }
  | { ok: false; reason: "ACCOUNT_DOWNGRADE_FAILED"; error: unknown }

export async function downgradeUserToPersonalAccount(params: {
  userId: string
  updatedAt: string
  supabase: DbClient
  adminSupabase: DbClient
}): Promise<DowngradeAccountOutcome> {
  const { userId, updatedAt, supabase, adminSupabase } = params

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, status, plan_type")
    .eq("seller_id", userId)
    .eq("status", "active")
    .single()

  if (subscription && subscription.plan_type !== "free") {
    return { ok: false, reason: "ACTIVE_BUSINESS_SUBSCRIPTION" }
  }

  const { error } = await adminSupabase
    .from("profiles")
    .update({
      account_type: "personal",
      is_verified_business: false,
      tier: "free",
      updated_at: updatedAt,
    })
    .eq("id", userId)

  if (error) {
    return { ok: false, reason: "ACCOUNT_DOWNGRADE_FAILED", error }
  }

  return { ok: true }
}

