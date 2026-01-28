"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { revalidatePath } from "next/cache"

// =============================================================================
// TYPES
// =============================================================================

export interface BoostResult {
  success: boolean
  error?: string
  boostsRemaining?: number
}

export interface CreateBoostCheckoutResult {
  url?: string
  error?: string
}

// Helper to get boost columns (not in generated types yet)
interface ProfileBoostData {
  boosts_remaining: number
  boosts_allocated: number
  boosts_reset_at: string | null
}

async function getProfileBoosts(userId: string): Promise<ProfileBoostData | null> {
  const supabase = await createClient()
  if (!supabase) return null

  // Use select("*") and cast since new columns aren't in generated types
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (!data) return null

  // Cast to access new columns
  const profile = data as Record<string, unknown>
  return {
    boosts_remaining: (profile.boosts_remaining as number) ?? 0,
    boosts_allocated: (profile.boosts_allocated as number) ?? 0,
    boosts_reset_at: (profile.boosts_reset_at as string) ?? null,
  }
}

// =============================================================================
// USE FREE BOOST (from subscription)
// Deducts one boost from the seller's allocation
// =============================================================================

export async function useSubscriptionBoost(productId: string): Promise<BoostResult> {
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database connection failed" }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Verify the product belongs to the user
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, seller_id, is_boosted")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    return { success: false, error: "Product not found" }
  }

  if (product.seller_id !== user.id) {
    return { success: false, error: "You can only boost your own products" }
  }

  if (product.is_boosted) {
    return { success: false, error: "Product is already boosted" }
  }

  // Get user's boost allocation
  const boostData = await getProfileBoosts(user.id)
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
  const { error: deductError } = await adminSupabase
    .from("profiles")
    .update({ boosts_remaining: boostsRemaining - 1 } as Record<string, unknown>)
    .eq("id", user.id)

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
    .eq("id", productId)

  if (boostError) {
    // Rollback: restore the boost count
    await adminSupabase
      .from("profiles")
      .update({ boosts_remaining: boostsRemaining } as Record<string, unknown>)
      .eq("id", user.id)

    console.error("Failed to boost product:", boostError)
    return { success: false, error: "Failed to boost product. Please try again." }
  }

  // 3. Record the boost usage
  await adminSupabase
    .from("listing_boosts")
    .insert({
      product_id: productId,
      seller_id: user.id,
      price_paid: 0, // Free from subscription
      duration_days: boostDuration,
      expires_at: expiresAt.toISOString(),
      is_active: true,
      currency: "EUR",
    })

  // Revalidate relevant paths
  revalidatePath("/[locale]/(account)/account", "layout")
  revalidatePath("/[locale]/products", "layout")

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
    return { error: "Payment configuration is missing" }
  }

  const { productId, durationDays, locale = "en" } = args

  const supabase = await createClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Verify product ownership
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, seller_id, title, is_boosted")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    return { error: "Product not found" }
  }

  if (product.seller_id !== user.id) {
    return { error: "You can only boost your own products" }
  }

  if (product.is_boosted) {
    return { error: "Product is already boosted" }
  }

  // Get boost price
  const { data: boostPrice, error: priceError } = await supabase
    .from("boost_prices")
    .select("price")
    .eq("duration_days", durationDays)
    .eq("is_active", true)
    .single()

  if (priceError || !boostPrice) {
    return { error: "Boost price not found" }
  }

  try {
    // Get or create Stripe customer
    const { data: privateProfile } = await supabase
      .from("private_profiles")
      .select("stripe_customer_id")
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

    return session.url ? { url: session.url } : { error: "Failed to create checkout" }
  } catch (error) {
    console.error("Boost checkout error:", error)
    return { error: "Failed to create payment session" }
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
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Database connection failed" }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get product info
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("is_boosted, boost_expires_at, seller_id")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    return { success: false, error: "Product not found" }
  }

  if (product.seller_id !== user.id) {
    return { success: false, error: "Not your product" }
  }

  // Get boost allocation
  const boostData = await getProfileBoosts(user.id)

  return {
    success: true,
    isBoosted: product.is_boosted ?? false,
    boostExpiresAt: product.boost_expires_at,
    boostsRemaining: boostData?.boosts_remaining ?? 0,
    boostsAllocated: boostData?.boosts_allocated ?? 0,
  }
}
