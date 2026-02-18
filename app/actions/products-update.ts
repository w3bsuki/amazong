"use server"

import {
  LEAF_CATEGORY_ERROR_MESSAGE,
  type ActionResult,
  type ProductFeedType,
  type ProductInput,
  isLeafCategoryError,
  listingTitleSchema,
  normalizeProductAttributes,
  revalidateProductCaches,
  requireProductAuth,
} from "./products-shared"

/**
 * Update an existing product
 */
export async function updateProduct(
  productId: string,
  input: Partial<ProductInput>
): Promise<ActionResult> {
  try {
    const auth = await requireProductAuth("You must be logged in to update a product")
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id, seller_id, category_id, title")
      .eq("id", productId)
      .single()

    if (fetchError || !existingProduct) {
      return { success: false, error: "Product not found" }
    }

    if (existingProduct.seller_id !== user.id) {
      return { success: false, error: "You don't have permission to edit this product" }
    }

    if (input.status === "active") {
      const nextTitle = input.title ?? existingProduct.title
      const parsedTitle = listingTitleSchema.safeParse(nextTitle)
      if (!parsedTitle.success) {
        return { success: false, error: parsedTitle.error.issues[0]?.message || "Invalid title" }
      }
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.title !== undefined) {
      const parsedTitle = listingTitleSchema.safeParse(input.title)
      if (!parsedTitle.success) {
        return { success: false, error: parsedTitle.error.issues[0]?.message || "Invalid title" }
      }
      updateData.title = parsedTitle.data
    }
    if (input.description !== undefined) updateData.description = input.description
    if (input.price !== undefined) updateData.price = input.price
    if (input.compareAtPrice !== undefined) updateData.list_price = input.compareAtPrice
    if (input.stock !== undefined) updateData.stock = input.stock
    if (input.trackInventory !== undefined) updateData.track_inventory = input.trackInventory
    if (input.categoryId !== undefined) updateData.category_id = input.categoryId
    if (input.status !== undefined) updateData.status = input.status
    if (input.weight !== undefined) updateData.weight = input.weight
    if (input.weightUnit !== undefined) updateData.weight_unit = input.weightUnit
    if (input.condition !== undefined) updateData.condition = input.condition
    if (input.images !== undefined) updateData.images = input.images

    const { error: updateError } = await supabase.from("products").update(updateData).eq("id", productId)

    if (updateError) {
      if (isLeafCategoryError(updateError)) {
        return { success: false, error: LEAF_CATEGORY_ERROR_MESSAGE }
      }
      console.error("[updateProduct] Update error:", updateError)
      return { success: false, error: "Failed to update product" }
    }

    const privateUpdate: {
      product_id: string
      seller_id: string
      cost_price?: number | null
      sku?: string | null
      barcode?: string | null
    } = { product_id: productId, seller_id: user.id }

    if (input.costPrice !== undefined) privateUpdate.cost_price = input.costPrice
    if (input.sku !== undefined) privateUpdate.sku = input.sku
    if (input.barcode !== undefined) privateUpdate.barcode = input.barcode

    if (Object.keys(privateUpdate).length > 2) {
      const { error: privateError } = await supabase
        .from("product_private")
        .upsert(privateUpdate, { onConflict: "product_id" })

      if (privateError) {
        console.error("[updateProduct] Product private upsert error:", privateError)
        return { success: false, error: "Failed to save seller-only product fields" }
      }
    }

    const shouldUpdateAttributes = Object.prototype.hasOwnProperty.call(input, "attributes")
    if (shouldUpdateAttributes) {
      const attributes = normalizeProductAttributes((input as ProductInput).attributes)

      const { error: deleteError } = await supabase
        .from("product_attributes")
        .delete()
        .eq("product_id", productId)

      if (deleteError) {
        console.error("[updateProduct] Product attributes delete error:", deleteError)
        return { success: false, error: "Failed to update product" }
      }

      if (attributes.length > 0) {
        const attributeRows = attributes.map((attribute) => ({
          product_id: productId,
          attribute_id: attribute.attributeId ?? null,
          name: attribute.name,
          value: attribute.value,
          is_custom: attribute.isCustom ?? false,
        }))

        const { error: insertError } = await supabase.from("product_attributes").insert(attributeRows)

        if (insertError) {
          console.error("[updateProduct] Product attributes insert error:", insertError)
          return { success: false, error: "Failed to update product" }
        }
      }
    }

    const categoryIdsToInvalidate: Array<string | null | undefined> = [existingProduct.category_id]
    if (input.categoryId !== undefined) categoryIdsToInvalidate.push(input.categoryId)

    const invalidateTypes: ProductFeedType[] = []
    if (input.price !== undefined || input.compareAtPrice !== undefined) {
      invalidateTypes.push("promo")
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [productId],
      categoryIds: categoryIdsToInvalidate,
      invalidateTypes,
    })

    return { success: true }
  } catch (error) {
    console.error("[updateProduct] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    const auth = await requireProductAuth("You must be logged in to delete a product")
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id, seller_id, category_id")
      .eq("id", productId)
      .single()

    if (fetchError || !existingProduct) {
      return { success: false, error: "Product not found" }
    }

    if (existingProduct.seller_id !== user.id) {
      return { success: false, error: "You don't have permission to delete this product" }
    }

    const { error: deleteError } = await supabase.from("products").delete().eq("id", productId)

    if (deleteError) {
      console.error("[deleteProduct] Delete error:", deleteError)
      return { success: false, error: "Failed to delete product" }
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [productId],
      categoryIds: [existingProduct.category_id],
      invalidateTypes: ["newest", "promo", "deals", "featured", "bestsellers"],
    })

    return { success: true }
  } catch (error) {
    console.error("[deleteProduct] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
