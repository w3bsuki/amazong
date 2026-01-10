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

        return applyCookies(NextResponse.json({ success: true }))
    } catch (error) {
        console.error("Error deleting payment method:", error)
        return NextResponse.json(
            { error: "Failed to delete payment method" },
            { status: 500 }
        )
    }
}