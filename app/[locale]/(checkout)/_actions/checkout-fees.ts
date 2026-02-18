"use server"

import type { CartItem } from "@/components/providers/cart-context"
import { createClient } from "@/lib/supabase/server"
import { calculateTransactionFees, getFeesForSeller } from "@/lib/stripe-connect"

import { hasValidCartItems } from "./checkout-helpers"

export type CheckoutFeeQuoteResult = { ok: true; buyerProtectionFee: number } | { ok: false }

export async function getCheckoutFeeQuote(items: CartItem[]): Promise<CheckoutFeeQuoteResult> {
  if (!hasValidCartItems(items)) {
    return { ok: false }
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const userId = user?.id

    const productIds = items.map((item) => item.id).filter(Boolean)

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, seller_id, title")
      .in("id", productIds)

    if (productsError || !products) {
      return { ok: false }
    }

    if (userId) {
      const ownsAny = products.some((p) => p.seller_id === userId)
      if (ownsAny) {
        return { ok: false }
      }
    }

    const sellerIds = [...new Set(products.map((p) => p.seller_id).filter(Boolean))]
    if (sellerIds.length !== 1) {
      return { ok: false }
    }

    const sellerId = sellerIds[0]
    if (!sellerId) {
      return { ok: false }
    }

    const fees = await getFeesForSeller(sellerId)
    const itemTotalEur = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
    const feeBreakdown = calculateTransactionFees(itemTotalEur, fees)

    return { ok: true, buyerProtectionFee: feeBreakdown.buyerProtectionFee }
  } catch {
    return { ok: false }
  }
}
