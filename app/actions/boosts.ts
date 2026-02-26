"use server"

import { createBoostCheckoutSessionImpl } from "./boosts-checkout"
import { getBoostStatusImpl } from "./boosts-status"
import { errorEnvelope } from "@/lib/api/envelope"
import { BoostProductIdSchema, CreateBoostCheckoutInputSchema } from "./boosts-shared"
import type { CreateBoostCheckoutArgs } from "./boosts-shared"
import type { BoostResult, BoostStatusResult, CreateBoostCheckoutResult } from "./boosts-shared"
import { useSubscriptionBoostImpl as runSubscriptionBoostImpl } from "./boosts-use-subscription"

export type { BoostResult, CreateBoostCheckoutResult } from "./boosts-shared"

export async function useSubscriptionBoost(productId: string): Promise<BoostResult> {
  const parsedProductId = BoostProductIdSchema.safeParse(productId)
  if (!parsedProductId.success) {
    return errorEnvelope({ error: "Invalid productId" })
  }

  return runSubscriptionBoostImpl(parsedProductId.data)
}

export async function createBoostCheckoutSession(
  args: CreateBoostCheckoutArgs
): Promise<CreateBoostCheckoutResult> {
  const parsedArgs = CreateBoostCheckoutInputSchema.safeParse(args)
  if (!parsedArgs.success) {
    return errorEnvelope({ error: "Invalid input" })
  }

  const safeArgs: CreateBoostCheckoutArgs = {
    productId: parsedArgs.data.productId,
    durationDays: parsedArgs.data.durationDays,
    ...(parsedArgs.data.locale ? { locale: parsedArgs.data.locale } : {}),
  }

  return createBoostCheckoutSessionImpl(safeArgs)
}

export async function getBoostStatus(productId: string): Promise<BoostStatusResult> {
  const parsedProductId = BoostProductIdSchema.safeParse(productId)
  if (!parsedProductId.success) {
    return errorEnvelope({
      error: "Invalid productId",
      isBoosted: false,
      boostExpiresAt: null,
      boostsRemaining: 0,
      boostsAllocated: 0,
    })
  }

  return getBoostStatusImpl(parsedProductId.data)
}
