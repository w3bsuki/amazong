import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { createLoginLink, getConnectAccount, isAccountReady } from "@/lib/stripe-connect"
import { noStoreJson } from "@/lib/api/response-helpers"

/**
 * POST /api/connect/dashboard
 * 
 * Creates a login link for sellers to access their Stripe Express Dashboard.
 * Only works for accounts that have completed onboarding.
 */
export async function POST(req: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(req)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return noStoreJson({ error: "Unauthorized" }, { status: 401 })
    }

    // Get seller's Connect account ID
    const { data: payoutStatus, error: payoutError } = await supabase
      .from("seller_payout_status")
      .select("stripe_connect_account_id, charges_enabled")
      .eq("seller_id", user.id)
      .single()

    if (payoutError || !payoutStatus?.stripe_connect_account_id) {
      return noStoreJson(
        { error: "No Connect account found. Please complete onboarding first." },
        { status: 404 }
      )
    }

    // Check if account is ready
    const account = await getConnectAccount(payoutStatus.stripe_connect_account_id)
    
    if (!isAccountReady(account)) {
      return noStoreJson(
        { error: "Account onboarding not complete. Please finish setting up your account." },
        { status: 400 }
      )
    }

    // Create login link
    const loginLink = await createLoginLink(payoutStatus.stripe_connect_account_id)

    return noStoreJson({ url: loginLink.url })
  } catch (error) {
    console.error("Connect dashboard error:", error)
    return noStoreJson(
      { error: error instanceof Error ? error.message : "Failed to create dashboard link" },
      { status: 500 }
    )
  }
}
