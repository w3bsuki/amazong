import { createRouteHandlerClient } from "@/lib/supabase/server"
import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { stripe } from "@/lib/stripe"
import { STRIPE_CUSTOMER_ID_SELECT } from "@/lib/supabase/selects/billing"
import type { NextRequest } from "next/server"
import { buildLocaleUrl, inferLocaleFromRequest } from "@/lib/stripe-locale"
import { noStoreJson } from "@/lib/api/response-helpers"

import { logger } from "@/lib/logger"
export async function POST(request: NextRequest) {
    const { supabase, applyCookies } = createRouteHandlerClient(request)
    const json = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
        applyCookies(noStoreJson(body, init))

    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return json(errorEnvelope({ error: "Not authenticated" }), { status: 401 })
        }

        // Get or create Stripe customer
        const { data: profile } = await supabase
            .from('private_profiles')
            .select(STRIPE_CUSTOMER_ID_SELECT)
            .eq('id', user.id)
            .single()

        let stripeCustomerId = profile?.stripe_customer_id

        if (!stripeCustomerId) {
            // Create a new Stripe customer
            const customer = await stripe.customers.create({
                ...(user.email ? { email: user.email } : {}),
                metadata: {
                    supabase_user_id: user.id
                }
            })
            stripeCustomerId = customer.id

            // Save customer ID to profile
            await supabase
                .from('private_profiles')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', user.id)
        }

        if (!stripeCustomerId) {
            return json(errorEnvelope({ error: "Stripe customer creation failed" }), { status: 500 })
        }

        const locale = inferLocaleFromRequest(request)

        // Create a SetupIntent for adding a payment method
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'setup',
            payment_method_types: ['card'],
            success_url: buildLocaleUrl("account/payments", locale, "setup=success"),
            cancel_url: buildLocaleUrl("account/payments", locale, "setup=canceled"),
            metadata: {
                user_id: user.id
            }
        })

        return json(successEnvelope({ url: session.url }))
    } catch (error) {
        logger.error("Error creating setup session:", error)
        return json(
            errorEnvelope({ error: "Failed to create setup session" }),
            { status: 500 }
        )
    }
}
