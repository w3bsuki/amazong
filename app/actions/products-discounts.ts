"use server"

import {
  clearDiscountSchema,
  type ActionResult,
  revalidateProductCaches,
  requireProductAuth,
  setDiscountSchema,
} from "./products-shared"
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
      product: { category_id: string | null; list_price: unknown; price: unknown }
    }
  | { ok: false; result: ActionResult }
> {
  const auth = await requireProductAuth("You must be logged in to update a product")
  if ("error" in auth) {
    return { ok: false, result: { success: false, error: auth.error } }
  }
  const { user, supabase } = auth

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("id, seller_id, price, list_price, category_id")
    .eq("id", productId)
    .single()

  if (fetchError || !product) {
    return { ok: false, result: { success: false, error: "Product not found" } }
  }
  if (product.seller_id !== user.id) {
    return { ok: false, result: { success: false, error: "You don't have permission to edit this product" } }
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
      product: { category_id: string | null; list_price: unknown; price: unknown }
    }
  | { ok: false; result: ActionResult }
> {
  if (!parsed.success) {
    return { ok: false, result: { success: false, error: parsed.error.issues[0]?.message || "Invalid input" } }
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

    const currentPrice = Number(product.price)
    const currentListPrice = product.list_price == null ? null : Number(product.list_price)
    const compareAt = currentListPrice && currentListPrice > currentPrice ? currentListPrice : currentPrice

    if (!(data.newPrice < compareAt)) {
      return { success: false, error: "Discount price must be lower than the original price" }
    }

    const nextListPrice = currentListPrice && currentListPrice > currentPrice ? currentListPrice : currentPrice
    const computedSalePercent =
      nextListPrice > 0 ? Math.round(((nextListPrice - data.newPrice) / nextListPrice) * 100) : 0

    const { error: updateError } = await supabase
      .from("products")
      .update({
        price: data.newPrice,
        list_price: nextListPrice,
        is_on_sale: true,
        sale_percent: computedSalePercent,
        sale_end_date: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.productId)

    if (updateError) {
      logger.error("[setProductDiscountPrice] Update error:", updateError)
      return { success: false, error: updateError.message || "Failed to update product" }
    }

    await revalidateDiscountCaches({
      supabase,
      sellerId: user.id,
      productId: data.productId,
      categoryId: product.category_id,
    })

    return { success: true }
  } catch (error) {
    logger.error("[setProductDiscountPrice] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
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
      return { success: true }
    }

    const restorePrice = Number(product.list_price)

    const { error: updateError } = await supabase
      .from("products")
      .update({
        price: restorePrice,
        list_price: null,
        is_on_sale: false,
        sale_percent: 0,
        sale_end_date: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.productId)

    if (updateError) {
      logger.error("[clearProductDiscount] Update error:", updateError)
      return { success: false, error: updateError.message || "Failed to update product" }
    }

    await revalidateDiscountCaches({
      supabase,
      sellerId: user.id,
      productId: data.productId,
      categoryId: product.category_id,
    })

    return { success: true }
  } catch (error) {
    logger.error("[clearProductDiscount] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
