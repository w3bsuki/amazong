import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"

/**
 * GET /api/seller/limits
 * Returns the current user's listing limits and subscription status
 */
export async function GET(request: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    const res = NextResponse.json({ skipped: true }, { status: 200 })
    res.headers.set('Cache-Control', 'private, no-store')
    res.headers.set('CDN-Cache-Control', 'private, no-store')
    res.headers.set('Vercel-CDN-Cache-Control', 'private, no-store')
    return res
  }
  try {
    const { supabase, applyCookies } = createRouteHandlerClient(request)
    const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
      applyCookies(NextResponse.json(body, init))

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get profile info
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, tier, account_type, username, display_name, business_name")
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

    // Get listing info using direct queries (no RPC needed)
    const [{ count: currentListings }, { data: subscription }] = await Promise.all([
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("seller_id", user.id)
        .eq("status", "active"),
      supabase
        .from("subscriptions")
        .select("plan_type, subscription_plans!inner(max_listings, tier)")
        .eq("seller_id", user.id)
        .eq("status", "active")
        .single(),
    ])

    const subPlan = subscription?.subscription_plans as unknown as { max_listings: number; tier: string } | null
    const maxListings = subPlan?.max_listings ?? 50
    const tier = subPlan?.tier ?? "free"
    const isUnlimited = maxListings === -1
    const remaining = isUnlimited ? 999 : Math.max(maxListings - (currentListings ?? 0), 0)

    return json({
      sellerId: seller.id,
      storeName: seller.store_name,
      tier,
      accountType: seller.account_type || "personal",
      currentListings: currentListings ?? 0,
      maxListings,
      remainingListings: remaining,
      isUnlimited,
      canAddListing: isUnlimited || remaining > 0,
      needsUpgrade: !isUnlimited && remaining <= 0,
    })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) {
      const res = NextResponse.json({ skipped: true }, { status: 200 })
      res.headers.set('Cache-Control', 'private, no-store')
      return res
    }
    console.error("Seller limits API error:", error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
