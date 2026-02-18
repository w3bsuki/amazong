"use server"

import {
  clearDiscountSchema,
  type ActionResult,
  revalidateProductCaches,
  requireProductAuth,
  setDiscountSchema,
} from "./products-shared"

/**
 * Set a discounted price for a product.
 */
export async function setProductDiscountPrice(
  productId: string,
  newPrice: number
): Promise<ActionResult> {
  try {
    const parsed = setDiscountSchema.safeParse({ productId, newPrice })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" }
    }

    const auth = await requireProductAuth("You must be logged in to update a product")
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, seller_id, price, list_price, category_id")
      .eq("id", parsed.data.productId)
      .single()

    if (fetchError || !product) {
      return { success: false, error: "Product not found" }
    }
    if (product.seller_id !== user.id) {
      return { success: false, error: "You don't have permission to edit this product" }
    }

    const currentPrice = Number(product.price)
    const currentListPrice = product.list_price == null ? null : Number(product.list_price)
    const compareAt = currentListPrice && currentListPrice > currentPrice ? currentListPrice : currentPrice

    if (!(parsed.data.newPrice < compareAt)) {
      return { success: false, error: "Discount price must be lower than the original price" }
    }

    const nextListPrice = currentListPrice && currentListPrice > currentPrice ? currentListPrice : currentPrice
    const computedSalePercent =
      nextListPrice > 0 ? Math.round(((nextListPrice - parsed.data.newPrice) / nextListPrice) * 100) : 0

    const { error: updateError } = await supabase
      .from("products")
      .update({
        price: parsed.data.newPrice,
        list_price: nextListPrice,
        is_on_sale: true,
        sale_percent: computedSalePercent,
        sale_end_date: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.productId)

    if (updateError) {
      console.error("[setProductDiscountPrice] Update error:", updateError)
      return { success: false, error: updateError.message || "Failed to update product" }
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [parsed.data.productId],
      categoryIds: [product.category_id],
      invalidateTypes: ["promo", "deals"],
    })

    return { success: true }
  } catch (error) {
    console.error("[setProductDiscountPrice] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Clear a product discount.
 */
export async function clearProductDiscount(productId: string): Promise<ActionResult> {
  try {
    const parsed = clearDiscountSchema.safeParse({ productId })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" }
    }

    const auth = await requireProductAuth("You must be logged in to update a product")
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, seller_id, price, list_price, category_id")
      .eq("id", parsed.data.productId)
      .single()

    if (fetchError || !product) {
      return { success: false, error: "Product not found" }
    }
    if (product.seller_id !== user.id) {
      return { success: false, error: "You don't have permission to edit this product" }
    }

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
      .eq("id", parsed.data.productId)

    if (updateError) {
      console.error("[clearProductDiscount] Update error:", updateError)
      return { success: false, error: updateError.message || "Failed to update product" }
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [parsed.data.productId],
      categoryIds: [product.category_id],
      invalidateTypes: ["promo", "deals"],
    })

    return { success: true }
  } catch (error) {
    console.error("[clearProductDiscount] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

