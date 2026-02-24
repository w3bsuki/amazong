import type { NextRequest } from "next/server"
import { z } from "zod"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { errorEnvelope } from "@/lib/api/envelope"
import { stripe } from "@/lib/stripe"
import {
  STRIPE_CUSTOMER_ID_SELECT,
  USER_PAYMENT_METHOD_VERIFICATION_SELECT,
} from "@/lib/supabase/selects/billing"
import { noStoreJson } from "@/lib/api/response-helpers"

const paymentMethodBodySchema = z
  .object({
    paymentMethodId: z.string().regex(/^pm_/),
    dbId: z.string().uuid(),
  })
  .strict()

type PaymentsRouteContext = ReturnType<typeof createRouteHandlerClient>

type OwnedPaymentMethodContext = {
  supabase: PaymentsRouteContext["supabase"]
  json: (body: unknown, init?: Parameters<typeof noStoreJson>[1]) => Response
  user: { id: string }
  paymentMethodId: string
  dbId: string
  stripeCustomerId: string
}

type OwnedPaymentMethodResult =
  | {
      ok: true
      context: OwnedPaymentMethodContext
    }
  | {
      ok: false
      response: Response
    }

export async function resolveOwnedPaymentMethodRequest(
  request: NextRequest
): Promise<OwnedPaymentMethodResult> {
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
    applyCookies(noStoreJson(body, init))

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      response: json(errorEnvelope({ error: "Not authenticated" }), { status: 401 }),
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return {
      ok: false,
      response: json(errorEnvelope({ error: "Missing required fields" }), { status: 400 }),
    }
  }

  const parseResult = paymentMethodBodySchema.safeParse(body)
  if (!parseResult.success) {
    return {
      ok: false,
      response: json(errorEnvelope({ error: "Missing required fields" }), { status: 400 }),
    }
  }

  const { paymentMethodId, dbId } = parseResult.data

  const { data: profile } = await supabase
    .from("private_profiles")
    .select(STRIPE_CUSTOMER_ID_SELECT)
    .eq("id", user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return {
      ok: false,
      response: json(errorEnvelope({ error: "No Stripe customer found" }), { status: 400 }),
    }
  }

  const { data: paymentRow, error: paymentRowError } = await supabase
    .from("user_payment_methods")
    .select(USER_PAYMENT_METHOD_VERIFICATION_SELECT)
    .eq("id", dbId)
    .single()

  if (paymentRowError || !paymentRow) {
    return {
      ok: false,
      response: json(errorEnvelope({ error: "Payment method not found" }), { status: 404 }),
    }
  }

  if (
    paymentRow.user_id !== user.id ||
    paymentRow.stripe_payment_method_id !== paymentMethodId ||
    paymentRow.stripe_customer_id !== profile.stripe_customer_id
  ) {
    return {
      ok: false,
      response: json(errorEnvelope({ error: "Forbidden" }), { status: 403 }),
    }
  }

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
  const stripeCustomer =
    typeof paymentMethod.customer === "string"
      ? paymentMethod.customer
      : paymentMethod.customer?.id

  if (!stripeCustomer || stripeCustomer !== profile.stripe_customer_id) {
    return {
      ok: false,
      response: json(errorEnvelope({ error: "Forbidden" }), { status: 403 }),
    }
  }

  return {
    ok: true,
    context: {
      supabase,
      json,
      user: { id: user.id },
      paymentMethodId,
      dbId,
      stripeCustomerId: profile.stripe_customer_id,
    },
  }
}
