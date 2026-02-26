"use server"

import { z } from "zod"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import {
  fetchActiveSubscriptionPlanForCheckout,
  fetchActiveSubscriptionStripeCustomerId,
  fetchPrivateProfileStripeCustomerId,
  upsertPrivateProfileStripeCustomerId,
} from "@/lib/data/subscriptions"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"

import { logger } from "@/lib/logger"
// =============================================================================
// TYPES
// =============================================================================

export type BillingPeriod = "monthly" | "yearly"

const billingPeriodSchema = z.enum(["monthly", "yearly"])
const localeSchema = z.enum(["en", "bg"]).optional()
const subscriptionCheckoutArgsSchema = z.object({
  planId: z.string().min(1),
  billingPeriod: billingPeriodSchema,
  locale: localeSchema,
})

type CheckoutSessionResult = Envelope<
  { url: string },
  { error: string }
>

type BillingPortalSessionResult = Envelope<
  { url: string },
  { error: string }
>

type CheckoutSessionCreateParams = Stripe.Checkout.SessionCreateParams
type CheckoutLineItem = Stripe.Checkout.SessionCreateParams.LineItem

// =============================================================================
// HELPERS
// =============================================================================

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_URL ||
    "http://localhost:3000"
  )
}

function normalizeLocale(locale: unknown): "en" | "bg" {
  return locale === "bg" ? "bg" : "en"
}

function getAbsoluteAccountPlansUrl(locale: unknown) {
  const base = getAppUrl().replace(/\/$/, "")
  const safeLocale = normalizeLocale(locale)
  return `${base}/${safeLocale}/account/plans`
}

// =============================================================================
// CHECKOUT & PORTAL SESSIONS
// =============================================================================

export async function createSubscriptionCheckoutSession(args: {
  planId: string
  billingPeriod: BillingPeriod
  locale?: "en" | "bg"
}): Promise<CheckoutSessionResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    logger.error("STRIPE_SECRET_KEY is missing")
    return errorEnvelope({ error: "Stripe configuration is missing. Please check your server logs." })
  }

  const parsedArgs = subscriptionCheckoutArgsSchema.safeParse(args)
  if (!parsedArgs.success) {
    return errorEnvelope({ error: "Invalid input" })
  }

  const { planId, billingPeriod, locale } = parsedArgs.data

  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ error: "Unauthorized" })
    }

    const { user, supabase } = auth

    const planResult = await fetchActiveSubscriptionPlanForCheckout({ supabase, planId })
    if (!planResult.ok) {
      return errorEnvelope({ error: "Failed to load plan" })
    }

    const plan = planResult.plan
    if (!plan) {
      return errorEnvelope({ error: "Plan not found" })
    }

    if ((plan.price_monthly ?? 0) === 0) {
      return errorEnvelope({ error: "Cannot subscribe to free tier" })
    }

    const price = billingPeriod === "yearly" ? plan.price_yearly : plan.price_monthly

    const customerIdResult = await fetchPrivateProfileStripeCustomerId({ supabase, userId: user.id })
    if (!customerIdResult.ok) {
      return errorEnvelope({ error: "Failed to load profile" })
    }

    let customerId: string | null = customerIdResult.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        ...(user.email ? { email: user.email } : {}),
        metadata: {
          profile_id: user.id,
          supabase_user_id: user.id,
        },
      })

      customerId = customer.id

      const upsertResult = await upsertPrivateProfileStripeCustomerId({
        supabase,
        userId: user.id,
        stripeCustomerId: customerId,
      })
      if (!upsertResult.ok) {
        return errorEnvelope({ error: "Failed to persist customer" })
      }
    }

    const stripePriceId =
      billingPeriod === "yearly" ? plan.stripe_price_yearly_id : plan.stripe_price_monthly_id

    // Use Stripe Price IDs when available (preferred), fallback to inline EUR pricing
    const useStripePriceId = !!(stripePriceId && stripePriceId.startsWith("price_"))

    const lineItems: CheckoutLineItem[] = useStripePriceId
      ? [{ price: stripePriceId, quantity: 1 }]
      : [{
          price_data: {
            currency: "eur",
            product_data: {
              name: `${plan.name} Plan`,
              description: `${plan.name} seller subscription - ${billingPeriod}`,
            },
            unit_amount: Math.round(Number(price ?? 0) * 100),
            recurring: {
              interval: billingPeriod === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        }]

    const accountPlansUrl = getAbsoluteAccountPlansUrl(locale)

    const checkoutParams: Omit<CheckoutSessionCreateParams, "line_items"> = {
      ...(customerId ? { customer: customerId } : {}),
      mode: "subscription" as const,
      payment_method_types: ["card"],
      metadata: {
        profile_id: user.id,
        plan_id: planId,
        plan_tier: plan.tier,
        billing_period: billingPeriod,
        commission_rate: (plan.final_value_fee ?? plan.commission_rate ?? 12).toString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: "required" as const,
      success_url: `${accountPlansUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${accountPlansUrl}?canceled=true`,
    }

    const session = await stripe.checkout.sessions.create({
      ...checkoutParams,
      line_items: lineItems,
    })

    return session.url
      ? successEnvelope({ url: session.url })
      : errorEnvelope({ error: "Failed to start checkout" })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    const errorType = error instanceof Error ? error.constructor.name : typeof error
    logger.error(`[subscriptions] ${errorType}: ${errorMessage}`)
    return errorEnvelope({ error: errorMessage })
  }
}

export async function createBillingPortalSession(
  args?: { locale?: "en" | "bg" }
): Promise<BillingPortalSessionResult> {
  const accountPlansUrl = getAbsoluteAccountPlansUrl(args?.locale)
  if (!process.env.STRIPE_SECRET_KEY) {
    logger.error("STRIPE_SECRET_KEY is missing")
    return errorEnvelope({ error: "Stripe configuration is missing. Please check your server logs." })
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ error: "Unauthorized" })
    }

    const { user, supabase } = auth

    const stripeCustomerIdResult = await fetchActiveSubscriptionStripeCustomerId({
      supabase,
      sellerId: user.id,
    })
    if (!stripeCustomerIdResult.ok) {
      return errorEnvelope({ error: "Failed to load subscription" })
    }

    let stripeCustomerId: string | null = stripeCustomerIdResult.stripeCustomerId || null

    if (!stripeCustomerId) {
      // Fallback: profile might have a customer id even if subscription row isn't present
      const profileCustomerIdResult = await fetchPrivateProfileStripeCustomerId({
        supabase,
        userId: user.id,
      })
      if (!profileCustomerIdResult.ok) {
        return errorEnvelope({ error: "Failed to load profile" })
      }

      stripeCustomerId = profileCustomerIdResult.stripeCustomerId

      if (!stripeCustomerId) {
        return errorEnvelope({ error: "No active subscription found" })
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: accountPlansUrl,
      })

      return successEnvelope({ url: portalSession.url })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: accountPlansUrl,
    })

    return successEnvelope({ url: portalSession.url })
  } catch (error) {
    logger.error("Portal session error", error)
    return errorEnvelope({ error: "Failed to create portal session" })
  }
}
