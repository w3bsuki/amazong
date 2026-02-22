import { requireAuth } from "@/lib/auth/require-auth"
import { revalidateTag } from "next/cache"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { z } from "zod"

function isProbablyJunkTitle(title: string): boolean {
  const trimmed = title.trim()
  const compact = trimmed.replaceAll(/\s+/g, "")

  if (compact.length < 5) return true
  if (/^\d+$/.test(compact)) return true
  if (/^[^0-9A-Za-z\u0400-\u04FF]+$/.test(compact)) return true

  const digitCount = (compact.match(/\d/g) ?? []).length
  if (compact.length >= 10 && digitCount / compact.length > 0.8) return true

  const uniqueChars = new Set(compact.toLowerCase()).size
  if (compact.length >= 12 && uniqueChars <= 2) return true
  if (/^(.)\1{6,}$/.test(compact)) return true

  return false
}

export const listingTitleSchema = z
  .string()
  .trim()
  .min(5, "Title needs at least 5 characters")
  .max(255, "Title can't exceed 255 characters")
  .refine((value) => !/[<>{}[\]\\]/.test(value), "Title contains invalid characters")
  .refine((value) => !isProbablyJunkTitle(value), "Please enter a more descriptive title")

export const productSchema = z.object({
  title: listingTitleSchema,
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
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

export interface ProductAttributeInput {
  attributeId?: string | null
  name: string
  value: string
  isCustom?: boolean
}

export type ProductInput = z.infer<typeof productSchema> & {
  attributes?: ProductAttributeInput[]
}

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export const setDiscountSchema = z.object({
  productId: z.string().min(1),
  newPrice: z.coerce.number().positive(),
})

export const clearDiscountSchema = z.object({
  productId: z.string().min(1),
})

export type ProductFeedType = "deals" | "newest" | "bestsellers" | "featured" | "promo"

export const LEAF_CATEGORY_ERROR_MESSAGE = "Please select a more specific category (leaf category)"

export function isLeafCategoryError(
  error: { code?: string | null; message?: string | null } | null | undefined
): boolean {
  return (
    error?.code === "23514" &&
    typeof error.message === "string" &&
    error.message.includes("Category must be a leaf category")
  )
}

export async function requireProductAuth(
  errorMessage: string
): Promise<
  | {
      user: { id: string }
      supabase: SupabaseClient<Database>
    }
  | { error: string }
> {
  const auth = await requireAuth()
  if (!auth) {
    return { error: errorMessage }
  }

  return {
    user: { id: auth.user.id },
    supabase: auth.supabase,
  }
}

export function normalizeProductAttributes(input: unknown): ProductAttributeInput[] {
  if (!Array.isArray(input)) return []

  const output: ProductAttributeInput[] = []
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue

    const record = raw as Record<string, unknown>
    const name = typeof record.name === "string" ? record.name.trim() : ""
    const value = typeof record.value === "string" ? record.value.trim() : ""
    if (!name || !value) continue

    const attributeId =
      typeof record.attributeId === "string" && record.attributeId.length > 0 ? record.attributeId : null
    const isCustom = record.isCustom === true
    output.push({ name, value, attributeId, isCustom })
  }

  return output
}

export async function getCategorySlugsByIds(
  supabase: SupabaseClient<Database>,
  categoryIds: Array<string | null | undefined>
): Promise<string[]> {
  const ids = [...new Set(categoryIds.filter((id): id is string => typeof id === "string" && id.length > 0))]
  if (ids.length === 0) return []

  const { data } = await supabase.from("categories").select("id, slug").in("id", ids)

  const slugs = (data ?? [])
    .map((row) => row?.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)

  return [...new Set(slugs)]
}

export async function getCategorySlugsForProducts(
  supabase: SupabaseClient<Database>,
  productIds: string[]
): Promise<string[]> {
  const ids = [...new Set(productIds.filter((id) => typeof id === "string" && id.length > 0))]
  if (ids.length === 0) return []

  const { data: products } = await supabase
    .from("products")
    .select("id, category_id")
    .in("id", ids)

  const categoryIds = (products ?? [])
    .map((product) => product?.category_id)
    .filter((id): id is string => typeof id === "string" && id.length > 0)

  return getCategorySlugsByIds(supabase, categoryIds)
}

export async function revalidateProductCaches(params: {
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

  for (const tag of new Set(tags)) {
    revalidateTag(tag, "max")
  }
}
