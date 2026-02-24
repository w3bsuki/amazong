import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { getStripeConnectWebhookSecrets } from "@/lib/env"
import { logError, logEvent } from "@/lib/logger"
import type Stripe from "stripe"

const WEBHOOK_ROUTE = "api/connect/webhook"

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
    logError("stripe_connect_webhook_missing_signature", null, {
      route: WEBHOOK_ROUTE,
    })
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event | undefined

  try {
    const secrets = getStripeConnectWebhookSecrets()
    let lastError: unknown

    for (const secret of secrets) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, secret)
        lastError = undefined
        break
      } catch (err) {
        lastError = err
      }
    }

    if (!event) {
      throw lastError ?? new Error("Unknown error")
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    logError("stripe_connect_webhook_signature_verification_failed", err, {
      route: WEBHOOK_ROUTE,
      message: errorMessage,
    })
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
      logEvent("warn", "stripe_connect_webhook_missing_seller_metadata", {
        route: WEBHOOK_ROUTE,
      })
      // Try to find by account ID
      const { data: existingStatus } = await supabase
        .from("seller_payout_status")
        .select("seller_id")
        .eq("stripe_connect_account_id", account.id)
        .single()

      if (!existingStatus) {
        logError("stripe_connect_webhook_seller_not_found_for_account", null, {
          route: WEBHOOK_ROUTE,
        })
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
      logError("stripe_connect_webhook_update_seller_payout_status_failed", updateError, {
        route: WEBHOOK_ROUTE,
      })
    }
  }

  // Handle account.application.deauthorized - seller disconnected the platform
  if (event.type === "account.application.deauthorized") {
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
        logError("stripe_connect_webhook_handle_deauthorization_failed", updateError, {
          route: WEBHOOK_ROUTE,
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
