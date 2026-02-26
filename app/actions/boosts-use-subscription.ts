import { revalidatePublicProfileTagsByUsername } from "@/lib/cache/revalidate-profile-tags"
import {
  fetchProfileUsername,
  insertListingBoost,
  updateProductBoostStatus,
  updateProfileBoostRemaining,
} from "@/lib/data/boosts"
import { createAdminClient } from "@/lib/supabase/server"
import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import {
  getOwnedBoostActionContext,
  revalidateBoostCaches,
  syncProfileBoostCredits,
  type BoostResult,
} from "./boosts-shared"

import { logger } from "@/lib/logger"
export async function useSubscriptionBoostImpl(productId: string): Promise<BoostResult> {
  const context = await getOwnedBoostActionContext(productId)
  if (!context.success) {
    return errorEnvelope({ error: context.error })
  }

  const { productId: safeProductId, userId, supabase, product } = context

  if (product.is_boosted) {
    return errorEnvelope({ error: "Product is already boosted" })
  }

  const boostData = await syncProfileBoostCredits({ supabase, userId })
  if (!boostData) {
    return errorEnvelope({ error: "Profile not found" })
  }

  const { boosts_remaining: boostsRemaining } = boostData

  if (boostsRemaining <= 0) {
    return errorEnvelope({ error: "No boosts remaining. Purchase more or upgrade your plan." })
  }

  const adminSupabase = createAdminClient()

  const deductResult = await updateProfileBoostRemaining({
    adminSupabase,
    userId,
    boostsRemaining: boostsRemaining - 1,
  })

  if (!deductResult.ok) {
    logger.error("Failed to deduct boost:", deductResult.error)
    return errorEnvelope({ error: "Failed to use boost. Please try again." })
  }

  const boostDuration = 7
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + boostDuration)

  const boostUpdateResult = await updateProductBoostStatus({
    adminSupabase,
    productId: safeProductId,
    isBoosted: true,
    boostExpiresAt: expiresAt.toISOString(),
    listingType: "boosted",
  })

  if (!boostUpdateResult.ok) {
    await updateProfileBoostRemaining({
      adminSupabase,
      userId,
      boostsRemaining,
    })

    logger.error("Failed to boost product:", boostUpdateResult.error)
    return errorEnvelope({ error: "Failed to boost product. Please try again." })
  }

  const listingBoostResult = await insertListingBoost({
    adminSupabase,
    productId: safeProductId,
    sellerId: userId,
    pricePaid: 0,
    durationDays: boostDuration,
    expiresAt: expiresAt.toISOString(),
    currency: "EUR",
  })

  if (!listingBoostResult.ok) {
    logger.error("Failed to insert listing boost record", listingBoostResult.error, {
      productId: safeProductId,
      userId,
    })
  }

  revalidateBoostCaches(safeProductId, userId)

  const usernameResult = await fetchProfileUsername({ supabase, userId })
  if (usernameResult.ok) {
    revalidatePublicProfileTagsByUsername(usernameResult.username, "user")
  }

  return successEnvelope({ boostsRemaining: boostsRemaining - 1 })
}
