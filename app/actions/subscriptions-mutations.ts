"use server"

import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
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

    const { error } = await adminSupabase
      .from("profiles")
      .update({ tier: "free" })
      .eq("id", userId)

    if (error) {
      return errorEnvelope({ error: error.message })
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
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("id,status,auto_renew,expires_at,stripe_subscription_id")
      .eq("seller_id", user.id)
      .eq("status", "active")
      .single()

    if (fetchError || !subscription) {
      return errorEnvelope({ error: "No active subscription found" })
    }

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
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        auto_renew: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    if (updateError) {
      logger.error("Database update error:", updateError)
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
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("id,status,auto_renew,expires_at,stripe_subscription_id")
      .eq("seller_id", user.id)
      .eq("status", "active")
      .eq("auto_renew", false)
      .single()

    if (fetchError || !subscription) {
      return errorEnvelope({ error: "No cancellation to revert" })
    }

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
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        auto_renew: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    if (updateError) {
      logger.error("Database update error:", updateError)
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
