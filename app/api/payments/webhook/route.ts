import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getStripeWebhookSecrets } from "@/lib/env"
import { logError } from "@/lib/logger"
import type Stripe from "stripe"

const PAYMENTS_WEBHOOK_ROUTE = "api/payments/webhook"

/**
 * Canonical ownership:
 * - Listing boosts (one-time Checkout sessions with `metadata.type=listing_boost`)
 * - Saved card setup (Checkout `mode=setup` + `checkout.session.completed`)
 *
 * Orders are handled by `app/api/checkout/webhook/route.ts`.
 * Subscriptions are handled by `app/api/subscriptions/webhook/route.ts`.
 */

function verifyPaymentsWebhookEvent(body: string, signature: string): Stripe.Event {
  const secrets = getStripeWebhookSecrets()
  let event: Stripe.Event | null = null
  let lastError: unknown

  for (const secret of secrets) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, secret)
      lastError = undefined
      break
    } catch (err) {
      lastError = err
    }
  }

  if (!event) {
    throw lastError ?? new Error("Webhook verification failed")
  }

  return event
}

async function handleListingBoostCheckout(params: {
  event: Stripe.Event
  session: Stripe.Checkout.Session
  supabase: ReturnType<typeof createAdminClient>
}): Promise<void> {
  const { event, session, supabase } = params
  if (!(session.mode === "payment" && session.metadata?.type === "listing_boost")) {
    return
  }

  const productId = session.metadata.product_id
  const sellerId = session.metadata.profile_id
  const durationDays = Number.parseInt(session.metadata.duration_days || "7", 10)
  const sessionId = session.id
  const amountTotal = session.amount_total // in cents
  const currency = session.currency?.toUpperCase() || "EUR"

  if (!productId || !sellerId) {
    logError("stripe_webhook_boost_missing_metadata", null, {
      route: PAYMENTS_WEBHOOK_ROUTE,
      sessionId,
    })
    return
  }

  // Idempotency key: `stripe_checkout_session_id` (unique index in DB).
  // Use Stripe event timestamp so retries cannot extend boost duration.
  const eventCreatedSeconds = event.created
  const startsAt = typeof eventCreatedSeconds === "number"
    ? new Date(eventCreatedSeconds * 1000)
    : new Date()

  const computedExpiresAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000)
  let expiresAtIso = computedExpiresAt.toISOString()

  const { error: boostInsertError } = await supabase
    .from('listing_boosts')
    .insert({
      product_id: productId,
      seller_id: sellerId,
      price_paid: amountTotal ? amountTotal / 100 : 0,
      currency,
      duration_days: durationDays,
      starts_at: startsAt.toISOString(),
      expires_at: expiresAtIso,
      is_active: true,
      stripe_checkout_session_id: sessionId,
    })

  if (boostInsertError) {
    // If this is a retry, the row may already exist; fetch it so we can still
    // enforce product flags without extending the boost.
    const isDuplicate = boostInsertError.code === "23505"
    if (!isDuplicate) {
      logError("stripe_webhook_boost_insert_failed", boostInsertError, {
        route: PAYMENTS_WEBHOOK_ROUTE,
        productId,
        sellerId,
      })
      return
    }

    const { data: existingBoost, error: existingBoostError } = await supabase
      .from("listing_boosts")
      .select("expires_at")
      .eq("stripe_checkout_session_id", sessionId)
      .maybeSingle()

    if (existingBoostError || !existingBoost?.expires_at) {
      logError("stripe_webhook_boost_existing_fetch_failed", existingBoostError, {
        route: PAYMENTS_WEBHOOK_ROUTE,
        productId,
        sellerId,
        sessionId,
      })
      return
    }

    expiresAtIso = existingBoost.expires_at
  }

  // Update product: set is_boosted=true and boost_expires_at
  const { error: productUpdateError } = await supabase
    .from("products")
    .update({
      is_boosted: true,
      boost_expires_at: expiresAtIso,
      listing_type: "boosted",
    })
    .eq("id", productId)
    .eq("seller_id", sellerId)

  if (productUpdateError) {
    logError("stripe_webhook_product_boost_update_failed", productUpdateError, {
      route: PAYMENTS_WEBHOOK_ROUTE,
      productId,
    })
  }
}

async function handleSetupCheckout(params: {
  session: Stripe.Checkout.Session
  supabase: ReturnType<typeof createAdminClient>
}): Promise<void> {
  const { session, supabase } = params
  if (session.mode !== "setup") return

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null

  const setupIntentId =
    typeof session.setup_intent === "string"
      ? session.setup_intent
      : session.setup_intent?.id ?? null

  const userId = session.metadata?.user_id

  if (!userId || !setupIntentId || !customerId) return

  // Get the SetupIntent to find the payment method
  const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)
  const paymentMethodId =
    typeof setupIntent.payment_method === "string"
      ? setupIntent.payment_method
      : setupIntent.payment_method?.id ?? null

  if (!paymentMethodId) return

  // Get payment method details
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

  // Check if this payment method already exists
  const { data: existing } = await supabase
    .from('user_payment_methods')
    .select('id')
    .eq('stripe_payment_method_id', paymentMethodId)
    .maybeSingle()

  if (existing) return // Already saved

  // Check if user has any existing payment methods
  const { data: existingMethods } = await supabase
    .from('user_payment_methods')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  const isFirst = !existingMethods || existingMethods.length === 0

  // Save payment method to database
  const { error: insertError } = await supabase
    .from('user_payment_methods')
    .insert({
      user_id: userId,
      stripe_payment_method_id: paymentMethodId,
      stripe_customer_id: customerId,
      card_brand: paymentMethod.card?.brand || null,
      card_last4: paymentMethod.card?.last4 || null,
      card_exp_month: paymentMethod.card?.exp_month || null,
      card_exp_year: paymentMethod.card?.exp_year || null,
      is_default: isFirst // First card is default
    })

  if (insertError) {
    logError("stripe_webhook_save_payment_method_failed", insertError, {
      route: PAYMENTS_WEBHOOK_ROUTE,
      userId,
    })
  }

  // If first card, set as default in Stripe too
  if (isFirst) {
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    })
  }
}

async function handleCheckoutSessionCompleted(params: {
  event: Stripe.Event
  supabase: ReturnType<typeof createAdminClient>
}): Promise<void> {
  const { event, supabase } = params
  const session = event.data.object as Stripe.Checkout.Session

  await handleListingBoostCheckout({ event, session, supabase })
  await handleSetupCheckout({ session, supabase })
}

async function handlePaymentMethodDetached(params: {
  event: Stripe.Event
  supabase: ReturnType<typeof createAdminClient>
}): Promise<void> {
  const { event, supabase } = params
  const paymentMethod = event.data.object as Stripe.PaymentMethod

  // Remove from database if it exists
  await supabase
    .from('user_payment_methods')
    .delete()
    .eq('stripe_payment_method_id', paymentMethod.id)
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = verifyPaymentsWebhookEvent(body, signature)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook verification failed"
    logError("stripe_webhook_signature_verification_failed", error, {
      route: PAYMENTS_WEBHOOK_ROUTE,
      message,
    })
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // Only create the service-role client after the request is verified.
  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutSessionCompleted({ event, supabase })
        break
      }
      case "payment_method.detached": {
        await handlePaymentMethodDetached({ event, supabase })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logError("stripe_webhook_handler_error", error, {
      route: PAYMENTS_WEBHOOK_ROUTE,
      eventType: event.type,
    })
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
