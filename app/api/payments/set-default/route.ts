import { createRouteHandlerClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(request: import("next/server").NextRequest) {
    try {
        const { supabase, applyCookies } = createRouteHandlerClient(request)

        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return applyCookies(NextResponse.json({ error: "Not authenticated" }, { status: 401 }))
        }

        const { paymentMethodId, dbId } = await request.json()

        if (!paymentMethodId || !dbId) {
            return applyCookies(NextResponse.json({ error: "Missing required fields" }, { status: 400 }))
        }

        // Get profile with Stripe customer ID
        const { data: profile } = await supabase
            .from('private_profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_customer_id) {
            return applyCookies(NextResponse.json({ error: "No Stripe customer found" }, { status: 400 }))
        }

        // Update default payment method in Stripe
        await stripe.customers.update(profile.stripe_customer_id, {
            invoice_settings: {
                default_payment_method: paymentMethodId
            }
        })

        // Update in database - set all to non-default, then set the selected one
        await supabase
            .from('user_payment_methods')
            .update({ is_default: false })
            .eq('user_id', user.id)

        const { error: updateError } = await supabase
            .from('user_payment_methods')
            .update({ is_default: true })
            .eq('id', dbId)
            .eq('user_id', user.id)

        if (updateError) {
            throw updateError
        }

        return applyCookies(NextResponse.json({ success: true }))
    } catch (error) {
        console.error("Error setting default payment method:", error)
        return NextResponse.json(
            { error: "Failed to set default payment method" },
            { status: 500 }
        )
    }
}
