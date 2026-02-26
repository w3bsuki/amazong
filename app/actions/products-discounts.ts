"use server"

import {
  clearDiscountSchema,
  type ActionResult,
  fail,
  ok,
  revalidateProductCaches,
  requireProductAuth,
  setDiscountSchema,
} from "./products-shared"
import {
  fetchExistingProductForUpdate,
  updateProduct as updateProductRow,
} from "@/lib/data/products/mutations"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

import { logger } from "@/lib/logger"
type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: Array<{ message?: string }> } }

async function requireAuthedProductForDiscountUpdate(
  productId: string
): Promise<
  | {
      ok: true
      user: { id: string }
      supabase: SupabaseClient<Database>
      product: { category_id: string | null; list_price: number | null; price: number }
    }
  | { ok: false; result: ActionResult }
> {
  const auth = await requireProductAuth("You must be logged in to update a product")
  if ("error" in auth) {
    return { ok: false, result: fail(auth.error) }
  }
  const { user, supabase } = auth

  const productResult = await fetchExistingProductForUpdate({ supabase, productId })
  if (!productResult.ok || !productResult.product) {
    return { ok: false, result: fail("Product not found") }
  }

  const product = productResult.product
  if (product.seller_id !== user.id) {
    return { ok: false, result: fail("You don't have permission to edit this product") }
  }

  return { ok: true, user, supabase, product }
}

async function parseAndRequireDiscountUpdate<T extends { productId: string }>(
  parsed: SafeParseResult<T>
): Promise<
  | {
      ok: true
      data: T
      user: { id: string }
      supabase: SupabaseClient<Database>
      product: { category_id: string | null; list_price: number | null; price: number }
    }
  | { ok: false; result: ActionResult }
> {
  if (!parsed.success) {
    return { ok: false, result: fail(parsed.error.issues[0]?.message || "Invalid input") }
  }

  const authed = await requireAuthedProductForDiscountUpdate(parsed.data.productId)
  if (!authed.ok) {
    return { ok: false, result: authed.result }
  }

  return { ok: true, data: parsed.data, user: authed.user, supabase: authed.supabase, product: authed.product }
}

async function revalidateDiscountCaches({
  supabase,
  sellerId,
  productId,
  categoryId,
}: {
  supabase: SupabaseClient<Database>
  sellerId: string
  productId: string
  categoryId: string | null
}) {
  await revalidateProductCaches({
    supabase,
    sellerId,
    productIds: [productId],
    categoryIds: [categoryId],
    invalidateTypes: ["promo", "deals"],
  })
}

async function applyDiscountUpdate(params: {
  supabase: SupabaseClient<Database>
  sellerId: string
  productId: string
  categoryId: string | null
  update: Database["public"]["Tables"]["products"]["Update"]
  logPrefix: "setProductDiscountPrice" | "clearProductDiscount"
}): Promise<ActionResult> {
  const { supabase, sellerId, productId, categoryId, update, logPrefix } = params

  const updateResult = await updateProductRow({
    supabase,
    productId,
    update,
  })

  if (!updateResult.ok) {
    logger.error(`[${logPrefix}] Update error:`, updateResult.error)
    return fail(updateResult.error.message || "Failed to update product")
  }

  await revalidateDiscountCaches({
    supabase,
    sellerId,
    productId,
    categoryId,
  })

  return ok()
}

/**
 * Set a discounted price for a product.
 */
export async function setProductDiscountPrice(
  productId: string,
  newPrice: number
): Promise<ActionResult> {
  try {
    const ctx = await parseAndRequireDiscountUpdate(setDiscountSchema.safeParse({ productId, newPrice }))
    if (!ctx.ok) return ctx.result

    const { data, user, supabase, product } = ctx

    const currentPrice = product.price
    const currentListPrice = product.list_price
    const compareAt = currentListPrice && currentListPrice > currentPrice ? currentListPrice : currentPrice

    if (!(data.newPrice < compareAt)) {
      return fail("Discount price must be lower than the original price")
    }

    const nextListPrice = currentListPrice && currentListPrice > currentPrice ? currentListPrice : currentPrice
    const computedSalePercent =
      nextListPrice > 0 ? Math.round(((nextListPrice - data.newPrice) / nextListPrice) * 100) : 0

    return await applyDiscountUpdate({
      supabase,
      sellerId: user.id,
      productId: data.productId,
      categoryId: product.category_id,
      logPrefix: "setProductDiscountPrice",
      update: {
        price: data.newPrice,
        list_price: nextListPrice,
        is_on_sale: true,
        sale_percent: computedSalePercent,
        sale_end_date: null,
        updated_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    logger.error("[setProductDiscountPrice] Error:", error)
    return fail("An unexpected error occurred")
  }
}

/**
 * Clear a product discount.
 */
export async function clearProductDiscount(productId: string): Promise<ActionResult> {
  try {
    const ctx = await parseAndRequireDiscountUpdate(clearDiscountSchema.safeParse({ productId }))
    if (!ctx.ok) return ctx.result

    const { data, user, supabase, product } = ctx

    if (product.list_price == null) {
      return ok()
    }

    const restorePrice = product.list_price

    return await applyDiscountUpdate({
      supabase,
      sellerId: user.id,
      productId: data.productId,
      categoryId: product.category_id,
      logPrefix: "clearProductDiscount",
      update: {
        price: restorePrice,
        list_price: null,
        is_on_sale: false,
        sale_percent: 0,
        sale_end_date: null,
        updated_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    logger.error("[clearProductDiscount] Error:", error)
    return fail("An unexpected error occurred")
  }
}
