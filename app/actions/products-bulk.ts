"use server"

import { revalidateTag } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  getCategorySlugsForProducts,
  listingTitleSchema,
  revalidateProductCaches,
  requireProductAuth,
} from "./products-shared"
import { getSellerListingLimitSnapshot } from "@/lib/subscriptions/listing-limits"
import { logger } from "@/lib/logger"

const ProductIdSchema = z.string().uuid()
const ProductIdsSchema = z.array(ProductIdSchema).min(1)
const ProductStatusSchema = z.enum(["active", "draft", "archived", "out_of_stock"])
const BulkUpdateProductStatusSchema = z.object({
  productIds: ProductIdsSchema,
  status: ProductStatusSchema,
})

/**
 * Bulk update product status
 */
export async function bulkUpdateProductStatus(
  productIds: string[],
  status: "active" | "draft" | "archived" | "out_of_stock"
): Promise<ActionResult<{ updated: number }>> {
  const parsedInput = BulkUpdateProductStatusSchema.safeParse({ productIds, status })
  if (!parsedInput.success) {
    return { success: false, error: "Invalid input data" }
  }

  const {
    productIds: validatedProductIds,
    status: validatedStatus,
  } = parsedInput.data

  try {
    const auth = await requireProductAuth("You must be logged in to update products")
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    if (validatedStatus === "active") {
      const { data: titles, error: titleError } = await supabase
        .from("products")
        .select("id,title,status")
        .eq("seller_id", user.id)
        .in("id", validatedProductIds)

      if (titleError) {
        return { success: false, error: "Failed to validate listing titles" }
      }

      const invalidCount = (titles ?? []).filter((row) => {
        const title = typeof row?.title === "string" ? row.title : ""
        return !listingTitleSchema.safeParse(title).success
      }).length

      if (invalidCount > 0) {
        return {
          success: false,
          error: "Some listings have invalid titles. Fix titles before publishing.",
        }
      }

      const toActivateCount = (titles ?? []).filter((row) => row?.status !== "active").length
      if (toActivateCount > 0) {
        const listingLimits = await getSellerListingLimitSnapshot(supabase, user.id)
        if (!listingLimits) {
          return { success: false, error: "Failed to verify listing limits" }
        }

        if (
          !listingLimits.isUnlimited &&
          listingLimits.currentListings + toActivateCount > (listingLimits.maxListings ?? 0)
        ) {
          return {
            success: false,
            error: `Publishing ${toActivateCount} listing(s) would exceed your active listing limit (${listingLimits.currentListings} of ${listingLimits.maxListings}). Please upgrade your plan.`,
          }
        }
      }
    }

    const { data, error: updateError } = await supabase
      .from("products")
      .update({
        status: validatedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("seller_id", user.id)
      .in("id", validatedProductIds)
      .select("id")

    if (updateError) {
      if (
        updateError.code === "P0001" ||
        updateError.message?.toLowerCase().includes("listing limit reached")
      ) {
        return {
          success: false,
          error: "You have reached your listing limit. Please upgrade your plan to publish more listings.",
        }
      }
      logger.error("[bulkUpdateProductStatus] Update error", updateError)
      return { success: false, error: "Failed to update products" }
    }

    const updatedIds = (data ?? [])
      .map((row) => row?.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0)

    const categorySlugs = await getCategorySlugsForProducts(supabase, updatedIds)
    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: updatedIds,
      categoryIds: [],
      invalidateTypes: ["newest", "promo", "deals", "featured", "bestsellers"],
    })
    for (const slug of categorySlugs) {
      revalidateTag(`products:category:${slug}`, "max")
    }

    return { success: true, data: { updated: data?.length || 0 } }
  } catch (error) {
    logger.error("[bulkUpdateProductStatus] Error", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Bulk delete products
 */
export async function bulkDeleteProducts(
  productIds: string[]
): Promise<ActionResult<{ deleted: number }>> {
  const parsedProductIds = ProductIdsSchema.safeParse(productIds)
  if (!parsedProductIds.success) {
    return { success: false, error: "Invalid input data" }
  }

  const validatedProductIds = parsedProductIds.data

  try {
    const auth = await requireProductAuth("You must be logged in to delete products")
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    const { data, error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("seller_id", user.id)
      .in("id", validatedProductIds)
      .select("id")

    if (deleteError) {
      logger.error("[bulkDeleteProducts] Delete error", deleteError)
      return { success: false, error: "Failed to delete products" }
    }

    const deletedIds = (data ?? [])
      .map((row) => row?.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0)

    const categorySlugs = await getCategorySlugsForProducts(supabase, deletedIds)
    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: deletedIds,
      categoryIds: [],
      invalidateTypes: ["newest", "promo", "deals", "featured", "bestsellers"],
    })
    for (const slug of categorySlugs) {
      revalidateTag(`products:category:${slug}`, "max")
    }

    return { success: true, data: { deleted: data?.length || 0 } }
  } catch (error) {
    logger.error("[bulkDeleteProducts] Error", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
