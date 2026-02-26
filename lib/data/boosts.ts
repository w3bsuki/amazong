import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export type OwnedBoostProduct = {
  id: string
  seller_id: string
  is_boosted: boolean | null
  boost_expires_at: string | null
  title: string | null
}

export type ProfileBoostData = {
  boosts_remaining: number
  boosts_allocated: number
  boosts_reset_at: string | null
  account_type: Database["public"]["Tables"]["profiles"]["Row"]["account_type"]
  tier: Database["public"]["Tables"]["profiles"]["Row"]["tier"]
}

export async function fetchOwnedBoostProduct(params: {
  supabase: DbClient
  productId: string
}): Promise<{ ok: true; product: OwnedBoostProduct | null } | { ok: false; error: unknown }> {
  const { supabase, productId } = params

  const { data, error } = await supabase
    .from("products")
    .select("id, seller_id, is_boosted, boost_expires_at, title")
    .eq("id", productId)
    .maybeSingle<OwnedBoostProduct>()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, product: data ?? null }
}

export async function fetchBoostPrice(params: {
  supabase: DbClient
  durationDays: 7 | 14 | 30
}): Promise<{ ok: true; price: number | null } | { ok: false; error: unknown }> {
  const { supabase, durationDays } = params

  const { data, error } = await supabase
    .from("boost_prices")
    .select("price")
    .eq("duration_days", durationDays)
    .eq("is_active", true)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, price: data?.price == null ? null : Number(data.price) }
}

export async function fetchProfileBoostData(params: {
  supabase: DbClient
  userId: string
}): Promise<{ ok: true; profile: ProfileBoostData | null } | { ok: false; error: unknown }> {
  const { supabase, userId } = params

  const { data, error } = await supabase
    .from("profiles")
    .select("boosts_remaining, boosts_allocated, boosts_reset_at, account_type, tier")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  if (!data) {
    return { ok: true, profile: null }
  }

  return {
    ok: true,
    profile: {
      boosts_remaining: data.boosts_remaining ?? 0,
      boosts_allocated: data.boosts_allocated ?? 0,
      boosts_reset_at: data.boosts_reset_at ?? null,
      account_type: data.account_type ?? null,
      tier: data.tier ?? null,
    },
  }
}

export async function fetchLatestActiveSubscriptionPlanType(params: {
  supabase: DbClient
  sellerId: string
}): Promise<{ ok: true; planType: string | null } | { ok: false; error: unknown }> {
  const { supabase, sellerId } = params

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan_type")
    .eq("seller_id", sellerId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, planType: typeof data?.plan_type === "string" ? data.plan_type : null }
}

export async function fetchBoostsIncludedForTier(params: {
  supabase: DbClient
  tier: string
  accountType: Database["public"]["Tables"]["profiles"]["Row"]["account_type"]
}): Promise<{ ok: true; boostsIncluded: number | null } | { ok: false; error: unknown }> {
  const { supabase, tier, accountType } = params

  const { data, error } = await supabase
    .from("subscription_plans")
    .select("boosts_included")
    .eq("tier", tier)
    .eq("account_type", accountType)
    .eq("is_active", true)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, boostsIncluded: data?.boosts_included == null ? null : Number(data.boosts_included) }
}

export async function updateProfileBoostCredits(params: {
  adminSupabase: DbClient
  userId: string
  boostsAllocated: number
  boostsRemaining: number
  boostsResetAt: string | null
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { adminSupabase, userId, boostsAllocated, boostsRemaining, boostsResetAt } = params

  const profileUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
    boosts_allocated: boostsAllocated,
    boosts_remaining: boostsRemaining,
    boosts_reset_at: boostsResetAt,
  }

  const { error } = await adminSupabase.from("profiles").update(profileUpdate).eq("id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function updateProfileBoostRemaining(params: {
  adminSupabase: DbClient
  userId: string
  boostsRemaining: number
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { adminSupabase, userId, boostsRemaining } = params

  const deductUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
    boosts_remaining: boostsRemaining,
  }

  const { error } = await adminSupabase.from("profiles").update(deductUpdate).eq("id", userId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function updateProductBoostStatus(params: {
  adminSupabase: DbClient
  productId: string
  isBoosted: boolean
  boostExpiresAt: string | null
  listingType: string | null
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { adminSupabase, productId, isBoosted, boostExpiresAt, listingType } = params

  const { error } = await adminSupabase
    .from("products")
    .update({
      is_boosted: isBoosted,
      boost_expires_at: boostExpiresAt,
      listing_type: listingType,
    })
    .eq("id", productId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function insertListingBoost(params: {
  adminSupabase: DbClient
  productId: string
  sellerId: string
  pricePaid: number
  durationDays: number
  expiresAt: string
  currency: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { adminSupabase, productId, sellerId, pricePaid, durationDays, expiresAt, currency } = params

  const { error } = await adminSupabase.from("listing_boosts").insert({
    product_id: productId,
    seller_id: sellerId,
    price_paid: pricePaid,
    duration_days: durationDays,
    expires_at: expiresAt,
    is_active: true,
    currency,
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function fetchProfileUsername(params: {
  supabase: DbClient
  userId: string
}): Promise<{ ok: true; username: string | null } | { ok: false; error: unknown }> {
  const { supabase, userId } = params

  const { data, error } = await supabase.from("profiles").select("username").eq("id", userId).maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, username: typeof data?.username === "string" ? data.username : null }
}
