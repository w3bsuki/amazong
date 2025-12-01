import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST() {
    try {
        const supabase = await createClient()
        
        if (!supabase) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        // Get or create Stripe customer
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        let stripeCustomerId = profile?.stripe_customer_id

        if (!stripeCustomerId) {
            // Create a new Stripe customer
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabase_user_id: user.id
                }
            })
            stripeCustomerId = customer.id

            // Save customer ID to profile
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', user.id)
        }

        // Get origin for redirect URLs
        const headersList = await headers()
        const origin = headersList.get("origin") || "http://localhost:3000"

        // Create a SetupIntent for adding a payment method
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'setup',
            payment_method_types: ['card'],
            success_url: `${origin}/account/payments?setup=success`,
            cancel_url: `${origin}/account/payments?setup=canceled`,
            metadata: {
                user_id: user.id
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error("Error creating setup session:", error)
        return NextResponse.json(
            { error: "Failed to create setup session" },
            { status: 500 }
        )
    }
}
