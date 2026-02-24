import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { stripe } from "@/lib/stripe"
import { logError } from "@/lib/logger"
import type { NextRequest } from "next/server"
import { resolveOwnedPaymentMethodRequest } from "../_lib/payment-method-ownership"
import { noStoreJson } from "@/lib/api/response-helpers"

export async function POST(request: NextRequest) {
    try {
        const ownershipResult = await resolveOwnedPaymentMethodRequest(request)
        if (!ownershipResult.ok) {
          return ownershipResult.response
        }

        const { supabase, json, user, paymentMethodId, dbId, stripeCustomerId } =
          ownershipResult.context

        // Update default payment method in Stripe
        await stripe.customers.update(stripeCustomerId, {
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
        return noStoreJson(
            errorEnvelope({ error: "Failed to set default payment method" }),
            { status: 500 }
        )
    }
}
