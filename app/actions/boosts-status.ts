import {
  getOwnedBoostActionContext,
  syncProfileBoostCredits,
  type BoostStatusResult,
} from "./boosts-shared"
import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"

export async function getBoostStatusImpl(productId: string): Promise<BoostStatusResult> {
  const context = await getOwnedBoostActionContext(productId)
  if (!context.success) {
    const error =
      context.error === "You can only boost your own products"
        ? "Not your product"
        : context.error

    return errorEnvelope({
      error,
      isBoosted: false,
      boostExpiresAt: null,
      boostsRemaining: 0,
      boostsAllocated: 0,
    })
  }

  const { userId, product, supabase } = context
  const boostData = await syncProfileBoostCredits({ supabase, userId })

  return successEnvelope({
    isBoosted: product.is_boosted ?? false,
    boostExpiresAt: product.boost_expires_at,
    boostsRemaining: boostData?.boosts_remaining ?? 0,
    boostsAllocated: boostData?.boosts_allocated ?? 0,
  })
}
