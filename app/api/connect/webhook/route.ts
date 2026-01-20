import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { getStripeConnectWebhookSecret } from "@/lib/env"
import type Stripe from "stripe"

/**
 * POST /api/connect/webhook
 * 
 * Handles Stripe Connect webhook events.
 * Updates seller_payout_status when account status changes.
 * 
 * IMPORTANT: This endpoint requires a separate webhook in Stripe Dashboard
 * configured for Connect events (account.updated, etc.)
 *
 * Canonical ownership:
 * - Connect account events: this route (separate webhook secret)
 */
export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    console.error("Missing Stripe signature for Connect webhook")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const secret = getStripeConnectWebhookSecret()
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    console.error("Connect webhook signature verification failed:", errorMessage)
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Handle account.updated events
  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account

    // Get seller_id from account metadata
    const sellerId = account.metadata?.seller_id
    if (!sellerId) {
      console.warn("No seller_id in account metadata:", account.id)
      // Try to find by account ID
      const { data: existingStatus } = await supabase
        .from("seller_payout_status")
        .select("seller_id")
        .eq("stripe_connect_account_id", account.id)
        .single()

      if (!existingStatus) {
        console.error("Could not find seller for account:", account.id)
        return NextResponse.json({ received: true })
      }
    }

    // Update seller payout status
    const { error: updateError } = await supabase
      .from("seller_payout_status")
      .update({
        details_submitted: account.details_submitted ?? false,
        charges_enabled: account.charges_enabled ?? false,
        payouts_enabled: account.payouts_enabled ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_connect_account_id", account.id)

    if (updateError) {
      console.error("Error updating seller payout status:", updateError)
    } else {
      console.log("Updated payout status for account:", account.id, {
        details_submitted: account.details_submitted,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      })
    }
  }

  // Handle account.application.deauthorized - seller disconnected the platform
  if (event.type === "account.application.deauthorized") {
    const application = event.data.object as Stripe.Application
    const accountId = event.account // The connected account ID is in the event

    if (accountId) {
      // Mark account as disconnected
      const { error: updateError } = await supabase
        .from("seller_payout_status")
        .update({
          charges_enabled: false,
          payouts_enabled: false,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_connect_account_id", accountId)

      if (updateError) {
        console.error("Error handling deauthorization:", updateError)
      }
    }
  }

  return NextResponse.json({ received: true })
}
