import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"
import { normalizePlanTier } from "@/lib/subscriptions/normalize-tier"

import { logger } from "@/lib/logger"
type SellerAccountType = "personal" | "business"

type PlanLookupResult = {
  found: boolean
  maxListings: number | null
}

export type ListingLimitSnapshot = {
  accountType: SellerAccountType
  tier: string
  currentListings: number
  maxListings: number | null
  remainingListings: number
  isUnlimited: boolean
  canAddListing: boolean
  needsUpgrade: boolean
}

async function getPlanMaxListings(args: {
  supabase: SupabaseClient<Database>
  tier: string
  accountType: SellerAccountType
}): Promise<PlanLookupResult> {
  const { supabase, tier, accountType } = args
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("max_listings")
    .eq("tier", tier)
    .eq("account_type", accountType)
    .eq("is_active", true)
    .maybeSingle()
  if (error) {
    logger.error("[listing-limits] Failed to load plan listing limits", error, { tier, accountType })
    return { found: false, maxListings: null }
  }

  if (!data) {
    return { found: false, maxListings: null }
  }

  return { found: true, maxListings: data.max_listings ?? null }
}

/**
 * Resolve the seller's effective plan limits from profile + active subscription.
 */
export async function getSellerListingLimitSnapshot(
  supabase: SupabaseClient<Database>,
  sellerId: string
): Promise<ListingLimitSnapshot | null> {
  const [
    { data: profile, error: profileError },
    { count: currentListings, error: listingsError },
    { data: subscription, error: subscriptionError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("tier, account_type")
      .eq("id", sellerId)
      .maybeSingle(),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .eq("status", "active"),
    supabase
      .from("subscriptions")
      .select("plan_type")
      .eq("seller_id", sellerId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])
  if (profileError || listingsError || subscriptionError) {
    logger.error("[listing-limits] Failed to load seller listing snapshot", profileError ?? listingsError ?? subscriptionError, {
      sellerId,
    })
    return null
  }

  if (!profile) return null

  const accountType: SellerAccountType = profile.account_type === "business" ? "business" : "personal"
  const tier = normalizePlanTier(subscription?.plan_type ?? profile.tier)

  const activeTierPlan = await getPlanMaxListings({ supabase, tier, accountType })

  let resolvedMaxListings = activeTierPlan.maxListings
  if (!activeTierPlan.found) {
    const freePlan = await getPlanMaxListings({ supabase, tier: "free", accountType })
    resolvedMaxListings = freePlan.found
      ? freePlan.maxListings
      : accountType === "business"
        ? 100
        : 30
  }

  const currentListingCount = currentListings ?? 0
  const maxListings = typeof resolvedMaxListings === "number" ? resolvedMaxListings : null
  const isUnlimited = maxListings == null
  const remainingListings = isUnlimited
    ? Number.POSITIVE_INFINITY
    : Math.max(maxListings - currentListingCount, 0)

  return {
    accountType,
    tier,
    currentListings: currentListingCount,
    maxListings,
    remainingListings,
    isUnlimited,
    canAddListing: isUnlimited || remainingListings > 0,
    needsUpgrade: !isUnlimited && remainingListings <= 0,
  }
}
