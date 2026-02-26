"use server"

import {
  LEAF_CATEGORY_ERROR_MESSAGE,
  type ActionResult,
  type ProductInput,
  fail,
  isLeafCategoryError,
  ok,
  normalizeProductAttributes,
  productSchema,
  revalidateProductCaches,
  requireProductAuth,
} from "./products-shared"
import type { Database } from "@/lib/supabase/database.types"
import {
  deleteProductById,
  fetchProductForDuplicate,
  fetchProductPrivateForDuplicate,
  fetchSellerProfileUsername,
  insertProductAttributes,
  insertProductPrivate,
  insertProductReturningId,
} from "@/lib/data/products/mutations"
import { resolveLeafCategoryForListing } from "@/lib/sell/resolve-leaf-category"
import { getSellerListingLimitSnapshot } from "@/lib/subscriptions/listing-limits"

import { logger } from "@/lib/logger"
/**
 * Create a new product
 */
export async function createProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  try {
    const auth = await requireProductAuth("You must be logged in to create a product")
    if ("error" in auth) {
      return fail(auth.error)
    }
    const { user, supabase } = auth

    const validated = productSchema.safeParse(input)
    if (!validated.success) {
      return fail(validated.error.issues[0]?.message || "Invalid input")
    }

    const data = validated.data
    const attributes = normalizeProductAttributes(input.attributes)
    let resolvedCategoryId = data.categoryId ?? null

    if (resolvedCategoryId) {
      const categoryResolution = await resolveLeafCategoryForListing({
        supabase,
        selectedCategoryId: resolvedCategoryId,
        context: {
          title: data.title,
          description: data.description,
          attributes: attributes.map((attribute) => ({
            name: attribute.name,
            value: attribute.value,
          })),
        },
      })

      if (!categoryResolution.ok) {
        return fail(categoryResolution.message)
      }

      resolvedCategoryId = categoryResolution.categoryId
    }

    const profileResult = await fetchSellerProfileUsername({ supabase, userId: user.id })
    if (!profileResult.ok || !profileResult.profile) {
      return fail("Profile not found")
    }

    if (!profileResult.profile.username) {
      return fail("You must set a username before listing products")
    }

    if (data.status === "active") {
      const listingLimits = await getSellerListingLimitSnapshot(supabase, user.id)
      if (!listingLimits) {
        return fail("Failed to verify listing limits")
      }

      if (listingLimits.needsUpgrade) {
        return fail(
          `You have reached your listing limit (${listingLimits.currentListings} of ${listingLimits.maxListings}). Please upgrade your plan to add more listings.`
        )
      }
    }

    const baseSlug = data.title
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "")
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    const productInsert: Database["public"]["Tables"]["products"]["Insert"] = {
      seller_id: user.id,
      title: data.title,
      description: data.description || null,
      price: data.price,
      list_price: data.compareAtPrice || null,
      stock: data.stock,
      track_inventory: data.trackInventory,
      category_id: resolvedCategoryId,
      status: data.status,
      weight: data.weight || null,
      weight_unit: data.weightUnit,
      condition: data.condition,
      images: data.images,
      slug,
    }

    const productInsertResult = await insertProductReturningId({ supabase, insert: productInsert })

    if (!productInsertResult.ok) {
      const insertError = productInsertResult.error
      if (insertError.code === "P0001" || insertError.message?.toLowerCase().includes("listing limit reached")) {
        return fail("You have reached your listing limit. Please upgrade your plan to add more listings.")
      }
      if (isLeafCategoryError(insertError)) {
        return fail(LEAF_CATEGORY_ERROR_MESSAGE)
      }
      logger.error("[createProduct] Insert error", insertError)
      return fail(insertError.message || "Failed to create product")
    }

    const productId = productInsertResult.id

    const privateInsert: Database["public"]["Tables"]["product_private"]["Insert"] = {
      product_id: productId,
      seller_id: user.id,
      cost_price: data.costPrice ?? null,
      sku: data.sku ?? null,
      barcode: data.barcode ?? null,
    }

    const privateInsertResult = await insertProductPrivate({ supabase, insert: privateInsert })

    if (!privateInsertResult.ok) {
      logger.error("[createProduct] Product private insert error", privateInsertResult.error)
      await deleteProductById({ supabase, productId })
      return fail(privateInsertResult.error.message || "Failed to save seller-only product fields")
    }

    if (attributes.length > 0) {
      const attributeRows: Array<Database["public"]["Tables"]["product_attributes"]["Insert"]> = attributes.map(
        (attribute) => ({
          product_id: productId,
        attribute_id: attribute.attributeId ?? null,
        name: attribute.name,
        value: attribute.value,
        is_custom: attribute.isCustom ?? false,
      }))

      const attributeInsertResult = await insertProductAttributes({ supabase, rows: attributeRows })

      if (!attributeInsertResult.ok) {
        logger.error("[createProduct] Product attributes insert error", attributeInsertResult.error)
        await deleteProductById({ supabase, productId })
        return fail(attributeInsertResult.error.message || "Failed to create product")
      }
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [productId],
      categoryIds: [resolvedCategoryId],
      invalidateTypes: ["newest"],
    })

    return ok({ id: productId })
  } catch (error) {
    logger.error("[createProduct] Error", error)
    return fail("An unexpected error occurred")
  }
}

/**
 * Duplicate a product
 */
export async function duplicateProduct(productId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const auth = await requireProductAuth("You must be logged in to duplicate a product")
    if ("error" in auth) {
      return fail(auth.error)
    }
    const { user, supabase } = auth

    const originalResult = await fetchProductForDuplicate({
      supabase,
      productId,
      sellerId: user.id,
    })
    if (!originalResult.ok || !originalResult.product) {
      return fail("Product not found")
    }

    const original = originalResult.product

    const originalPrivateResult = await fetchProductPrivateForDuplicate({
      supabase,
      productId,
      sellerId: user.id,
    })

    const originalPrivate = originalPrivateResult.ok ? originalPrivateResult.private : null

    const baseSlug = `${original.title}-copy`
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "")
    const newSlug = `${baseSlug}-${Date.now().toString(36)}`

    const duplicateInsert: Database["public"]["Tables"]["products"]["Insert"] = {
      seller_id: user.id,
      title: `${original.title} (Copy)`,
      description: original.description,
      price: original.price,
      list_price: original.list_price,
      stock: original.stock,
      track_inventory: original.track_inventory,
      category_id: original.category_id,
      status: "draft",
      weight: original.weight,
      weight_unit: original.weight_unit,
      condition: original.condition,
      images: original.images,
      slug: newSlug,
    }

    let duplicateResult = await insertProductReturningId({ supabase, insert: duplicateInsert })

    if (!duplicateResult.ok && isLeafCategoryError(duplicateResult.error)) {
      duplicateResult = await insertProductReturningId({
        supabase,
        insert: { ...duplicateInsert, category_id: null },
      })
    }

    if (!duplicateResult.ok) {
      logger.error("[duplicateProduct] Insert error", duplicateResult.error)
      return fail("Failed to duplicate product")
    }

    const duplicateId = duplicateResult.id

    const privateInsert: Database["public"]["Tables"]["product_private"]["Insert"] = {
      product_id: duplicateId,
      seller_id: user.id,
      cost_price: originalPrivate?.cost_price ?? null,
      sku: originalPrivate?.sku ? `${originalPrivate.sku}-COPY` : null,
      barcode: null,
    }

    const privateResult = await insertProductPrivate({ supabase, insert: privateInsert })

    if (!privateResult.ok) {
      logger.error("[duplicateProduct] Product private insert error", privateResult.error)
      await deleteProductById({ supabase, productId: duplicateId })
      return fail("Failed to duplicate seller-only product fields")
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [duplicateId],
      categoryIds: [original.category_id],
    })

    return ok({ id: duplicateId })
  } catch (error) {
    logger.error("[duplicateProduct] Error", error)
    return fail("An unexpected error occurred")
  }
}
