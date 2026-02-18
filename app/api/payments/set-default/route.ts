import { createRouteHandlerClient } from "@/lib/supabase/server"
import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { stripe } from "@/lib/stripe"
import {
    STRIPE_CUSTOMER_ID_SELECT,
    USER_PAYMENT_METHOD_VERIFICATION_SELECT,
} from "@/lib/supabase/selects/billing"
import { logError } from "@/lib/logger"
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
            return json(errorEnvelope({ error: "Not authenticated" }), { status: 401 })
        }

        let body: unknown
        try {
            body = await request.json()
        } catch {
            return json(errorEnvelope({ error: "Missing required fields" }), { status: 400 })
        }

        const parseResult = BodySchema.safeParse(body)
        if (!parseResult.success) {
            return json(errorEnvelope({ error: "Missing required fields" }), { status: 400 })
        }

        const { paymentMethodId, dbId } = parseResult.data

        // Get profile with Stripe customer ID
        const { data: profile } = await supabase
            .from('private_profiles')
            .select(STRIPE_CUSTOMER_ID_SELECT)
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_customer_id) {
            return json(errorEnvelope({ error: "No Stripe customer found" }), { status: 400 })
        }

        const { data: paymentRow, error: paymentRowError } = await supabase
            .from('user_payment_methods')
            .select(USER_PAYMENT_METHOD_VERIFICATION_SELECT)
            .eq('id', dbId)
            .single()

        if (paymentRowError || !paymentRow) {
            return json(errorEnvelope({ error: "Payment method not found" }), { status: 404 })
        }

        if (
            paymentRow.user_id !== user.id ||
            paymentRow.stripe_payment_method_id !== paymentMethodId ||
            paymentRow.stripe_customer_id !== profile.stripe_customer_id
        ) {
            return json(errorEnvelope({ error: "Forbidden" }), { status: 403 })
        }

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
        const stripeCustomer =
            typeof paymentMethod.customer === "string"
                ? paymentMethod.customer
                : paymentMethod.customer?.id

        if (!stripeCustomer || stripeCustomer !== profile.stripe_customer_id) {
            return json(errorEnvelope({ error: "Forbidden" }), { status: 403 })
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

        return json(successEnvelope())
    } catch (error) {
        logError("payments_set_default_handler_failed", error, {
            route: "api/payments/set-default",
        })
        return json(
            errorEnvelope({ error: "Failed to set default payment method" }),
            { status: 500 }
        )
    }
}
