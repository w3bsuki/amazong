import { requireAuth } from "@/lib/auth/require-auth"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import {
  fetchBoostsIncludedForTier,
  fetchLatestActiveSubscriptionPlanType,
  fetchOwnedBoostProduct,
  fetchProfileBoostData,
  updateProfileBoostCredits,
} from "@/lib/data/boosts"
import { createAdminClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"
import { normalizePlanTier } from "@/lib/subscriptions/normalize-tier"
import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"
import { z } from "zod"

import { logger } from "@/lib/logger"
type DbClient = SupabaseClient<Database>
export type BoostResult = Envelope<
  { boostsRemaining: number },
  { error: string }
>

export type CreateBoostCheckoutResult = Envelope<
  { url: string },
  { error: string }
>

export type CreateBoostCheckoutArgs = {
  productId: string
  durationDays: 7 | 14 | 30
  locale?: "en" | "bg"
}

export type BoostStatusResult = Envelope<
  {
    isBoosted: boolean
    boostExpiresAt: string | null
    boostsRemaining: number
    boostsAllocated: number
  },
  {
    error: string
    isBoosted: boolean
    boostExpiresAt: string | null
    boostsRemaining: number
    boostsAllocated: number
  }
>

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

export type BoostActionContext = Envelope<
  {
    productId: string
    userId: string
    userEmail: string | null
    supabase: DbClient
  },
  { error: string }
>

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
    return errorEnvelope({ error: "Invalid productId" })
  }

  const auth = await requireAuth()
  if (!auth) {
    return errorEnvelope({ error: "Not authenticated" })
  }

  return successEnvelope({
    productId: parsedProductId.data,
    userId: auth.user.id,
    userEmail: auth.user.email ?? null,
    supabase: auth.supabase,
  })
}

export async function getOwnedBoostProduct(
  supabase: DbClient,
  productId: string,
  userId: string
): Promise<Envelope<{ product: OwnedBoostProduct }, { error: string }>> {
  const productResult = await fetchOwnedBoostProduct({ supabase, productId })
  if (!productResult.ok || !productResult.product) {
    return errorEnvelope({ error: "Product not found" })
  }

  const product = productResult.product

  if (product.seller_id !== userId) {
    return errorEnvelope({ error: "You can only boost your own products" })
  }

  return successEnvelope({ product })
}

export type OwnedBoostActionContext = Envelope<
  {
    productId: string
    userId: string
    supabase: DbClient
    product: OwnedBoostProduct
  },
  { error: string }
>

export async function getOwnedBoostActionContext(productId: string): Promise<OwnedBoostActionContext> {
  const context = await getBoostActionContext(productId)
  if (!context.success) {
    return context
  }

  const ownedProductResult = await getOwnedBoostProduct(context.supabase, context.productId, context.userId)
  if (!ownedProductResult.success) {
    return errorEnvelope({ error: ownedProductResult.error })
  }

  return successEnvelope({
    productId: context.productId,
    userId: context.userId,
    supabase: context.supabase,
    product: ownedProductResult.product,
  })
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

function getNextMonthlyResetAtISO(baseDate: Date): string {
  const nextUtcMonth = new Date(
    Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, 1, 0, 0, 0, 0)
  )
  return nextUtcMonth.toISOString()
}

export async function syncProfileBoostCredits(params: {
  supabase: DbClient
  userId: string
}): Promise<ProfileBoostData | null> {
  const { supabase, userId } = params

  const profileResult = await fetchProfileBoostData({ supabase, userId })
  if (!profileResult.ok) {
    logger.error("Failed to load profile boosts", profileResult.error)
    return null
  }

  const profileBoosts = profileResult.profile
  if (!profileBoosts) return null

  const accountType = profileBoosts.account_type === "business" ? "business" : "personal"

  const subscriptionResult = await fetchLatestActiveSubscriptionPlanType({
    supabase,
    sellerId: userId,
  })

  const normalizedTier = normalizePlanTier(
    (subscriptionResult.ok ? subscriptionResult.planType : null) ?? profileBoosts.tier
  )

  const tierPlanResult = await fetchBoostsIncludedForTier({
    supabase,
    tier: normalizedTier,
    accountType,
  })

  let boostsIncluded = tierPlanResult.ok ? tierPlanResult.boostsIncluded : null
  if (boostsIncluded == null) {
    const freePlanResult = await fetchBoostsIncludedForTier({
      supabase,
      tier: "free",
      accountType,
    })
    boostsIncluded = freePlanResult.ok ? freePlanResult.boostsIncluded : null
  }

  const boostsIncludedNumber = Number(boostsIncluded ?? 0)

  const now = new Date()
  const parsedResetAt = profileBoosts.boosts_reset_at ? new Date(profileBoosts.boosts_reset_at) : null
  const needsMonthlyReset =
    !parsedResetAt || Number.isNaN(parsedResetAt.getTime()) || parsedResetAt <= now

  const nextAllocated = boostsIncludedNumber
  const nextRemaining = needsMonthlyReset
    ? boostsIncludedNumber
    : Math.min(profileBoosts.boosts_remaining, boostsIncludedNumber)
  const nextResetAt = needsMonthlyReset
    ? getNextMonthlyResetAtISO(now)
    : profileBoosts.boosts_reset_at

  const changed =
    nextAllocated !== profileBoosts.boosts_allocated ||
    nextRemaining !== profileBoosts.boosts_remaining ||
    nextResetAt !== profileBoosts.boosts_reset_at

  if (changed) {
    const adminSupabase = createAdminClient()
    const syncResult = await updateProfileBoostCredits({
      adminSupabase,
      userId,
      boostsAllocated: nextAllocated,
      boostsRemaining: nextRemaining,
      boostsResetAt: nextResetAt,
    })

    if (!syncResult.ok) {
      logger.error("Failed to sync subscription boost credits:", syncResult.error)
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
