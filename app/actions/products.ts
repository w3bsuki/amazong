"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
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
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" }
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
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    
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
        cost_price: data.costPrice || null,
        sku: data.sku || null,
        barcode: data.barcode || null,
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
    
    // Revalidate dashboard pages
    revalidatePath("/dashboard/products")
    revalidatePath("/dashboard")
    
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
      .select("id, seller_id")
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
    if (input.costPrice !== undefined) updateData.cost_price = input.costPrice
    if (input.sku !== undefined) updateData.sku = input.sku
    if (input.barcode !== undefined) updateData.barcode = input.barcode
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
    
    // Revalidate pages
    revalidatePath("/dashboard/products")
    revalidatePath("/dashboard")
    revalidatePath(`/product/${productId}`)
    
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
      .select("id, seller_id")
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
    
    // Revalidate pages
    revalidatePath("/dashboard/products")
    revalidatePath("/dashboard")
    
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
    
    // Revalidate pages
    revalidatePath("/dashboard/products")
    revalidatePath("/dashboard")
    
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
      return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" }
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to update a product" }
    }

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, seller_id, price, list_price")
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

    const { error: updateError } = await supabase
      .from("products")
      .update({
        price: parsed.data.newPrice,
        list_price: nextListPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.productId)

    if (updateError) {
      console.error("[setProductDiscountPrice] Update error:", updateError)
      return { success: false, error: updateError.message || "Failed to update product" }
    }

    revalidatePath("/account/selling")
    revalidatePath("/[locale]/account/selling", "page")
    revalidatePath(`/product/${parsed.data.productId}`)
    revalidatePath(`/[locale]/product/${parsed.data.productId}`, "page")

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
      return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" }
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to update a product" }
    }

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, seller_id, price, list_price")
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.productId)

    if (updateError) {
      console.error("[clearProductDiscount] Update error:", updateError)
      return { success: false, error: updateError.message || "Failed to update product" }
    }

    revalidatePath("/account/selling")
    revalidatePath("/[locale]/account/selling", "page")
    revalidatePath(`/product/${parsed.data.productId}`)
    revalidatePath(`/[locale]/product/${parsed.data.productId}`, "page")

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
    
    // Revalidate pages
    revalidatePath("/dashboard/products")
    revalidatePath("/dashboard")
    
    return { success: true, data: { deleted: data?.length || 0 } }
  } catch (error) {
    console.error("[bulkDeleteProducts] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Quick update product stock
 */
export async function updateProductStock(
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
    
    // Revalidate pages
    revalidatePath("/dashboard/products")
    revalidatePath("/dashboard/inventory")
    
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
    
    // Fetch original product
    const { data: original, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("seller_id", user.id)
      .single()
    
    if (fetchError || !original) {
      return { success: false, error: "Product not found" }
    }
    
    // Generate unique slug for duplicate
    const baseSlug = `${original.title}-copy`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
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
        cost_price: original.cost_price,
        sku: original.sku ? `${original.sku}-COPY` : null,
        barcode: null, // Barcode should be unique, don't copy
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
    
    // Revalidate pages
    revalidatePath("/dashboard/products")
    
    return { success: true, data: { id: duplicate.id } }
  } catch (error) {
    console.error("[duplicateProduct] Error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
