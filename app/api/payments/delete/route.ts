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
