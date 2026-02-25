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
import { resolveLeafCategoryForListing } from "@/lib/sell/resolve-leaf-category"
import { getSellerListingLimitSnapshot } from "@/lib/subscriptions/listing-limits"
import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"

import { logger } from "@/lib/logger"
type ProductSupabaseClient = SupabaseClient<Database>

type ExistingProductForUpdate = {
  id: string
  seller_id: string
  category_id: string | null
  title: string
  status: string | null
}

async function validateProductActivation(args: {
  supabase: ProductSupabaseClient
  userId: string
  existingProduct: ExistingProductForUpdate
  input: Partial<ProductInput>
}): Promise<string | null> {
  const { supabase, userId, existingProduct, input } = args
  if (input.status !== "active") return null

  const nextTitle = input.title ?? existingProduct.title
  const parsedTitle = listingTitleSchema.safeParse(nextTitle)
  if (!parsedTitle.success) {
    return parsedTitle.error.issues[0]?.message || "Invalid title"
  }

  if (existingProduct.status === "active") return null

  const listingLimits = await getSellerListingLimitSnapshot(supabase, userId)
  if (!listingLimits) {
    return "Failed to verify listing limits"
  }

  if (listingLimits.needsUpgrade) {
    return `You have reached your listing limit (${listingLimits.currentListings} of ${listingLimits.maxListings}). Please upgrade your plan to add more listings.`
  }

  return null
}

function buildProductUpdateData(input: Partial<ProductInput>): {
  updateData: Record<string, unknown>
  error: string | null
} {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (input.title !== undefined) {
    const parsedTitle = listingTitleSchema.safeParse(input.title)
    if (!parsedTitle.success) {
      return { updateData, error: parsedTitle.error.issues[0]?.message || "Invalid title" }
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

  return { updateData, error: null }
}

function getUpdateProductErrorMessage(error: { code?: string; message?: string | null }): string | null {
  if (error.code === "P0001" || error.message?.toLowerCase().includes("listing limit reached")) {
    return "You have reached your listing limit. Please upgrade your plan to add more listings."
  }
  if (isLeafCategoryError(error)) {
    return LEAF_CATEGORY_ERROR_MESSAGE
  }
  return null
}

function buildPrivateUpdatePayload(
  productId: string,
  sellerId: string,
  input: Partial<ProductInput>
): {
  product_id: string
  seller_id: string
  cost_price?: number | null
  sku?: string | null
  barcode?: string | null
} {
  const privateUpdate: {
    product_id: string
    seller_id: string
    cost_price?: number | null
    sku?: string | null
    barcode?: string | null
  } = { product_id: productId, seller_id: sellerId }

  if (input.costPrice !== undefined) privateUpdate.cost_price = input.costPrice
  if (input.sku !== undefined) privateUpdate.sku = input.sku
  if (input.barcode !== undefined) privateUpdate.barcode = input.barcode

  return privateUpdate
}

async function savePrivateProductFields(args: {
  supabase: ProductSupabaseClient
  privateUpdate: {
    product_id: string
    seller_id: string
    cost_price?: number | null
    sku?: string | null
    barcode?: string | null
  }
}): Promise<{ success: true } | { success: false; error: string }> {
  const { supabase, privateUpdate } = args
  if (Object.keys(privateUpdate).length <= 2) {
    return { success: true }
  }

  const { error: privateError } = await supabase
    .from("product_private")
    .upsert(privateUpdate, { onConflict: "product_id" })

  if (privateError) {
    logger.error("[updateProduct] Product private upsert error", privateError)
    return { success: false, error: "Failed to save seller-only product fields" }
  }

  return { success: true }
}

async function syncProductAttributes(args: {
  supabase: ProductSupabaseClient
  productId: string
  input: Partial<ProductInput>
}): Promise<{ success: true } | { success: false; error: string }> {
  const { supabase, productId, input } = args
  const shouldUpdateAttributes = Object.prototype.hasOwnProperty.call(input, "attributes")
  if (!shouldUpdateAttributes) {
    return { success: true }
  }

  const attributes = normalizeProductAttributes((input as ProductInput).attributes)

  const { error: deleteError } = await supabase
    .from("product_attributes")
    .delete()
    .eq("product_id", productId)

  if (deleteError) {
    logger.error("[updateProduct] Product attributes delete error", deleteError)
    return { success: false, error: "Failed to update product" }
  }

  if (attributes.length === 0) {
    return { success: true }
  }

  const attributeRows = attributes.map((attribute) => ({
    product_id: productId,
    attribute_id: attribute.attributeId ?? null,
    name: attribute.name,
    value: attribute.value,
    is_custom: attribute.isCustom ?? false,
  }))

  const { error: insertError } = await supabase.from("product_attributes").insert(attributeRows)

  if (insertError) {
    logger.error("[updateProduct] Product attributes insert error", insertError)
    return { success: false, error: "Failed to update product" }
  }

  return { success: true }
}

function resolveInvalidateTypes(input: Partial<ProductInput>): ProductFeedType[] {
  const invalidateTypes: ProductFeedType[] = []
  if (input.price !== undefined || input.compareAtPrice !== undefined) {
    invalidateTypes.push("promo")
  }
  return invalidateTypes
}

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
      .select("id, seller_id, category_id, title, status")
      .eq("id", productId)
      .single()

    if (fetchError || !existingProduct) {
      return { success: false, error: "Product not found" }
    }

    if (existingProduct.seller_id !== user.id) {
      return { success: false, error: "You don't have permission to edit this product" }
    }

    const resolvedInput: Partial<ProductInput> = { ...input }
    if (Object.prototype.hasOwnProperty.call(input, "categoryId") && input.categoryId) {
      const categoryResolution = await resolveLeafCategoryForListing({
        supabase,
        selectedCategoryId: input.categoryId,
        context: {
          title: input.title ?? existingProduct.title,
          description: input.description,
          attributes: normalizeProductAttributes(input.attributes).map((attribute) => ({
            name: attribute.name,
            value: attribute.value,
          })),
        },
      })

      if (!categoryResolution.ok) {
        return { success: false, error: categoryResolution.message }
      }

      resolvedInput.categoryId = categoryResolution.categoryId
    }

    const activationError = await validateProductActivation({
      supabase,
      userId: user.id,
      existingProduct: existingProduct as ExistingProductForUpdate,
      input: resolvedInput,
    })
    if (activationError) {
      return { success: false, error: activationError }
    }

    const { updateData, error: updateDataError } = buildProductUpdateData(resolvedInput)
    if (updateDataError) {
      return { success: false, error: updateDataError }
    }

    const { error: updateError } = await supabase.from("products").update(updateData).eq("id", productId)

    if (updateError) {
      const mappedError = getUpdateProductErrorMessage(updateError)
      if (mappedError) {
        return { success: false, error: mappedError }
      }
      logger.error("[updateProduct] Update error", updateError)
      return { success: false, error: "Failed to update product" }
    }

    const privateUpdate = buildPrivateUpdatePayload(productId, user.id, resolvedInput)
    const privateUpdateResult = await savePrivateProductFields({
      supabase,
      privateUpdate,
    })
    if (!privateUpdateResult.success) {
      return { success: false, error: privateUpdateResult.error }
    }

    const attributesResult = await syncProductAttributes({ supabase, productId, input: resolvedInput })
    if (!attributesResult.success) {
      return { success: false, error: attributesResult.error }
    }

    const categoryIdsToInvalidate: Array<string | null | undefined> = [existingProduct.category_id]
    if (resolvedInput.categoryId !== undefined) categoryIdsToInvalidate.push(resolvedInput.categoryId)

    const invalidateTypes = resolveInvalidateTypes(resolvedInput)

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [productId],
      categoryIds: categoryIdsToInvalidate,
      invalidateTypes,
    })

    return { success: true }
  } catch (error) {
    logger.error("[updateProduct] Error", error)
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
      logger.error("[deleteProduct] Delete error", deleteError)
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
    logger.error("[deleteProduct] Error", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
