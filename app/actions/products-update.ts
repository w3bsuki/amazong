"use server"

import {
  LEAF_CATEGORY_ERROR_MESSAGE,
  type ActionResult,
  type ProductFeedType,
  type ProductInput,
  fail,
  isLeafCategoryError,
  listingTitleSchema,
  ok,
  normalizeProductAttributes,
  revalidateProductCaches,
  requireProductAuth,
} from "./products-shared"
import { resolveLeafCategoryForListing } from "@/lib/sell/resolve-leaf-category"
import { getSellerListingLimitSnapshot } from "@/lib/subscriptions/listing-limits"
import type { Database } from "@/lib/supabase/database.types"
import {
  deleteProductAttributes,
  deleteProductById,
  fetchExistingProductForUpdate,
  insertProductAttributes,
  updateProduct as updateProductRow,
  upsertProductPrivate,
} from "@/lib/data/products/mutations"
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

type AuthedExistingProductResult =
  | {
      ok: true
      user: { id: string }
      supabase: ProductSupabaseClient
      existingProduct: ExistingProductForUpdate
    }
  | { ok: false; result: ActionResult }

async function requireAuthedExistingProduct(params: {
  productId: string
  authMessage: string
  permissionError: string
}): Promise<AuthedExistingProductResult> {
  const { productId, authMessage, permissionError } = params

  const auth = await requireProductAuth(authMessage)
  if ("error" in auth) {
    return { ok: false, result: fail(auth.error) }
  }
  const { user, supabase } = auth

  const existingProductResult = await fetchExistingProductForUpdate({ supabase, productId })
  if (!existingProductResult.ok || !existingProductResult.product) {
    return { ok: false, result: fail("Product not found") }
  }

  const existingProduct = existingProductResult.product
  if (existingProduct.seller_id !== user.id) {
    return { ok: false, result: fail(permissionError) }
  }

  return { ok: true, user, supabase, existingProduct }
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
  updateData: Database["public"]["Tables"]["products"]["Update"]
  error: string | null
} {
  const updateData: Database["public"]["Tables"]["products"]["Update"] = {
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
): Database["public"]["Tables"]["product_private"]["Insert"] {
  const privateUpdate: Database["public"]["Tables"]["product_private"]["Insert"] = {
    product_id: productId,
    seller_id: sellerId,
  }

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
}): Promise<ActionResult> {
  const { supabase, privateUpdate } = args
  if (Object.keys(privateUpdate).length <= 2) {
    return ok()
  }

  const result = await upsertProductPrivate({ supabase, upsert: privateUpdate })
  if (!result.ok) {
    logger.error("[updateProduct] Product private upsert error", result.error)
    return fail("Failed to save seller-only product fields")
  }

  return ok()
}

async function syncProductAttributes(args: {
  supabase: ProductSupabaseClient
  productId: string
  input: Partial<ProductInput>
}): Promise<ActionResult> {
  const { supabase, productId, input } = args
  const shouldUpdateAttributes = Object.prototype.hasOwnProperty.call(input, "attributes")
  if (!shouldUpdateAttributes) {
    return ok()
  }

  const attributes = normalizeProductAttributes((input as ProductInput).attributes)

  const deleteResult = await deleteProductAttributes({ supabase, productId })
  if (!deleteResult.ok) {
    logger.error("[updateProduct] Product attributes delete error", deleteResult.error)
    return fail("Failed to update product")
  }

  if (attributes.length === 0) {
    return ok()
  }

  const attributeRows = attributes.map((attribute) => ({
    product_id: productId,
    attribute_id: attribute.attributeId ?? null,
    name: attribute.name,
    value: attribute.value,
    is_custom: attribute.isCustom ?? false,
  }))

  const insertResult = await insertProductAttributes({ supabase, rows: attributeRows })
  if (!insertResult.ok) {
    logger.error("[updateProduct] Product attributes insert error", insertResult.error)
    return fail("Failed to update product")
  }

  return ok()
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
    const ctx = await requireAuthedExistingProduct({
      productId,
      authMessage: "You must be logged in to update a product",
      permissionError: "You don't have permission to edit this product",
    })
    if (!ctx.ok) return ctx.result

    const { user, supabase, existingProduct } = ctx

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
        return fail(categoryResolution.message)
      }

      resolvedInput.categoryId = categoryResolution.categoryId
    }

    const activationError = await validateProductActivation({
      supabase,
      userId: user.id,
      existingProduct,
      input: resolvedInput,
    })
    if (activationError) {
      return fail(activationError)
    }

    const { updateData, error: updateDataError } = buildProductUpdateData(resolvedInput)
    if (updateDataError) {
      return fail(updateDataError)
    }

    const updateResult = await updateProductRow({ supabase, productId, update: updateData })
    if (!updateResult.ok) {
      const mappedError = getUpdateProductErrorMessage(updateResult.error)
      if (mappedError) {
        return fail(mappedError)
      }
      logger.error("[updateProduct] Update error", updateResult.error)
      return fail("Failed to update product")
    }

    const privateUpdate = buildPrivateUpdatePayload(productId, user.id, resolvedInput)
    const privateUpdateResult = await savePrivateProductFields({
      supabase,
      privateUpdate,
    })
    if (!privateUpdateResult.success) {
      return fail(privateUpdateResult.error)
    }

    const attributesResult = await syncProductAttributes({ supabase, productId, input: resolvedInput })
    if (!attributesResult.success) {
      return fail(attributesResult.error)
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

    return ok()
  } catch (error) {
    logger.error("[updateProduct] Error", error)
    return fail("An unexpected error occurred")
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    const ctx = await requireAuthedExistingProduct({
      productId,
      authMessage: "You must be logged in to delete a product",
      permissionError: "You don't have permission to delete this product",
    })
    if (!ctx.ok) return ctx.result

    const { user, supabase, existingProduct } = ctx

    const deleteResult = await deleteProductById({ supabase, productId })
    if (!deleteResult.ok) {
      logger.error("[deleteProduct] Delete error", deleteResult.error)
      return fail("Failed to delete product")
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [productId],
      categoryIds: [existingProduct.category_id],
      invalidateTypes: ["newest", "promo", "deals", "featured", "bestsellers"],
    })

    return ok()
  } catch (error) {
    logger.error("[deleteProduct] Error", error)
    return fail("An unexpected error occurred")
  }
}
