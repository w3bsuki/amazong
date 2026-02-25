import { requireAuth } from "@/lib/auth/require-auth"
import type { Envelope } from "@/lib/api/envelope"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"
import { normalizePlanTier } from "@/lib/subscriptions/normalize-tier"
import type { Database } from "@/lib/supabase/database.types"
import { z } from "zod"

import { logger } from "@/lib/logger"
export interface BoostResult {
  success: boolean
  error?: string
  boostsRemaining?: number
}

export type CreateBoostCheckoutResult = Envelope<
  { url: string },
  { error: string }
>

export type CreateBoostCheckoutArgs = {
  productId: string
  durationDays: 7 | 14 | 30
  locale?: "en" | "bg"
}

export type BoostStatusResult = {
  success: boolean
  error?: string
  isBoosted?: boolean
  boostExpiresAt?: string | null
  boostsRemaining?: number
  boostsAllocated?: number
}

export type ProfileBoostData = {
  boosts_remaining: number
  boosts_allocated: number
  boosts_reset_at: string | null
  account_type: Database["public"]["Tables"]["profiles"]["Row"]["account_type"]
  tier: Database["public"]["Tables"]["profiles"]["Row"]["tier"]
}

export const BoostProductIdSchema = z.string().uuid()
export const BoostDurationDaysSchema = z.union([z.literal(7), z.literal(14), z.literal(30)])
export const BoostLocaleSchema = z.enum(["en", "bg"])
export const CreateBoostCheckoutInputSchema = z.object({
  productId: BoostProductIdSchema,
  durationDays: BoostDurationDaysSchema,
  locale: BoostLocaleSchema.optional(),
})

export type BoostActionContext =
  | {
      success: true
      productId: string
      userId: string
      userEmail: string | null
      supabase: Awaited<ReturnType<typeof createClient>>
    }
  | {
      success: false
      error: string
    }

export type OwnedBoostProduct = {
  id: string
  seller_id: string
  is_boosted: boolean | null
  boost_expires_at: string | null
  title: string | null
}

export async function getBoostActionContext(productId: string): Promise<BoostActionContext> {
  const parsedProductId = BoostProductIdSchema.safeParse(productId)
  if (!parsedProductId.success) {
    return { success: false, error: "Invalid productId" }
  }

  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Not authenticated" }
  }

  return {
    success: true,
    productId: parsedProductId.data,
    userId: auth.user.id,
    userEmail: auth.user.email ?? null,
    supabase: auth.supabase,
  }
}

export async function getOwnedBoostProduct(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  userId: string
): Promise<{ success: true; product: OwnedBoostProduct } | { success: false; error: string }> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, seller_id, is_boosted, boost_expires_at, title")
    .eq("id", productId)
    .single<OwnedBoostProduct>()

  if (productError || !product) {
    return { success: false, error: "Product not found" }
  }

  if (product.seller_id !== userId) {
    return { success: false, error: "You can only boost your own products" }
  }

  return { success: true, product }
}

export type OwnedBoostActionContext =
  | {
      success: true
      productId: string
      userId: string
      supabase: Awaited<ReturnType<typeof createClient>>
      product: OwnedBoostProduct
    }
  | {
      success: false
      error: string
    }

export async function getOwnedBoostActionContext(productId: string): Promise<OwnedBoostActionContext> {
  const context = await getBoostActionContext(productId)
  if (!context.success) {
    return context
  }

  const ownedProductResult = await getOwnedBoostProduct(context.supabase, context.productId, context.userId)
  if (!ownedProductResult.success) {
    return { success: false, error: ownedProductResult.error }
  }

  return {
    success: true,
    productId: context.productId,
    userId: context.userId,
    supabase: context.supabase,
    product: ownedProductResult.product,
  }
}

export function revalidateBoostCaches(productId: string, userId: string) {
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

export async function syncProfileBoostCredits(userId: string): Promise<ProfileBoostData | null> {
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
      logger.error("Failed to sync subscription boost credits:", syncError)
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
