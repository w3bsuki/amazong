"use server"

import { createBoostCheckoutSessionImpl } from "./boosts-checkout"
import { getBoostStatusImpl } from "./boosts-status"
import type { CreateBoostCheckoutArgs } from "./boosts-shared"
import type { BoostResult, CreateBoostCheckoutResult } from "./boosts-shared"
import { useSubscriptionBoostImpl as runSubscriptionBoostImpl } from "./boosts-use-subscription"

export type { BoostResult, CreateBoostCheckoutResult } from "./boosts-shared"

export async function useSubscriptionBoost(productId: string): Promise<BoostResult> {
  return runSubscriptionBoostImpl(productId)
}

export async function createBoostCheckoutSession(
  args: CreateBoostCheckoutArgs
): Promise<CreateBoostCheckoutResult> {
  return createBoostCheckoutSessionImpl(args)
}

export async function getBoostStatus(productId: string): Promise<{
  success: boolean
  error?: string
  isBoosted?: boolean
  boostExpiresAt?: string | null
  boostsRemaining?: number
  boostsAllocated?: number
}> {
  return getBoostStatusImpl(productId)
}
