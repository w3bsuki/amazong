import { revalidatePublicProfileTagsByUsername } from "@/lib/cache/revalidate-profile-tags"
import type { Database } from "@/lib/supabase/database.types"
import { createAdminClient } from "@/lib/supabase/server"
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
    return { success: false, error: context.error }
  }

  const { productId: safeProductId, userId, supabase, product } = context

  if (product.is_boosted) {
    return { success: false, error: "Product is already boosted" }
  }

  const boostData = await syncProfileBoostCredits(userId)
  if (!boostData) {
    return { success: false, error: "Profile not found" }
  }

  const { boosts_remaining: boostsRemaining } = boostData

  if (boostsRemaining <= 0) {
    return { success: false, error: "No boosts remaining. Purchase more or upgrade your plan." }
  }

  const adminSupabase = createAdminClient()

  const deductUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
    boosts_remaining: boostsRemaining - 1,
  }
  const { error: deductError } = await adminSupabase
    .from("profiles")
    .update(deductUpdate)
    .eq("id", userId)

  if (deductError) {
    logger.error("Failed to deduct boost:", deductError)
    return { success: false, error: "Failed to use boost. Please try again." }
  }

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
    const rollbackUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
      boosts_remaining: boostsRemaining,
    }
    await adminSupabase
      .from("profiles")
      .update(rollbackUpdate)
      .eq("id", userId)

    logger.error("Failed to boost product:", boostError)
    return { success: false, error: "Failed to boost product. Please try again." }
  }

  await adminSupabase
    .from("listing_boosts")
    .insert({
      product_id: safeProductId,
      seller_id: userId,
      price_paid: 0,
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
