import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

// PRODUCTION: Use centralized admin client for consistency
const supabase = createAdminClient()

export async function POST(request: Request) {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : "Webhook verification failed"
        console.error("Webhook signature verification failed:", message)
        return NextResponse.json({ error: message }, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object

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
                    .single()

                if (existing) break // Already saved

                // Check if user has any existing payment methods
                const { data: existingMethods } = await supabase
                    .from('user_payment_methods')
                    .select('id')
                    .eq('user_id', userId)

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
                    console.error("Error saving payment method:", insertError)
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
                const paymentMethod = event.data.object
                
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
        console.error("Webhook handler error:", error)
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        )
    }
}
