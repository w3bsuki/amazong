import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { getSellerListingLimitSnapshot } from "@/lib/subscriptions/listing-limits"
import { noStoreJson } from "@/lib/api/response-helpers"

/**
 * GET /api/seller/limits
 * Returns the current user's listing limits and subscription status
 */
export async function GET(request: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return noStoreJson({ skipped: true }, { status: 200 })
  }

  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
    applyCookies(noStoreJson(body, init))
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get profile info
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, display_name, business_name")
      .eq("id", user.id)
      .single()

    if (!profile || !profile.username) {
      return json({ error: "Not a seller" }, { status: 404 })
    }
    
    // Map profile fields to expected seller fields
    const seller = {
      ...profile,
      store_name: profile.display_name || profile.business_name || profile.username,
    }

    const listingLimits = await getSellerListingLimitSnapshot(supabase, user.id)
    if (!listingLimits) {
      return json({ error: "Unable to resolve listing limits" }, { status: 500 })
    }

    const remaining = listingLimits.isUnlimited ? 999 : listingLimits.remainingListings

    return json({
      sellerId: seller.id,
      storeName: seller.store_name,
      tier: listingLimits.tier,
      accountType: listingLimits.accountType,
      currentListings: listingLimits.currentListings,
      maxListings: listingLimits.maxListings,
      remainingListings: remaining,
      isUnlimited: listingLimits.isUnlimited,
      canAddListing: listingLimits.canAddListing,
      needsUpgrade: listingLimits.needsUpgrade,
    })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) {
      return json({ skipped: true }, { status: 200 })
    }
    console.error("Seller limits API error:", error)

    return json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
