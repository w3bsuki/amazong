"use server"

import { revalidateTag } from "next/cache"
import {
  type ActionResult,
  getCategorySlugsForProducts,
  listingTitleSchema,
  revalidateProductCaches,
  requireProductAuth,
} from "./products-shared"

/**
 * Bulk update product status
 */
export async function bulkUpdateProductStatus(
  productIds: string[],
  status: "active" | "draft" | "archived" | "out_of_stock"
): Promise<ActionResult<{ updated: number }>> {
  try {
    const auth = await requireProductAuth("You must be logged in to update products")
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { user, supabase } = auth

    if (status === "active") {
      const { data: titles, error: titleError } = await supabase
        .from("products")
        .select("id,title")
        .eq("seller_id", user.id)
        .in("id", productIds)

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
    }

    const { data, error: updateError } = await supabase
      .from("products")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("seller_id", user.id)
      .in("id", productIds)
      .select("id")

    if (updateError) {
      console.error("[bulkUpdateProductStatus] Update error:", updateError)
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
    console.error("[bulkUpdateProductStatus] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Bulk delete products
 */
export async function bulkDeleteProducts(
  productIds: string[]
): Promise<ActionResult<{ deleted: number }>> {
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
      .in("id", productIds)
      .select("id")

    if (deleteError) {
      console.error("[bulkDeleteProducts] Delete error:", deleteError)
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
    console.error("[bulkDeleteProducts] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

