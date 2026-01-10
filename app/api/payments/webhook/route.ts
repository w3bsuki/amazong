import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getStripeWebhookSecrets } from "@/lib/env"
import { logError } from "@/lib/structured-log"

export async function POST(request: Request) {
    // Create admin client inside handler (avoid module-level client in serverless)
    const supabase = createAdminClient()

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: unknown

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
        switch ((event as any).type) {
            case 'checkout.session.completed': {
            const session = (event as any).data.object

                // Only handle setup mode sessions
                if (session.mode !== 'setup') break

                const customerId = session.customer as string
                const setupIntentId = session.setup_intent as string
                const userId = session.metadata?.user_id

                if (!userId || !setupIntentId) break

                // Get the SetupIntent to find the payment method
                const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)
                const paymentMethodId = setupIntent.payment_method as string

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

            case 'payment_method.detached': {
                const paymentMethod = (event as any).data.object
                
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
            eventType: (event as any)?.type,
        })
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        )
    }
}
