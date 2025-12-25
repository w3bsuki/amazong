"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export type BillingPeriod = "monthly" | "yearly"

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_URL ||
    "http://localhost:3000"
  )
}

export async function createSubscriptionCheckoutSession(args: {
  planId: string
  billingPeriod: BillingPeriod
}): Promise<{ url?: string; error?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return { error: "Stripe configuration is missing. Please check your server logs." }
  }

  const { planId, billingPeriod } = args

  if (!planId || !billingPeriod) {
    return { error: "Missing required fields" }
  }

  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return { error: "Profile not found" }
    }

    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .eq("is_active", true)
      .single()

    if (!plan) {
      return { error: "Plan not found" }
    }

    if ((plan.price_monthly ?? 0) === 0) {
      return { error: "Cannot subscribe to free tier" }
    }

    const price = billingPeriod === "yearly" ? plan.price_yearly : plan.price_monthly

    let customerId: string | null | undefined = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          profile_id: profile.id,
          supabase_user_id: user.id,
        },
      })

      customerId = customer.id

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", profile.id)
    }

    const stripePriceId =
      billingPeriod === "yearly" ? plan.stripe_price_yearly_id : plan.stripe_price_monthly_id

    const lineItems = stripePriceId
      ? [{ price: stripePriceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "eur" as const,
              product_data: {
                name: `${plan.name} Plan`,
                description: `${plan.name} seller subscription - ${billingPeriod}`,
              },
              unit_amount: Math.round(Number(price ?? 0) * 100),
              recurring: {
                interval: (billingPeriod === "yearly" ? "year" : "month") as "year" | "month",
              },
            },
            quantity: 1,
          },
        ]

    const appUrl = getAppUrl()

    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        profile_id: profile.id,
        plan_id: planId,
        plan_tier: plan.tier,
        billing_period: billingPeriod,
        commission_rate: (plan.final_value_fee ?? plan.commission_rate ?? 12).toString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      success_url: `${appUrl}/account/plans?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/account/plans?canceled=true`,
    })

    return { url: session.url || undefined }
  } catch (error) {
    console.error("Subscription checkout error:", error)
    return { error: error instanceof Error ? error.message : "Internal server error" }
  }
}

export async function createBillingPortalSession(): Promise<{ url?: string; error?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return { error: "Stripe configuration is missing. Please check your server logs." }
  }

  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const { data: activeSubscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("seller_id", user.id)
      .eq("status", "active")
      .single()

    const stripeCustomerIdFromSubscription = activeSubscription?.stripe_customer_id

    const stripeCustomerId = stripeCustomerIdFromSubscription || null

    if (!stripeCustomerId) {
      // Fallback: profile might have a customer id even if subscription row isn't present
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single()

      if (!profile?.stripe_customer_id) {
        return { error: "No active subscription found" }
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${getAppUrl()}/account/plans`,
      })

      return { url: portalSession.url }
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${getAppUrl()}/account/plans`,
    })

    return { url: portalSession.url }
  } catch (error) {
    console.error("Portal session error:", error)
    return { error: "Failed to create portal session" }
  }
}
