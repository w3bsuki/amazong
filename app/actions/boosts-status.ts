import {
  getOwnedBoostActionContext,
  syncProfileBoostCredits,
  type BoostStatusResult,
} from "./boosts-shared"

export async function getBoostStatusImpl(productId: string): Promise<BoostStatusResult> {
  const context = await getOwnedBoostActionContext(productId)
  if (!context.success) {
    return {
      success: false,
      error:
        context.error === "You can only boost your own products"
          ? "Not your product"
          : context.error,
    }
  }

  const { userId, product } = context
  const boostData = await syncProfileBoostCredits(userId)

  return {
    success: true,
    isBoosted: product.is_boosted ?? false,
    boostExpiresAt: product.boost_expires_at,
    boostsRemaining: boostData?.boosts_remaining ?? 0,
    boostsAllocated: boostData?.boosts_allocated ?? 0,
  }
}
