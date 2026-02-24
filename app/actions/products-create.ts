"use server"

import {
  LEAF_CATEGORY_ERROR_MESSAGE,
  type ActionResult,
  type ProductInput,
  isLeafCategoryError,
  normalizeProductAttributes,
  productSchema,
  revalidateProductCaches,
  requireProductAuth,
} from "./products-shared"
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
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    const validated = productSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || "Invalid input" }
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
        return { success: false, error: categoryResolution.message }
      }

      resolvedCategoryId = categoryResolution.categoryId
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "Profile not found" }
    }

    if (!profile.username) {
      return { success: false, error: "You must set a username before listing products" }
    }

    if (data.status === "active") {
      const listingLimits = await getSellerListingLimitSnapshot(supabase, user.id)
      if (!listingLimits) {
        return { success: false, error: "Failed to verify listing limits" }
      }

      if (listingLimits.needsUpgrade) {
        return {
          success: false,
          error: `You have reached your listing limit (${listingLimits.currentListings} of ${listingLimits.maxListings}). Please upgrade your plan to add more listings.`,
        }
      }
    }

    const baseSlug = data.title
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "")
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
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
      })
      .select("id")
      .single()

    if (insertError) {
      if (
        insertError.code === "P0001" ||
        insertError.message?.toLowerCase().includes("listing limit reached")
      ) {
        return {
          success: false,
          error: "You have reached your listing limit. Please upgrade your plan to add more listings.",
        }
      }
      if (isLeafCategoryError(insertError)) {
        return { success: false, error: LEAF_CATEGORY_ERROR_MESSAGE }
      }
      logger.error("[createProduct] Insert error", insertError)
      return { success: false, error: insertError.message || "Failed to create product" }
    }

    const { error: privateError } = await supabase.from("product_private").insert({
      product_id: product.id,
      seller_id: user.id,
      cost_price: data.costPrice ?? null,
      sku: data.sku ?? null,
      barcode: data.barcode ?? null,
    })

    if (privateError) {
      logger.error("[createProduct] Product private insert error", privateError)
      await supabase.from("products").delete().eq("id", product.id)
      return { success: false, error: privateError.message || "Failed to save seller-only product fields" }
    }

    if (attributes.length > 0) {
      const attributeRows = attributes.map((attribute) => ({
        product_id: product.id,
        attribute_id: attribute.attributeId ?? null,
        name: attribute.name,
        value: attribute.value,
        is_custom: attribute.isCustom ?? false,
      }))

      const { error: attributeError } = await supabase.from("product_attributes").insert(attributeRows)

      if (attributeError) {
        logger.error("[createProduct] Product attributes insert error", attributeError)
        await supabase.from("products").delete().eq("id", product.id)
        return { success: false, error: attributeError.message || "Failed to create product" }
      }
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [product.id],
      categoryIds: [resolvedCategoryId],
      invalidateTypes: ["newest"],
    })

    return { success: true, data: { id: product.id } }
  } catch (error) {
    logger.error("[createProduct] Error", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Duplicate a product
 */
export async function duplicateProduct(productId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const auth = await requireProductAuth("You must be logged in to duplicate a product")
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    const duplicateSelect =
      "title,description,price,list_price,stock,track_inventory,category_id,weight,weight_unit,condition,images" as const

    const { data: original, error: fetchError } = await supabase
      .from("products")
      .select(duplicateSelect)
      .eq("id", productId)
      .eq("seller_id", user.id)
      .single()

    if (fetchError || !original) {
      return { success: false, error: "Product not found" }
    }

    const { data: originalPrivate } = await supabase
      .from("product_private")
      .select("cost_price, sku")
      .eq("product_id", productId)
      .eq("seller_id", user.id)
      .maybeSingle()

    const baseSlug = `${original.title}-copy`
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "")
    const newSlug = `${baseSlug}-${Date.now().toString(36)}`

    const duplicateInsert = await supabase
      .from("products")
      .insert({
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
      })
      .select("id")
      .single()

    let duplicate = duplicateInsert.data
    let insertError = duplicateInsert.error

    if (insertError && isLeafCategoryError(insertError)) {
      const fallbackInsert = await supabase
        .from("products")
        .insert({
          seller_id: user.id,
          title: `${original.title} (Copy)`,
          description: original.description,
          price: original.price,
          list_price: original.list_price,
          stock: original.stock,
          track_inventory: original.track_inventory,
          category_id: null,
          status: "draft",
          weight: original.weight,
          weight_unit: original.weight_unit,
          condition: original.condition,
          images: original.images,
          slug: newSlug,
        })
        .select("id")
        .single()

      duplicate = fallbackInsert.data
      insertError = fallbackInsert.error
    }

    if (insertError || !duplicate) {
      logger.error("[duplicateProduct] Insert error", insertError)
      return { success: false, error: "Failed to duplicate product" }
    }

    const { error: privateError } = await supabase.from("product_private").insert({
      product_id: duplicate.id,
      seller_id: user.id,
      cost_price: originalPrivate?.cost_price ?? null,
      sku: originalPrivate?.sku ? `${originalPrivate.sku}-COPY` : null,
      barcode: null,
    })

    if (privateError) {
      logger.error("[duplicateProduct] Product private insert error", privateError)
      await supabase.from("products").delete().eq("id", duplicate.id)
      return { success: false, error: "Failed to duplicate seller-only product fields" }
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [duplicate.id],
      categoryIds: [original.category_id],
    })

    return { success: true, data: { id: duplicate.id } }
  } catch (error) {
    logger.error("[duplicateProduct] Error", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
