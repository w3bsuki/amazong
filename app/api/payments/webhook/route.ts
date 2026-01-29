import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getStripeWebhookSecrets } from "@/lib/env"
import { logError } from "@/lib/structured-log"
import type Stripe from "stripe"

/**
 * Canonical ownership:
 * - Listing boosts (one-time Checkout sessions with `metadata.type=listing_boost`)
 * - Saved card setup (Checkout `mode=setup` + `checkout.session.completed`)
 *
 * Orders are handled by `app/api/checkout/webhook/route.ts`.
 * Subscriptions are handled by `app/api/subscriptions/webhook/route.ts`.
 */
export async function POST(request: Request) {
    // Create admin client inside handler (avoid module-level client in serverless)
    const supabase = createAdminClient()

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event | null = null

    try {
        const secrets = getStripeWebhookSecrets()
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
    } catch (error) {
        const message = error instanceof Error ? error.message : "Webhook verification failed"
        logError("stripe_webhook_signature_verification_failed", error, {
            route: "api/payments/webhook",
            message,
        })
        return NextResponse.json({ error: message }, { status: 400 })
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session

                // Handle listing boost payments (DEC-003)
                if (session.mode === "payment" && session.metadata?.type === "listing_boost") {
                    const productId = session.metadata.product_id
                    const sellerId = session.metadata.profile_id
                    const durationDays = Number.parseInt(session.metadata.duration_days || "7", 10)
                    const sessionId = session.id
                    const amountTotal = session.amount_total // in cents
                    const currency = session.currency?.toUpperCase() || "EUR"

                    if (!productId || !sellerId) {
                        logError("stripe_webhook_boost_missing_metadata", null, {
                            route: "api/payments/webhook",
                            sessionId,
                        })
                        break
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
                                route: "api/payments/webhook",
                                productId,
                                sellerId,
                            })
                            break
                        }

                        const { data: existingBoost, error: existingBoostError } = await supabase
                            .from("listing_boosts")
                            .select("expires_at")
                            .eq("stripe_checkout_session_id", sessionId)
                            .maybeSingle()

                        if (existingBoostError || !existingBoost?.expires_at) {
                            logError("stripe_webhook_boost_existing_fetch_failed", existingBoostError, {
                                route: "api/payments/webhook",
                                productId,
                                sellerId,
                                sessionId,
                            })
                            break
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
                            route: "api/payments/webhook",
                            productId,
                        })
                    }

                    break
                }

                // Handle setup mode sessions (saved payment methods)
                if (session.mode !== "setup") break

                const customerId =
                    typeof session.customer === "string"
                        ? session.customer
                        : session.customer?.id ?? null

                const setupIntentId =
                    typeof session.setup_intent === "string"
                        ? session.setup_intent
                        : session.setup_intent?.id ?? null

                const userId = session.metadata?.user_id

                if (!userId || !setupIntentId || !customerId) break

                // Get the SetupIntent to find the payment method
                const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)
                const paymentMethodId =
                    typeof setupIntent.payment_method === "string"
                        ? setupIntent.payment_method
                        : setupIntent.payment_method?.id ?? null

                if (!paymentMethodId) break

                // Get payment method details
                const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

                // Check if this payment method already exists
                const { data: existing } = await supabase
                    .from('user_payment_methods')
                    .select('id')
                    .eq('stripe_payment_method_id', paymentMethodId)
                    .maybeSingle()

                if (existing) break // Already saved

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
                        route: "api/payments/webhook",
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

                break
            }

            case "payment_method.detached": {
                const paymentMethod = event.data.object as Stripe.PaymentMethod
                
                // Remove from database if it exists
                await supabase
                    .from('user_payment_methods')
                    .delete()
                    .eq('stripe_payment_method_id', paymentMethod.id)

                break
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        logError("stripe_webhook_handler_error", error, {
            route: "api/payments/webhook",
            eventType: event.type,
        })
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        )
    }
}
