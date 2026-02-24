import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { stripe } from "@/lib/stripe"
import { logError } from "@/lib/logger"
import type { NextRequest } from "next/server"
import { resolveOwnedPaymentMethodRequest } from "../_lib/payment-method-ownership"
import { noStoreJson } from "@/lib/api/response-helpers"

async function handleDeletePaymentMethod(request: NextRequest) {
    try {
        const ownershipResult = await resolveOwnedPaymentMethodRequest(request)
        if (!ownershipResult.ok) {
          return ownershipResult.response
        }

        const { supabase, json, user, paymentMethodId, dbId } = ownershipResult.context

        // Detach payment method from Stripe
        await stripe.paymentMethods.detach(paymentMethodId)

        // Delete from database
        const { error: deleteError } = await supabase
            .from("user_payment_methods")
            .delete()
            .eq("id", dbId)
            .eq("user_id", user.id)

        if (deleteError) {
          throw deleteError
        }

        return json(successEnvelope())
    } catch (error) {
        logError("payments_delete_handler_failed", error, {
            route: "api/payments/delete",
        })
        return noStoreJson(
            errorEnvelope({ error: "Failed to delete payment method" }),
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    return handleDeletePaymentMethod(request)
}

export async function DELETE(request: NextRequest) {
    return handleDeletePaymentMethod(request)
}
