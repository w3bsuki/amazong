"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePublicProfileTagsByUsername } from "@/lib/cache/revalidate-profile-tags"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { stripe } from "@/lib/stripe"
import { STRIPE_CUSTOMER_ID_SELECT } from "@/lib/supabase/selects/billing"
import { revalidateTag } from "next/cache"
import { normalizePlanTier } from "@/lib/subscriptions/normalize-tier"
import type { Database } from "@/lib/supabase/database.types"
import { z } from "zod"

// =============================================================================
// TYPES
// =============================================================================

export interface BoostResult {
  success: boolean
  error?: string
  boostsRemaining?: number
}

export type CreateBoostCheckoutResult = Envelope<
  { url: string },
  { error: string }
>

type ProfileBoostData = {
  boosts_remaining: number
  boosts_allocated: number
  boosts_reset_at: string | null
  account_type: Database["public"]["Tables"]["profiles"]["Row"]["account_type"]
  tier: Database["public"]["Tables"]["profiles"]["Row"]["tier"]
}

const BoostProductIdSchema = z.string().uuid()
const BoostDurationDaysSchema = z.union([z.literal(7), z.literal(14), z.literal(30)])
const BoostLocaleSchema = z.enum(["en", "bg"])
const CreateBoostCheckoutInputSchema = z.object({
  productId: BoostProductIdSchema,
  durationDays: BoostDurationDaysSchema,
  locale: BoostLocaleSchema.optional(),
})

function revalidateBoostCaches(productId: string, userId: string) {
  const tags = [
    `product:${productId}`,
    `seller-${userId}`,
    `seller-products-${userId}`,
    "products:type:newest",
    "products:type:featured",
    "products:type:bestsellers",
    "products:type:deals",
    "products:type:promo",
  ]

  for (const tag of tags) {
    revalidateTag(tag, "products")
  }
}

async function getProfileBoosts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ProfileBoostData | null> {
  const { data } = await supabase
    .from("profiles")
    .select("boosts_remaining, boosts_allocated, boosts_reset_at, account_type, tier")
    .eq("id", userId)
    .single()

  if (!data) return null

  return {
    boosts_remaining: data.boosts_remaining ?? 0,
    boosts_allocated: data.boosts_allocated ?? 0,
    boosts_reset_at: data.boosts_reset_at ?? null,
    account_type: data.account_type ?? null,
    tier: data.tier ?? null,
  }
}

function getNextMonthlyResetAtISO(baseDate: Date): string {
  const nextUtcMonth = new Date(
    Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, 1, 0, 0, 0, 0)
  )
  return nextUtcMonth.toISOString()
}

async function syncProfileBoostCredits(userId: string): Promise<ProfileBoostData | null> {
  const supabase = await createClient()
  const profileBoosts = await getProfileBoosts(supabase, userId)
  if (!profileBoosts) return null

  const accountType = profileBoosts.account_type === "business" ? "business" : "personal"
  const { data: activeSubscription } = await supabase
    .from("subscriptions")
    .select("plan_type")
    .eq("seller_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const normalizedTier = normalizePlanTier(activeSubscription?.plan_type ?? profileBoosts.tier)

  const { data: tierPlan } = await supabase
    .from("subscription_plans")
    .select("boosts_included")
    .eq("tier", normalizedTier)
    .eq("account_type", accountType)
    .eq("is_active", true)
    .maybeSingle()

  let boostsIncluded = Number(tierPlan?.boosts_included ?? 0)
  if (!tierPlan) {
    const { data: freePlan } = await supabase
      .from("subscription_plans")
      .select("boosts_included")
      .eq("tier", "free")
      .eq("account_type", accountType)
      .eq("is_active", true)
      .maybeSingle()
    boostsIncluded = Number(freePlan?.boosts_included ?? 0)
  }

  const now = new Date()
  const parsedResetAt = profileBoosts.boosts_reset_at ? new Date(profileBoosts.boosts_reset_at) : null
  const needsMonthlyReset =
    !parsedResetAt || Number.isNaN(parsedResetAt.getTime()) || parsedResetAt <= now

  const nextAllocated = boostsIncluded
  const nextRemaining = needsMonthlyReset
    ? boostsIncluded
    : Math.min(profileBoosts.boosts_remaining, boostsIncluded)
  const nextResetAt = needsMonthlyReset
    ? getNextMonthlyResetAtISO(now)
    : profileBoosts.boosts_reset_at

  const changed =
    nextAllocated !== profileBoosts.boosts_allocated ||
    nextRemaining !== profileBoosts.boosts_remaining ||
    nextResetAt !== profileBoosts.boosts_reset_at

  if (changed) {
    const adminSupabase = createAdminClient()
    const profileUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
      boosts_allocated: nextAllocated,
      boosts_remaining: nextRemaining,
      boosts_reset_at: nextResetAt,
    }
    const { error: syncError } = await adminSupabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", userId)

    if (syncError) {
      console.error("Failed to sync subscription boost credits:", syncError)
      return profileBoosts
    }
  }

  return {
    ...profileBoosts,
    boosts_allocated: nextAllocated,
    boosts_remaining: nextRemaining,
    boosts_reset_at: nextResetAt,
  }
}

// =============================================================================
// USE FREE BOOST (from subscription)
// Deducts one boost from the seller's allocation
// =============================================================================

export async function useSubscriptionBoost(productId: string): Promise<BoostResult> {
  const parsedProductId = BoostProductIdSchema.safeParse(productId)
  if (!parsedProductId.success) {
    return { success: false, error: "Invalid productId" }
  }

  const safeProductId = parsedProductId.data

  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }

  const { user, supabase } = auth
  const userId = user.id

  // Verify the product belongs to the user
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, seller_id, is_boosted")
    .eq("id", safeProductId)
    .single()

  if (productError || !product) {
    return { success: false, error: "Product not found" }
  }

  if (product.seller_id !== userId) {
    return { success: false, error: "You can only boost your own products" }
  }

  if (product.is_boosted) {
    return { success: false, error: "Product is already boosted" }
  }

  // Sync boost allocation from active subscription plan + monthly reset cycle.
  const boostData = await syncProfileBoostCredits(userId)
  if (!boostData) {
    return { success: false, error: "Profile not found" }
  }

  const { boosts_remaining: boostsRemaining } = boostData

  if (boostsRemaining <= 0) {
    return { success: false, error: "No boosts remaining. Purchase more or upgrade your plan." }
  }

  // Use admin client for updates
  const adminSupabase = createAdminClient()

  // 1. Deduct boost from profile
  const deductUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
    boosts_remaining: boostsRemaining - 1,
  }
  const { error: deductError } = await adminSupabase
    .from("profiles")
    .update(deductUpdate)
    .eq("id", userId)

  if (deductError) {
    console.error("Failed to deduct boost:", deductError)
    return { success: false, error: "Failed to use boost. Please try again." }
  }

  // 2. Apply boost to product (7 days default for subscription boosts)
  const boostDuration = 7
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + boostDuration)

  const { error: boostError } = await adminSupabase
    .from("products")
    .update({
      is_boosted: true,
      boost_expires_at: expiresAt.toISOString(),
      listing_type: "boosted",
    })
    .eq("id", safeProductId)

  if (boostError) {
    // Rollback: restore the boost count
    const rollbackUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
      boosts_remaining: boostsRemaining,
    }
    await adminSupabase
      .from("profiles")
      .update(rollbackUpdate)
      .eq("id", userId)

    console.error("Failed to boost product:", boostError)
    return { success: false, error: "Failed to boost product. Please try again." }
  }

  // 3. Record the boost usage
  await adminSupabase
    .from("listing_boosts")
    .insert({
      product_id: safeProductId,
      seller_id: userId,
      price_paid: 0, // Free from subscription
      duration_days: boostDuration,
      expires_at: expiresAt.toISOString(),
      is_active: true,
      currency: "EUR",
    })

  revalidateBoostCaches(safeProductId, userId)
  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle()
  revalidatePublicProfileTagsByUsername(sellerProfile?.username, "user")

  return {
    success: true,
    boostsRemaining: boostsRemaining - 1,
  }
}

// =============================================================================
// CREATE PAID BOOST CHECKOUT
// Creates a Stripe checkout session for purchasing a boost
// =============================================================================

export async function createBoostCheckoutSession(args: {
  productId: string
  durationDays: 7 | 14 | 30
  locale?: "en" | "bg"
}): Promise<CreateBoostCheckoutResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing")
    return errorEnvelope({ error: "Payment configuration is missing" })
  }

  const parsedArgs = CreateBoostCheckoutInputSchema.safeParse(args)
  if (!parsedArgs.success) {
    return errorEnvelope({ error: "Invalid input" })
  }

  const { productId, durationDays, locale = "en" } = parsedArgs.data

  const auth = await requireAuth()
  if (!auth) {
    return errorEnvelope({ error: "Not authenticated" })
  }

  const { user, supabase } = auth

  // Verify product ownership
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, seller_id, title, is_boosted")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    return errorEnvelope({ error: "Product not found" })
  }

  if (product.seller_id !== user.id) {
    return errorEnvelope({ error: "You can only boost your own products" })
  }

  if (product.is_boosted) {
    return errorEnvelope({ error: "Product is already boosted" })
  }

  // Get boost price
  const { data: boostPrice, error: priceError } = await supabase
    .from("boost_prices")
    .select("price")
    .eq("duration_days", durationDays)
    .eq("is_active", true)
    .single()

  if (priceError || !boostPrice) {
    return errorEnvelope({ error: "Boost price not found" })
  }

  try {
    // Get or create Stripe customer
    const { data: privateProfile } = await supabase
      .from("private_profiles")
      .select(STRIPE_CUSTOMER_ID_SELECT)
      .eq("id", user.id)
      .single()

    let customerId = privateProfile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        ...(user.email ? { email: user.email } : {}),
        metadata: {
          profile_id: user.id,
        },
      })
      customerId = customer.id

      await supabase
        .from("private_profiles")
        .upsert({ id: user.id, stripe_customer_id: customerId }, { onConflict: "id" })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const returnUrl = `${appUrl}/${locale}/account/listings`

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${durationDays}-Day Boost`,
              description: `Boost for "${product.title}"`,
            },
            unit_amount: Math.round(Number(boostPrice.price) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "listing_boost",
        product_id: productId,
        seller_id: user.id,
        duration_days: durationDays.toString(),
      },
      success_url: `${returnUrl}?boost=success&product=${productId}`,
      cancel_url: `${returnUrl}?boost=cancelled`,
    })

    return session.url
      ? successEnvelope({ url: session.url })
      : errorEnvelope({ error: "Failed to create checkout" })
  } catch (error) {
    console.error("Boost checkout error:", error)
    return errorEnvelope({ error: "Failed to create payment session" })
  }
}

// =============================================================================
// GET BOOST STATUS
// Returns the boost status for a product and user's remaining boosts
// =============================================================================

export async function getBoostStatus(productId: string): Promise<{
  success: boolean
  error?: string
  isBoosted?: boolean
  boostExpiresAt?: string | null
  boostsRemaining?: number
  boostsAllocated?: number
}> {
  const parsedProductId = BoostProductIdSchema.safeParse(productId)
  if (!parsedProductId.success) {
    return { success: false, error: "Invalid productId" }
  }

  const safeProductId = parsedProductId.data

  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }

  const { user, supabase } = auth

  // Get product info
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("is_boosted, boost_expires_at, seller_id")
    .eq("id", safeProductId)
    .single()

  if (productError || !product) {
    return { success: false, error: "Product not found" }
  }

  if (product.seller_id !== user.id) {
    return { success: false, error: "Not your product" }
  }

  // Get boost allocation
  const boostData = await syncProfileBoostCredits(user.id)

  return {
    success: true,
    isBoosted: product.is_boosted ?? false,
    boostExpiresAt: product.boost_expires_at,
    boostsRemaining: boostData?.boosts_remaining ?? 0,
    boostsAllocated: boostData?.boosts_allocated ?? 0,
  }
}
