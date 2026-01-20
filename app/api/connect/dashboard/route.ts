import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createLoginLink, getConnectAccount, isAccountReady } from "@/lib/stripe-connect"

/**
 * POST /api/connect/dashboard
 * 
 * Creates a login link for sellers to access their Stripe Express Dashboard.
 * Only works for accounts that have completed onboarding.
 */
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get seller's Connect account ID
    const { data: payoutStatus, error: payoutError } = await supabase
      .from("seller_payout_status")
      .select("stripe_connect_account_id, charges_enabled")
      .eq("seller_id", user.id)
      .single()

    if (payoutError || !payoutStatus?.stripe_connect_account_id) {
      return NextResponse.json(
        { error: "No Connect account found. Please complete onboarding first." },
        { status: 404 }
      )
    }

    // Check if account is ready
    const account = await getConnectAccount(payoutStatus.stripe_connect_account_id)
    
    if (!isAccountReady(account)) {
      return NextResponse.json(
        { error: "Account onboarding not complete. Please finish setting up your account." },
        { status: 400 }
      )
    }

    // Create login link
    const loginLink = await createLoginLink(payoutStatus.stripe_connect_account_id)

    return NextResponse.json({ url: loginLink.url })
  } catch (error) {
    console.error("Connect dashboard error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create dashboard link" },
      { status: 500 }
    )
  }
}
