"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { z } from "zod"

// Product validation schema - matches database columns
const productSchema = z.object({
  title: z.string().min(1, "Product title is required").max(255),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(), // maps to list_price
  costPrice: z.coerce.number().min(0).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  barcode: z.string().max(50).optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  trackInventory: z.boolean().default(true),
  categoryId: z.string().optional().nullable(),
  status: z.enum(["active", "draft", "archived", "out_of_stock"]).default("draft"),
  weight: z.coerce.number().min(0).optional().nullable(),
  weightUnit: z.enum(["kg", "g", "lb", "oz"]).default("kg"),
  condition: z.enum(["new", "used", "refurbished", "like_new", "good", "fair"]).default("new"),
  images: z.array(z.string()).default([]),
})

export type ProductInput = z.infer<typeof productSchema>

interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

const setDiscountSchema = z.object({
  productId: z.string().min(1),
  newPrice: z.coerce.number().positive(),
})

const clearDiscountSchema = z.object({
  productId: z.string().min(1),
})

type ProductFeedType = "deals" | "newest" | "bestsellers" | "featured" | "promo"

async function getCategorySlugsByIds(
  supabase: SupabaseClient<Database>,
  categoryIds: Array<string | null | undefined>
): Promise<string[]> {
  const ids = Array.from(
    new Set(categoryIds.filter((id): id is string => typeof id === "string" && id.length > 0))
  )
  if (ids.length === 0) return []

  const { data } = await supabase
    .from("categories")
    .select("id, slug")
    .in("id", ids)

  const slugs = (data ?? [])
    .map((row) => row?.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)

  return Array.from(new Set(slugs))
}

async function getCategorySlugsForProducts(
  supabase: SupabaseClient<Database>,
  productIds: string[]
): Promise<string[]> {
  const ids = Array.from(new Set(productIds.filter((id) => typeof id === "string" && id.length > 0)))
  if (ids.length === 0) return []

  const { data: products } = await supabase
    .from("products")
    .select("id, category_id")
    .in("id", ids)

  const categoryIds = (products ?? [])
    .map((p) => p?.category_id)
    .filter((id): id is string => typeof id === "string" && id.length > 0)

  return getCategorySlugsByIds(supabase, categoryIds)
}

async function revalidateProductCaches(params: {
  supabase: SupabaseClient<Database>
  sellerId: string
  productIds?: string[]
  categoryIds?: Array<string | null | undefined>
  invalidateTypes?: ProductFeedType[]
}) {
  const { supabase, sellerId, productIds, categoryIds, invalidateTypes } = params

  const tags: string[] = []

  if (Array.isArray(productIds)) {
    for (const id of productIds) {
      if (typeof id === "string" && id.length > 0) tags.push(`product:${id}`)
    }
  }

  if (typeof sellerId === "string" && sellerId.length > 0) {
    tags.push(`seller-products-${sellerId}`, `seller-${sellerId}`)
  }

  const slugs = await getCategorySlugsByIds(supabase, categoryIds ?? [])
  for (const slug of slugs) {
    tags.push(`products:category:${slug}`)
  }

  for (const type of invalidateTypes ?? []) {
    tags.push(`products:type:${type}`)
  }

  for (const tag of Array.from(new Set(tags))) {
    revalidateTag(tag, "max")
  }
}

/**
 * Create a new product
 */
export async function createProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to create a product" }
    }
    
    // Validate input
    const validated = productSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || "Invalid input" }
    }
    
    const data = validated.data
    
    // Check if user has a username (required to sell)
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
    
    // Generate slug from title
    const baseSlug = data.title
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "")
    
    // Make slug unique by adding timestamp
    const slug = `${baseSlug}-${Date.now().toString(36)}`
    
    // Insert product with all business fields
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
        category_id: data.categoryId || null,
        status: data.status,
        weight: data.weight || null,
        weight_unit: data.weightUnit,
        condition: data.condition,
        images: data.images,
        slug: slug,
      })
      .select("id")
      .single()
    
    if (insertError) {
      console.error("[createProduct] Insert error:", insertError)
      return { success: false, error: insertError.message || "Failed to create product" }
    }

    const { error: privateError } = await supabase
      .from("product_private")
      .insert({
        product_id: product.id,
        seller_id: user.id,
        cost_price: data.costPrice ?? null,
        sku: data.sku ?? null,
        barcode: data.barcode ?? null,
      })

    if (privateError) {
      console.error("[createProduct] Product private insert error:", privateError)
      await supabase.from("products").delete().eq("id", product.id)
      return { success: false, error: privateError.message || "Failed to save seller-only product fields" }
    }

    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [product.id],
      categoryIds: [data.categoryId],
      invalidateTypes: ["newest"],
    })
    
    return { success: true, data: { id: product.id } }
  } catch (error) {
    console.error("[createProduct] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  productId: string, 
  input: Partial<ProductInput>
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to update a product" }
    }
    
    // Check product ownership
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id, seller_id, category_id")
      .eq("id", productId)
      .single()
    
    if (fetchError || !existingProduct) {
      return { success: false, error: "Product not found" }
    }
    
    if (existingProduct.seller_id !== user.id) {
      return { success: false, error: "You don't have permission to edit this product" }
    }
    
    // Build update object with all business fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    
    if (input.title !== undefined) updateData.title = input.title
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
    
    // Update product
    const { error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId)
    
    if (updateError) {
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

    const categoryIdsToInvalidate: Array<string | null | undefined> = [existingProduct.category_id]
    if (input.categoryId !== undefined) categoryIdsToInvalidate.push(input.categoryId)

    const invalidateTypes: ProductFeedType[] = []
    // Price / compare-at changes affect promo list rendering.
    if (input.price !== undefined || input.compareAtPrice !== undefined) invalidateTypes.push("promo")

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
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to delete a product" }
    }
    
    // Check product ownership
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
    
    // Delete product
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
    
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

/**
 * Bulk update product status
 */
export async function bulkUpdateProductStatus(
  productIds: string[],
  status: "active" | "draft" | "archived" | "out_of_stock"
): Promise<ActionResult<{ updated: number }>> {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to update products" }
    }
    
    // Update products (RLS will ensure user owns them)
    const { data, error: updateError } = await supabase
      .from("products")
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
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
 * Set a discounted price for a product.
 * - If product is not yet discounted, moves current price into list_price.
 * - Sets price to the new discounted price.
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

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to update a product" }
    }

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

    const computedSalePercent = nextListPrice > 0
      ? Math.round(((nextListPrice - parsed.data.newPrice) / nextListPrice) * 100)
      : 0

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
 * - Restores price from list_price and sets list_price to null.
 */
export async function clearProductDiscount(
  productId: string
): Promise<ActionResult> {
  try {
    const parsed = clearDiscountSchema.safeParse({ productId })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" }
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to update a product" }
    }

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

/**
 * Bulk delete products
 */
export async function bulkDeleteProducts(productIds: string[]): Promise<ActionResult<{ deleted: number }>> {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to delete products" }
    }
    
    // Delete products (RLS will ensure user owns them)
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

/**
 * Quick update product stock
 */
async function updateProductStock(
  productId: string, 
  stock: number
): Promise<ActionResult> {
  try {
    if (stock < 0) {
      return { success: false, error: "Stock cannot be negative" }
    }
    
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to update stock" }
    }
    
    // Update stock (RLS will ensure user owns the product)
    const { error: updateError } = await supabase
      .from("products")
      .update({ 
        stock, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", productId)
      .eq("seller_id", user.id)
    
    if (updateError) {
      console.error("[updateProductStock] Update error:", updateError)
      return { success: false, error: "Failed to update stock" }
    }

    // Stock changes may affect list badges; invalidate product + seller lists.
    await revalidateProductCaches({
      supabase,
      sellerId: user.id,
      productIds: [productId],
      categoryIds: [],
    })
    
    return { success: true }
  } catch (error) {
    console.error("[updateProductStock] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Duplicate a product
 */
  export async function duplicateProduct(productId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to duplicate a product" }
    }

    const DUPLICATE_PRODUCT_SELECT =
      'title,description,price,list_price,stock,track_inventory,category_id,weight,weight_unit,condition,images' as const
    
    // Fetch original product
    const { data: original, error: fetchError } = await supabase
      .from("products")
      .select(DUPLICATE_PRODUCT_SELECT)
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

    // Generate unique slug for duplicate
    const baseSlug = `${original.title}-copy`
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-|-$/g, "")
    const newSlug = `${baseSlug}-${Date.now().toString(36)}`
    
    // Create duplicate with all business fields
    const { data: duplicate, error: insertError } = await supabase
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
        status: "draft", // Duplicates start as draft
        weight: original.weight,
        weight_unit: original.weight_unit,
        condition: original.condition,
        images: original.images,
        slug: newSlug,
      })
      .select("id")
      .single()
    
    if (insertError) {
      console.error("[duplicateProduct] Insert error:", insertError)
      return { success: false, error: "Failed to duplicate product" }
    }

    const { error: privateError } = await supabase
      .from("product_private")
      .insert({
        product_id: duplicate.id,
        seller_id: user.id,
        cost_price: originalPrivate?.cost_price ?? null,
        sku: originalPrivate?.sku ? `${originalPrivate.sku}-COPY` : null,
        barcode: null, // Barcode should be unique, don't copy
      })

    if (privateError) {
      console.error("[duplicateProduct] Product private insert error:", privateError)
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
    console.error("[duplicateProduct] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
