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

    // Get profile info
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, tier, account_type, username, display_name, business_name")
      .eq("id", user.id)
      .single()

    if (!profile || !profile.username) {
      return NextResponse.json({ error: "Not a seller" }, { status: 404 })
    }
    
    // Map profile fields to expected seller fields
    const seller = {
      ...profile,
      store_name: profile.display_name || profile.business_name || profile.username,
    }

    // Get listing info using the helper function
    const { data: limitInfo, error: limitError } = await supabase.rpc(
      "get_seller_listing_info",
      { seller_uuid: user.id }
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

    // DB returns: { current_listings, max_listings, tier }
    const info = limitInfo?.[0] || {
      current_listings: 0,
      max_listings: 50,
      tier: 'free',
    }
    const isUnlimited = info.max_listings === -1
    const remaining = isUnlimited ? 999 : Math.max(info.max_listings - info.current_listings, 0)

    return NextResponse.json({
      sellerId: seller.id,
      storeName: seller.store_name,
      tier: info.tier || "free",
      accountType: seller.account_type || "personal",
      currentListings: info.current_listings,
      maxListings: info.max_listings,
      remainingListings: remaining,
      isUnlimited,
      canAddListing: isUnlimited || remaining > 0,
      needsUpgrade: !isUnlimited && remaining <= 0,
    })
  } catch (error) {
    console.error("Seller limits API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
