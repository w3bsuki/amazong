import { createRouteHandlerClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { logError } from "@/lib/structured-log"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function POST(request: import("next/server").NextRequest) {
    const { supabase, applyCookies } = createRouteHandlerClient(request)
    const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
        applyCookies(NextResponse.json(body, init))

    const BodySchema = z
        .object({
            paymentMethodId: z.string().regex(/^pm_/),
            dbId: z.string().uuid(),
        })
        .strict()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return json({ error: "Not authenticated" }, { status: 401 })
        }

        const parseResult = BodySchema.safeParse(await request.json())
        if (!parseResult.success) {
            return json({ error: "Missing required fields" }, { status: 400 })
        }

        const { paymentMethodId, dbId } = parseResult.data

        // Get profile with Stripe customer ID
        const { data: profile } = await supabase
            .from('private_profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_customer_id) {
            return json({ error: "No Stripe customer found" }, { status: 400 })
        }

        // Update default payment method in Stripe
        await stripe.customers.update(profile.stripe_customer_id, {
            invoice_settings: {
                default_payment_method: paymentMethodId
            }
        })

        // Update in database - set all to non-default, then set the selected one
        const { error: clearDefaultsError } = await supabase
            .from('user_payment_methods')
            .update({ is_default: false })
            .eq('user_id', user.id)

        if (clearDefaultsError) {
            throw clearDefaultsError
        }

        const { error: updateError } = await supabase
            .from('user_payment_methods')
            .update({ is_default: true })
            .eq('id', dbId)
            .eq('user_id', user.id)

        if (updateError) {
            throw updateError
        }

        return json({ success: true })
    } catch (error) {
        logError("payments_set_default_handler_failed", error, {
            route: "api/payments/set-default",
        })
        return json(
            { error: "Failed to set default payment method" },
            { status: 500 }
        )
    }
}
