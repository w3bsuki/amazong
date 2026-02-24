import {
  getBoostActionContext,
  getOwnedBoostProduct,
  syncProfileBoostCredits,
  type BoostStatusResult,
} from "./boosts-shared"

export async function getBoostStatusImpl(productId: string): Promise<BoostStatusResult> {
  const context = await getBoostActionContext(productId)
  if (!context.success) {
    return { success: false, error: context.error }
  }

  const { productId: safeProductId, userId, supabase } = context

  const ownedProductResult = await getOwnedBoostProduct(supabase, safeProductId, userId)
  if (!ownedProductResult.success) {
    return {
      success: false,
      error:
        ownedProductResult.error === "You can only boost your own products"
          ? "Not your product"
          : ownedProductResult.error,
    }
  }

  const product = ownedProductResult.product
  const boostData = await syncProfileBoostCredits(userId)

  return {
    success: true,
    isBoosted: product.is_boosted ?? false,
    boostExpiresAt: product.boost_expires_at,
    boostsRemaining: boostData?.boosts_remaining ?? 0,
    boostsAllocated: boostData?.boosts_allocated ?? 0,
  }
}
