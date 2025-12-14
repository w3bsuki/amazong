import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/seller/limits
 * Returns the current user's listing limits and subscription status
 */
export async function GET() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get seller info
    const { data: seller } = await supabase
      .from("sellers")
      .select("id, tier, account_type, store_name")
      .eq("id", user.id)
      .single()

    if (!seller) {
      return NextResponse.json({ error: "Not a seller" }, { status: 404 })
    }

    // Get listing info using the helper function
    const { data: limitInfo, error: limitError } = await supabase.rpc(
      "get_seller_listing_info",
      { p_seller_id: user.id }
    )

    if (limitError) {
      console.error("Error fetching limit info:", limitError)
      // Fallback to manual count
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user.id)

      return NextResponse.json({
        sellerId: seller.id,
        storeName: seller.store_name,
        tier: seller.tier || "free",
        accountType: seller.account_type || "personal",
        currentListings: count || 0,
        maxListings: 50, // Default free tier
        remainingListings: Math.max(50 - (count || 0), 0),
        isUnlimited: false,
        canAddListing: (count || 0) < 50,
        needsUpgrade: (count || 0) >= 50,
      })
    }

    const info = limitInfo?.[0] || {
      current_count: 0,
      max_allowed: 50,
      remaining: 50,
      is_unlimited: false,
    }

    return NextResponse.json({
      sellerId: seller.id,
      storeName: seller.store_name,
      tier: seller.tier || "free",
      accountType: seller.account_type || "personal",
      currentListings: info.current_count,
      maxListings: info.max_allowed,
      remainingListings: info.remaining,
      isUnlimited: info.is_unlimited,
      canAddListing: info.is_unlimited || info.remaining > 0,
      needsUpgrade: !info.is_unlimited && info.remaining <= 0,
    })
  } catch (error) {
    console.error("Seller limits API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
