"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { revalidatePath } from "next/cache"

// =============================================================================
// TYPES
// =============================================================================

export type BillingPeriod = "monthly" | "yearly"

const billingPeriodSchema = z.enum(["monthly", "yearly"])
const subscriptionCheckoutArgsSchema = z.object({
  planId: z.string().min(1),
  billingPeriod: billingPeriodSchema,
})

export interface SubscriptionDetails {
  id: string
  plan_type: string
  status: "active" | "cancelled" | "expired" | "pending"
  billing_period: "monthly" | "yearly"
  price_paid: number
  currency: string
  starts_at: string
  expires_at: string
  auto_renew: boolean
  stripe_subscription_id: string | null
  // Computed
  days_remaining: number
  cancel_at_period_end: boolean
}

export interface ActionResult<T = void> {
  success: boolean
  error?: string
  data?: T
}

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

// =============================================================================
// CHECKOUT & PORTAL SESSIONS
// =============================================================================

export async function createSubscriptionCheckoutSession(args: {
  planId: string
  billingPeriod: BillingPeriod
}): Promise<{ url?: string; error?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return { error: "Stripe configuration is missing. Please check your server logs." }
  }

  const parsedArgs = subscriptionCheckoutArgsSchema.safeParse(args)
  if (!parsedArgs.success) {
    return { error: "Invalid input" }
  }

  const { planId, billingPeriod } = parsedArgs.data

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
        ...(user.email ? { email: user.email } : {}),
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
      ...(customerId ? { customer: customerId } : {}),
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

    return session.url ? { url: session.url } : { error: "Failed to start checkout" }
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

export async function downgradeToFreeTier(): Promise<{ tier?: "free"; error?: string }> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ tier: "free" })
      .eq("id", user.id)

    if (error) {
      return { error: error.message }
    }

    return { tier: "free" as const }
  } catch (error) {
    console.error("Downgrade to free error:", error)
    return { error: "Failed to change plan. Please try again." }
  }
}

// =============================================================================
// GET SUBSCRIPTION DETAILS
// =============================================================================

export async function getSubscriptionDetails(): Promise<ActionResult<SubscriptionDetails | null>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get active subscription from database
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("seller_id", user.id)
      .in("status", ["active", "cancelled"]) // Include cancelled but not yet expired
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found (that's ok, they might be on free tier)
      console.error("Error fetching subscription:", error)
      return { success: false, error: "Failed to fetch subscription" }
    }

    if (!subscription) {
      return { success: true, data: null }
    }

    // Calculate days remaining
    const expiresAt = new Date(subscription.expires_at)
    const now = new Date()
    const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    // Check Stripe for cancel_at_period_end status if we have stripe_subscription_id
    let cancelAtPeriodEnd = false
    if (subscription.stripe_subscription_id) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
        cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end
      } catch (stripeError) {
        // Subscription might not exist in Stripe anymore, that's ok
        console.warn("Could not fetch Stripe subscription:", stripeError)
      }
    }

    return {
      success: true,
      data: {
        id: subscription.id,
        plan_type: subscription.plan_type,
        status: (subscription.status || "active") as "active" | "cancelled" | "expired" | "pending",
        billing_period: (subscription.billing_period || "monthly") as "monthly" | "yearly",
        price_paid: subscription.price_paid,
        currency: subscription.currency || "EUR",
        starts_at: subscription.starts_at || new Date().toISOString(),
        expires_at: subscription.expires_at,
        auto_renew: subscription.auto_renew ?? true,
        stripe_subscription_id: subscription.stripe_subscription_id,
        days_remaining: daysRemaining,
        cancel_at_period_end: cancelAtPeriodEnd,
      },
    }
  } catch (error) {
    console.error("getSubscriptionDetails error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =============================================================================
// CANCEL SUBSCRIPTION
// Schedule cancellation at end of billing period (NOT immediate)
// User keeps benefits until period ends, then reverts to free tier
// =============================================================================

export async function cancelSubscription(): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get the active subscription
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("seller_id", user.id)
      .eq("status", "active")
      .single()

    if (fetchError || !subscription) {
      return { success: false, error: "No active subscription found" }
    }

    // If we have a Stripe subscription, cancel it at period end
    if (subscription.stripe_subscription_id) {
      try {
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true, // KEY: Cancel at END of period, not immediately
        })
      } catch (stripeError) {
        console.error("Stripe cancellation error:", stripeError)
        return { success: false, error: "Failed to cancel with payment provider" }
      }
    }

    // Update our database to reflect cancellation scheduled
    // Status stays 'active' until period actually ends (webhook handles that)
    // We just mark auto_renew = false
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        auto_renew: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    if (updateError) {
      console.error("Database update error:", updateError)
      return { success: false, error: "Failed to update subscription" }
    }

    revalidatePath("/account/plans")
    return { success: true }
  } catch (error) {
    console.error("cancelSubscription error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =============================================================================
// REACTIVATE SUBSCRIPTION
// If user cancelled but period hasn't ended, they can reactivate
// =============================================================================

export async function reactivateSubscription(): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get subscription that's active but set to cancel
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("seller_id", user.id)
      .eq("status", "active")
      .eq("auto_renew", false)
      .single()

    if (fetchError || !subscription) {
      return { success: false, error: "No cancellation to revert" }
    }

    // Reactivate in Stripe
    if (subscription.stripe_subscription_id) {
      try {
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: false, // Reactivate auto-renewal
        })
      } catch (stripeError) {
        console.error("Stripe reactivation error:", stripeError)
        return { success: false, error: "Failed to reactivate with payment provider" }
      }
    }

    // Update database
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        auto_renew: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    if (updateError) {
      console.error("Database update error:", updateError)
      return { success: false, error: "Failed to update subscription" }
    }

    revalidatePath("/account/plans")
    return { success: true }
  } catch (error) {
    console.error("reactivateSubscription error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =============================================================================
// CHECK IF USER CAN UPGRADE
// Returns the tiers they can upgrade to
// =============================================================================

const TIER_ORDER = ["free", "starter", "basic", "premium", "professional", "business", "enterprise"]

export async function getAvailableUpgrades(): Promise<ActionResult<string[]>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get user's current tier from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier, account_type")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return { success: true, data: TIER_ORDER.slice(1) } // All paid tiers
    }

    const currentTierIndex = TIER_ORDER.indexOf(profile.tier || "free")
    const upgradeTiers = TIER_ORDER.slice(currentTierIndex + 1)

    return { success: true, data: upgradeTiers }
  } catch (error) {
    console.error("getAvailableUpgrades error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
