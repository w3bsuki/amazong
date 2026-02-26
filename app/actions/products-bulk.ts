"use server"

import { revalidateTag } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  fail,
  listingTitleSchema,
  ok,
  revalidateProductCaches,
  requireProductAuth,
} from "./products-shared"
import { fetchCategorySlugsForProducts } from "@/lib/data/products/category-slugs"
import {
  bulkDeleteProducts as bulkDeleteProductsRows,
  bulkUpdateProductStatus as bulkUpdateProductStatusRows,
  fetchProductsForBulkTitleValidation,
} from "@/lib/data/products/mutations"
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
    return fail("Invalid input data")
  }

  const {
    productIds: validatedProductIds,
    status: validatedStatus,
  } = parsedInput.data

  try {
    const auth = await requireProductAuth("You must be logged in to update products")
    if ("error" in auth) {
      return fail(auth.error)
    }
    const { user, supabase } = auth

    if (validatedStatus === "active") {
      const titlesResult = await fetchProductsForBulkTitleValidation({
        supabase,
        sellerId: user.id,
        productIds: validatedProductIds,
      })

      if (!titlesResult.ok) {
        return fail("Failed to validate listing titles")
      }

      const titles = titlesResult.rows

      const invalidCount = (titles ?? []).filter((row) => {
        const title = typeof row?.title === "string" ? row.title : ""
        return !listingTitleSchema.safeParse(title).success
      }).length

      if (invalidCount > 0) {
        return fail("Some listings have invalid titles. Fix titles before publishing.")
      }

      const toActivateCount = (titles ?? []).filter((row) => row?.status !== "active").length
      if (toActivateCount > 0) {
        const listingLimits = await getSellerListingLimitSnapshot(supabase, user.id)
        if (!listingLimits) {
          return fail("Failed to verify listing limits")
        }

        if (
          !listingLimits.isUnlimited &&
          listingLimits.currentListings + toActivateCount > (listingLimits.maxListings ?? 0)
        ) {
          return fail(
            `Publishing ${toActivateCount} listing(s) would exceed your active listing limit (${listingLimits.currentListings} of ${listingLimits.maxListings}). Please upgrade your plan.`
          )
        }
      }
    }

    const updateResult = await bulkUpdateProductStatusRows({
      supabase,
      sellerId: user.id,
      productIds: validatedProductIds,
      status: validatedStatus,
      updatedAt: new Date().toISOString(),
    })

    if (!updateResult.ok) {
      if (
        updateResult.error.code === "P0001" ||
        updateResult.error.message?.toLowerCase().includes("listing limit reached")
      ) {
        return fail("You have reached your listing limit. Please upgrade your plan to publish more listings.")
      }
      logger.error("[bulkUpdateProductStatus] Update error", updateResult.error)
      return fail("Failed to update products")
    }

    const updatedIds = updateResult.updatedIds

    const categorySlugs = await fetchCategorySlugsForProducts(supabase, updatedIds)
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

    return ok({ updated: updatedIds.length })
  } catch (error) {
    logger.error("[bulkUpdateProductStatus] Error", error)
    return fail("An unexpected error occurred")
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
    return fail("Invalid input data")
  }

  const validatedProductIds = parsedProductIds.data

  try {
    const auth = await requireProductAuth("You must be logged in to delete products")
    if ("error" in auth) {
      return fail(auth.error)
    }
    const { user, supabase } = auth

    const deleteResult = await bulkDeleteProductsRows({
      supabase,
      sellerId: user.id,
      productIds: validatedProductIds,
    })

    if (!deleteResult.ok) {
      logger.error("[bulkDeleteProducts] Delete error", deleteResult.error)
      return fail("Failed to delete products")
    }

    const deletedIds = deleteResult.deletedIds

    const categorySlugs = await fetchCategorySlugsForProducts(supabase, deletedIds)
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

    return ok({ deleted: deletedIds.length })
  } catch (error) {
    logger.error("[bulkDeleteProducts] Error", error)
    return fail("An unexpected error occurred")
  }
}
