import { NextRequest } from "next/server"
import type Stripe from "stripe"
import { z } from "zod"

import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { createRouteJsonHelpers } from "@/lib/api/route-json"
import { stripe } from "@/lib/stripe"
import { buildLocaleUrl, inferLocaleFromRequest } from "@/lib/stripe-locale"
import { ID_AND_STRIPE_CUSTOMER_ID_SELECT } from "@/lib/supabase/selects/billing"

import { logger } from "@/lib/logger"
const SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT =
  "id,tier,name,price_monthly,price_yearly,stripe_price_monthly_id,stripe_price_yearly_id,commission_rate,final_value_fee"

const CheckoutLocaleSchema = z.preprocess(
  (value) => (value === "en" || value === "bg" ? value : undefined),
  z.enum(["en", "bg"]).optional()
)

const CheckoutRequestSchema = z
  .object({
    planId: z.string().trim().min(1),
    billingPeriod: z.enum(["monthly", "yearly"]),
    locale: CheckoutLocaleSchema,
  })
  .passthrough()

type CheckoutSessionCreateParams = Stripe.Checkout.SessionCreateParams
type CheckoutLineItem = Stripe.Checkout.SessionCreateParams.LineItem
type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>
type RouteJson = ReturnType<typeof createRouteJsonHelpers>["json"]
type RouteSupabase = ReturnType<typeof createRouteJsonHelpers>["supabase"]

interface CheckoutProfile {
  id: string
  stripe_customer_id: string | null
}

interface CheckoutPlan {
  id: string
  tier: string
  name: string
  price_monthly: number
  price_yearly: number
  stripe_price_monthly_id: string | null
  stripe_price_yearly_id: string | null
  commission_rate: number | null
  final_value_fee: number | null
}

interface CheckoutUser {
  id: string
  email?: string | null
}

class CheckoutRouteError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "CheckoutRouteError"
  }
}

function hasErrorProperty(error: unknown, property: string): boolean {
  return typeof error === "object" && error !== null && property in error
}

function isStripeLikeError(error: unknown): boolean {
  return (
    hasErrorProperty(error, "type") ||
    hasErrorProperty(error, "rawType") ||
    hasErrorProperty(error, "statusCode")
  )
}

function isStripePriceId(value: string | null): value is string {
  return typeof value === "string" && value.startsWith("price_")
}

async function parseCheckoutRequest(req: NextRequest): Promise<CheckoutRequest> {
  let rawBody: unknown = {}
  try {
    rawBody = await req.json()
  } catch {
    throw new CheckoutRouteError(400, "Invalid JSON body")
  }

  const parsedBody = CheckoutRequestSchema.safeParse(
    typeof rawBody === "object" && rawBody !== null ? rawBody : {}
  )

  if (!parsedBody.success) {
    const hasPlanIssue = parsedBody.error.issues.some((issue) => issue.path[0] === "planId")
    throw new CheckoutRouteError(
      400,
      hasPlanIssue
        ? "Missing or invalid planId"
        : 'Missing or invalid billingPeriod (expected "monthly" or "yearly")'
    )
  }

  return parsedBody.data
}

async function getCheckoutProfile(
  supabase: RouteSupabase,
  userId: string
): Promise<CheckoutProfile> {
  const { data: profile, error: profileError } = await supabase
    .from("private_profiles")
    .select(ID_AND_STRIPE_CUSTOMER_ID_SELECT)
    .eq("id", userId)
    .single<CheckoutProfile>()

  if (profileError) {
    logger.error("Failed to fetch billing profile:", profileError)
    throw new CheckoutRouteError(500, "Internal server error")
  }

  if (!profile) {
    throw new CheckoutRouteError(404, "Profile not found")
  }

  return profile
}

async function getCheckoutPlan(
  supabase: RouteSupabase,
  planId: string
): Promise<CheckoutPlan> {
  const { data: plan, error: planError } = await supabase
    .from("subscription_plans")
    .select(SUBSCRIPTION_PLAN_SELECT_FOR_CHECKOUT)
    .eq("id", planId)
    .eq("is_active", true)
    .single<CheckoutPlan>()

  if (planError) {
    logger.error("Failed to fetch subscription plan:", planError)
    throw new CheckoutRouteError(500, "Internal server error")
  }

  if (!plan) {
    throw new CheckoutRouteError(404, "Plan not found")
  }

  if (plan.price_monthly === 0) {
    throw new CheckoutRouteError(400, "Cannot subscribe to free tier")
  }

  return plan
}

async function ensureCustomerId(params: {
  profile: CheckoutProfile
  user: CheckoutUser
  supabase: RouteSupabase
}): Promise<string> {
  const { profile, user, supabase } = params
  if (profile.stripe_customer_id) {
    return profile.stripe_customer_id
  }

  const customer = await stripe.customers.create({
    ...(user.email ? { email: user.email } : {}),
    metadata: {
      profile_id: profile.id,
      supabase_user_id: user.id,
    },
  })

  const customerId = customer.id
  const { error: updateProfileError } = await supabase
    .from("private_profiles")
    .update({ stripe_customer_id: customerId })
    .eq("id", profile.id)

  if (updateProfileError) {
    logger.error("Failed to store Stripe customer on profile:", updateProfileError)
    throw new CheckoutRouteError(500, "Internal server error")
  }

  return customerId
}

function buildCheckoutLineItems(
  plan: CheckoutPlan,
  billingPeriod: CheckoutRequest["billingPeriod"]
): CheckoutLineItem[] {
  const price = billingPeriod === "yearly" ? plan.price_yearly : plan.price_monthly
  const stripePriceId =
    billingPeriod === "yearly" ? plan.stripe_price_yearly_id : plan.stripe_price_monthly_id

  if (isStripePriceId(stripePriceId)) {
    return [{ price: stripePriceId, quantity: 1 }]
  }

  return [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: `${plan.name} Plan`,
          description: `${plan.name} seller subscription - ${billingPeriod}`,
        },
        unit_amount: Math.round(price * 100),
        recurring: {
          interval: billingPeriod === "yearly" ? "year" : "month",
        },
      },
      quantity: 1,
    },
  ]
}

function toCheckoutParams(params: {
  customerId: string
  profile: CheckoutProfile
  plan: CheckoutPlan
  planId: string
  billingPeriod: CheckoutRequest["billingPeriod"]
  accountPlansUrl: string
}): Omit<CheckoutSessionCreateParams, "line_items"> {
  const { customerId, profile, plan, planId, billingPeriod, accountPlansUrl } = params

  return {
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    metadata: {
      profile_id: profile.id,
      plan_id: planId,
      plan_tier: plan.tier,
      billing_period: billingPeriod,
      commission_rate: (plan.final_value_fee ?? plan.commission_rate ?? 12).toString(),
    },
    allow_promotion_codes: true,
    billing_address_collection: "required",
    success_url: `${accountPlansUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${accountPlansUrl}?canceled=true`,
  }
}

function handleCheckoutError(error: unknown, json: RouteJson) {
  if (error instanceof CheckoutRouteError) {
    return json(errorEnvelope({ error: error.message }), { status: error.status })
  }

  const errorMessage = error instanceof Error ? error.message : "Unknown error"
  const errorType = error instanceof Error ? error.constructor.name : typeof error
  logger.error(`[checkout] ${errorType}: ${errorMessage}`)

  const isStripeError =
    (error instanceof Error && error.message.includes("Stripe")) || isStripeLikeError(error)
  return json(
    errorEnvelope({
      error: isStripeError ? "Payment service error. Please try again." : "Internal server error",
    }),
    { status: 500 }
  )
}

export async function POST(req: NextRequest) {
  const { supabase, json } = createRouteJsonHelpers(req)

  try {
    const { planId, billingPeriod, locale } = await parseCheckoutRequest(req)
    const resolvedLocale = inferLocaleFromRequest(req, locale)
    const accountPlansUrl = buildLocaleUrl("account/plans", resolvedLocale)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new CheckoutRouteError(401, "Unauthorized")
    }

    const profile = await getCheckoutProfile(supabase, user.id)
    const plan = await getCheckoutPlan(supabase, planId)
    const customerId = await ensureCustomerId({ profile, user, supabase })
    const lineItems = buildCheckoutLineItems(plan, billingPeriod)
    const checkoutParams = toCheckoutParams({
      customerId,
      profile,
      plan,
      planId,
      billingPeriod,
      accountPlansUrl,
    })

    const session = await stripe.checkout.sessions.create({
      ...checkoutParams,
      line_items: lineItems,
    })

    return json(successEnvelope({ sessionId: session.id, url: session.url }))
  } catch (error) {
    return handleCheckoutError(error, json)
  }
}
