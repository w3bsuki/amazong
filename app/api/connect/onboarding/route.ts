import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, createRouteHandlerClient } from "@/lib/supabase/server"
import { createConnectAccount, createAccountLink } from "@/lib/stripe-connect"
import { buildLocaleUrlFromRequest, inferLocaleFromRequest } from "@/lib/stripe-locale"

/**
 * POST /api/connect/onboarding
 * 
 * Creates a Stripe Express account for a seller and returns the onboarding URL.
 * If the seller already has an account, refreshes the onboarding link.
 */
export async function POST(req: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(req)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get seller profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, role, account_type")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (profile.role !== "seller" && profile.role !== "admin") {
      return NextResponse.json({ error: "Only sellers can onboard" }, { status: 403 })
    }

    const adminSupabase = createAdminClient()

    // Check if seller already has a payout status record
    const { data: payoutStatus } = await adminSupabase
      .from("seller_payout_status")
      .select("stripe_connect_account_id")
      .eq("seller_id", user.id)
      .maybeSingle()

    const locale = inferLocaleFromRequest(req)
    const refreshUrl = buildLocaleUrlFromRequest(req, "seller/settings/payouts", locale, "refresh=true")
    const returnUrl = buildLocaleUrlFromRequest(req, "seller/settings/payouts", locale, "onboarding=complete")
    let accountId = payoutStatus?.stripe_connect_account_id

    // Create new account if none exists
    if (!accountId) {
      const account = await createConnectAccount({
        email: profile.email || user.email || "",
        sellerId: user.id,
        accountType: profile.account_type === "business" ? "business" : "personal",
      })
      accountId = account.id

      // Store the account ID
      await adminSupabase
        .from("seller_payout_status")
        .upsert({
          seller_id: user.id,
          stripe_connect_account_id: accountId,
          details_submitted: false,
          charges_enabled: false,
          payouts_enabled: false,
        })
    }

    // Create onboarding link
    const accountLink = await createAccountLink({
      accountId,
      refreshUrl,
      returnUrl,
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error("Connect onboarding error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create onboarding link" },
      { status: 500 }
    )
  }
}
