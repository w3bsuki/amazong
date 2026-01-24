import { createRouteHandlerClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { buildLocaleUrl, inferLocaleFromRequest } from "@/lib/stripe-locale"

export async function POST(request: import("next/server").NextRequest) {
    try {
        const { supabase, applyCookies } = createRouteHandlerClient(request)

        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return applyCookies(NextResponse.json({ error: "Not authenticated" }, { status: 401 }))
        }

        // Get or create Stripe customer
        const { data: profile } = await supabase
            .from('private_profiles')
            .select('stripe_customer_id')
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
                return applyCookies(NextResponse.json({ error: "Stripe customer creation failed" }, { status: 500 }))
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

        return applyCookies(NextResponse.json({ url: session.url }))
    } catch (error) {
        console.error("Error creating setup session:", error)
        return NextResponse.json(
            { error: "Failed to create setup session" },
            { status: 500 }
        )
    }
}
