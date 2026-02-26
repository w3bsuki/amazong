"use server"

import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import {
  fetchActiveSubscriptionForManage,
  updateProfileTier,
  updateSubscriptionAutoRenew,
} from "@/lib/data/subscriptions"
import { createAdminClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { revalidateTag } from "next/cache"

import { logger } from "@/lib/logger"
export type ActionResult<T = void> = Envelope<
  { data?: T },
  { error: string }
>

type DowngradeResult = Envelope<
  { tier: "free" },
  { error: string }
>

export async function downgradeToFreeTier(): Promise<DowngradeResult> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ error: "Unauthorized" })
    }

    const adminSupabase = createAdminClient()
    const userId = auth.user.id

    const updateResult = await updateProfileTier({
      adminSupabase,
      userId,
      tier: "free",
    })

    if (!updateResult.ok) {
      return errorEnvelope({
        error: updateResult.error instanceof Error ? updateResult.error.message : "Failed to change tier",
      })
    }

    return successEnvelope({ tier: "free" as const })
  } catch (error) {
    logger.error("Downgrade to free error:", error)
    return errorEnvelope({ error: "Failed to change plan. Please try again." })
  }
}

// =============================================================================
// CANCEL SUBSCRIPTION
// Schedule cancellation at end of billing period (NOT immediate)
// User keeps benefits until period ends, then reverts to free tier
// =============================================================================

export async function cancelSubscription(): Promise<ActionResult> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ error: "Not authenticated" })
    }

    const { user, supabase } = auth

    // Get the active subscription
    const subscriptionResult = await fetchActiveSubscriptionForManage({
      supabase,
      sellerId: user.id,
    })
    if (!subscriptionResult.ok || !subscriptionResult.subscription) {
      return errorEnvelope({ error: "No active subscription found" })
    }

    const subscription = subscriptionResult.subscription

    // If we have a Stripe subscription, cancel it at period end
    if (subscription.stripe_subscription_id) {
      try {
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true, // KEY: Cancel at END of period, not immediately
        })
      } catch (stripeError) {
        logger.error("Stripe cancellation error:", stripeError)
        return errorEnvelope({ error: "Failed to cancel with payment provider" })
      }
    }

    // Update our database to reflect cancellation scheduled
    // Status stays 'active' until period actually ends (webhook handles that)
    // We just mark auto_renew = false
    const updateResult = await updateSubscriptionAutoRenew({
      supabase,
      subscriptionId: subscription.id,
      autoRenew: false,
      updatedAt: new Date().toISOString(),
    })

    if (!updateResult.ok) {
      logger.error("Database update error:", updateResult.error)
      return errorEnvelope({ error: "Failed to update subscription" })
    }

    await revalidatePublicProfileTagsForUser(supabase, user.id, "max")
    revalidateTag("subscriptions", "max")
    return successEnvelope()
  } catch (error) {
    logger.error("cancelSubscription error:", error)
    return errorEnvelope({ error: "An unexpected error occurred" })
  }
}

// =============================================================================
// REACTIVATE SUBSCRIPTION
// If user cancelled but period hasn't ended, they can reactivate
// =============================================================================

export async function reactivateSubscription(): Promise<ActionResult> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ error: "Not authenticated" })
    }

    const { user, supabase } = auth

    // Get subscription that's active but set to cancel
    const subscriptionResult = await fetchActiveSubscriptionForManage({
      supabase,
      sellerId: user.id,
      autoRenew: false,
    })
    if (!subscriptionResult.ok || !subscriptionResult.subscription) {
      return errorEnvelope({ error: "No cancellation to revert" })
    }

    const subscription = subscriptionResult.subscription

    // Reactivate in Stripe
    if (subscription.stripe_subscription_id) {
      try {
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: false, // Reactivate auto-renewal
        })
      } catch (stripeError) {
        logger.error("Stripe reactivation error:", stripeError)
        return errorEnvelope({ error: "Failed to reactivate with payment provider" })
      }
    }

    // Update database
    const updateResult = await updateSubscriptionAutoRenew({
      supabase,
      subscriptionId: subscription.id,
      autoRenew: true,
      updatedAt: new Date().toISOString(),
    })

    if (!updateResult.ok) {
      logger.error("Database update error:", updateResult.error)
      return errorEnvelope({ error: "Failed to update subscription" })
    }

    await revalidatePublicProfileTagsForUser(supabase, user.id, "max")
    revalidateTag("subscriptions", "max")
    return successEnvelope()
  } catch (error) {
    logger.error("reactivateSubscription error:", error)
    return errorEnvelope({ error: "An unexpected error occurred" })
  }
}
