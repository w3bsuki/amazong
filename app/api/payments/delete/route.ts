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

        const { data: profile } = await supabase
            .from('private_profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_customer_id) {
            return json({ error: "No Stripe customer found" }, { status: 400 })
        }

        const { data: paymentRow, error: paymentRowError } = await supabase
            .from('user_payment_methods')
            .select('id, user_id, stripe_payment_method_id, stripe_customer_id')
            .eq('id', dbId)
            .single()

        if (paymentRowError || !paymentRow) {
            return json({ error: "Payment method not found" }, { status: 404 })
        }

        if (
            paymentRow.user_id !== user.id ||
            paymentRow.stripe_payment_method_id !== paymentMethodId ||
            paymentRow.stripe_customer_id !== profile.stripe_customer_id
        ) {
            return json({ error: "Forbidden" }, { status: 403 })
        }

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
        const stripeCustomer =
            typeof paymentMethod.customer === "string"
                ? paymentMethod.customer
                : paymentMethod.customer?.id

        if (!stripeCustomer || stripeCustomer !== profile.stripe_customer_id) {
            return json({ error: "Forbidden" }, { status: 403 })
        }

        // Detach payment method from Stripe
        await stripe.paymentMethods.detach(paymentMethodId)

        // Delete from database
        const { error: deleteError } = await supabase
            .from('user_payment_methods')
            .delete()
            .eq('id', dbId)
            .eq('user_id', user.id)

        if (deleteError) {
            throw deleteError
        }

        return json({ success: true })
    } catch (error) {
        logError("payments_delete_handler_failed", error, {
            route: "api/payments/delete",
        })
        return json(
            { error: "Failed to delete payment method" },
            { status: 500 }
        )
    }
}
