"use server"

import { z } from "zod"
import { sellFormSchemaV4 } from "@/lib/sell/schema"
import { createClient } from "@/lib/supabase/server"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import { resolveLeafCategoryForListing } from "@/lib/sell/resolve-leaf-category"
import { getSellerListingLimitSnapshot } from "@/lib/subscriptions/listing-limits"
import { requireAuth } from "@/lib/auth/require-auth"
import { logger } from "@/lib/logger"

export type CreateListingResult =
  | {
      success: true
      id: string
      sellerUsername: string
      product: {
        id: string
        slug: string | null
      }
    }
  | {
      success: false
      error: string
      message?: string
      issues?: Array<{ path: string[]; message: string }>
      upgradeRequired?: boolean
    }

type CreateListingFailure = Extract<CreateListingResult, { success: false }>
type SellFormData = z.infer<typeof sellFormSchemaV4>
type SupabaseClient = Awaited<ReturnType<typeof createClient>>
type SellerAccess = { userId: string; username: string }
type PricingResult = {
  price: number
  listPrice: number | null
  hasDiscount: boolean
  salePercent: number
}

const createListingArgsSchema = z.object({
  sellerId: z.string().min(1),
  data: z.unknown(),
})
type CreateListingArgs = z.infer<typeof createListingArgsSchema>

function mapValidationFailure(error: z.ZodError): CreateListingFailure {
  return {
    success: false,
    error: "Validation failed",
    issues: error.issues.map((issue) => ({ path: issue.path.map(String), message: issue.message })),
  }
}

function isCreateListingFailure(value: unknown): value is CreateListingFailure {
  if (!value || typeof value !== "object") return false
  if (!("success" in value)) return false
  return value.success === false
}

function parseArgs(args: { sellerId: string; data: unknown }): CreateListingArgs | CreateListingFailure {
  const parsedArgs = createListingArgsSchema.safeParse(args)
  if (!parsedArgs.success) {
    return { success: false, error: "Invalid input" } satisfies CreateListingFailure
  }
  return parsedArgs.data
}

function parseForm(data: unknown): SellFormData | CreateListingFailure {
  const parsed = sellFormSchemaV4.safeParse(data)
  if (!parsed.success) {
    return mapValidationFailure(parsed.error)
  }
  return parsed.data
}

async function verifySellerAccess(
  supabase: SupabaseClient,
  sellerId: string,
  authenticatedUserId: string
): Promise<SellerAccess | CreateListingFailure> {
  if (authenticatedUserId !== sellerId) {
    return { success: false, error: "Forbidden" }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", authenticatedUserId)
    .single()

  if (profileError) {
    return { success: false, error: "Failed to load seller profile" }
  }

  if (!profile?.username) {
    return { success: false, error: "You must set up a username to sell items" }
  }

  return { userId: authenticatedUserId, username: profile.username }
}

async function verifyListingLimits(
  supabase: SupabaseClient,
  userId: string
): Promise<CreateListingFailure | null> {
  const listingLimits = await getSellerListingLimitSnapshot(supabase, userId)
  if (!listingLimits) {
    return { success: false, error: "Failed to verify listing limits" }
  }

  if (listingLimits.needsUpgrade) {
    return {
      success: false,
      error: "LISTING_LIMIT_REACHED",
      message: `You have reached your listing limit (${listingLimits.currentListings} of ${listingLimits.maxListings}). Please upgrade your plan to add more listings.`,
      upgradeRequired: true,
    }
  }

  return null
}

async function buildAttributesPayload(
  supabase: SupabaseClient,
  form: SellFormData
): Promise<{ attributesJson: Record<string, string>; condition: string }> {
  const attributesJson: Record<string, string> = {}
  const formAttributes = form.attributes || []

  const attributeIds = [
    ...new Set(
      formAttributes
        .map((attribute) => attribute.attributeId)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    ),
  ]

  const attributeKeyById = new Map<string, string>()
  if (attributeIds.length > 0) {
    const { data: defs, error: defsError } = await supabase
      .from("category_attributes")
      .select("id, attribute_key, name")
      .in("id", attributeIds)

    if (defsError) {
      logger.error("[sell:createListing] Failed to resolve attribute_key", defsError)
    } else {
      for (const def of defs || []) {
        const key = (def.attribute_key ?? normalizeAttributeKey(def.name ?? "")).trim()
        if (def.id && key) {
          attributeKeyById.set(def.id, key)
        }
      }
    }
  }

  for (const attribute of formAttributes) {
    const keyFromId = attribute.attributeId ? attributeKeyById.get(attribute.attributeId) : null
    const key = (keyFromId ?? normalizeAttributeKey(attribute.name)).trim()
    if (!key) continue
    attributesJson[key] = attribute.value
  }

  const conditionRaw = typeof form.condition === "string" ? form.condition.trim() : ""
  const condition = conditionRaw || attributesJson.condition || "new"
  attributesJson.condition = condition

  return { attributesJson, condition }
}

function validatePricing(form: SellFormData): PricingResult | CreateListingFailure {
  const price = Number.parseFloat(form.price)
  if (!Number.isFinite(price) || price <= 0) {
    return {
      success: false,
      error: "Validation failed",
      issues: [{ path: ["price"], message: "validation.priceInvalid" }],
    } satisfies CreateListingFailure
  }

  const listPrice = form.compareAtPrice ? Number.parseFloat(form.compareAtPrice) : null
  const hasDiscount =
    Number.isFinite(price) &&
    typeof listPrice === "number" &&
    Number.isFinite(listPrice) &&
    listPrice > price

  if (typeof listPrice === "number" && Number.isFinite(listPrice) && !hasDiscount) {
    return {
      success: false,
      error: "Validation failed",
      issues: [{ path: ["compareAtPrice"], message: "validation.compareAtMustBeHigher" }],
    } satisfies CreateListingFailure
  }

  const salePercent =
    hasDiscount && listPrice > 0
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : 0

  return {
    price,
    listPrice,
    hasDiscount,
    salePercent,
  }
}

function mapInsertError(error: { message?: string; code?: string }): CreateListingFailure {
  if (error.message?.includes("LISTING_LIMIT_REACHED") || error.code === "P0001") {
    return {
      success: false,
      error: "LISTING_LIMIT_REACHED",
      message: "You have reached your listing limit. Please upgrade your plan to add more listings.",
      upgradeRequired: true,
    }
  }

  if (error.code === "23514" && error.message?.includes("Category must be a leaf category")) {
    return {
      success: false,
      error: "LEAF_CATEGORY_REQUIRED",
      message: "Please select a more specific category (leaf category)",
    }
  }

  return { success: false, error: error.message || "Failed to create product" }
}

async function insertOptionalProductImages(
  supabase: SupabaseClient,
  productId: string,
  form: SellFormData
) {
  const imageRecords = (form.images || []).map((image, index) => ({
    product_id: productId,
    image_url: image.url,
    thumbnail_url: image.thumbnailUrl || image.url,
    display_order: index,
    is_primary: index === 0,
  }))

  if (imageRecords.length > 0) {
    const { error: imagesError } = await supabase.from("product_images").insert(imageRecords)
    if (imagesError) {
      // Non-critical: product created but images failed
    }
  }
}

async function insertOptionalProductAttributes(
  supabase: SupabaseClient,
  productId: string,
  form: SellFormData
) {
  if (!form.attributes || form.attributes.length === 0) return

  const attributeRecords = form.attributes.map((attribute) => ({
    product_id: productId,
    attribute_id: attribute.attributeId || null,
    name: attribute.name,
    value: attribute.value,
    is_custom: attribute.isCustom ?? false,
  }))

  const { error: attrError } = await supabase.from("product_attributes").insert(attributeRecords)
  if (attrError) {
    // Non-critical: product created but attributes failed
  }
}

async function updateDefaultSellerCity(
  supabase: SupabaseClient,
  userId: string,
  city: string | undefined
) {
  if (!city) return

  try {
    await supabase
      .from("profiles")
      .update({ default_city: city })
      .eq("id", userId)
      .is("default_city", null)
  } catch {
    // ignore
  }
}

export async function createListing(args: { sellerId: string; data: unknown }): Promise<CreateListingResult> {
  const parsedArgs = parseArgs(args)
  if (isCreateListingFailure(parsedArgs)) return parsedArgs

  const { sellerId, data } = parsedArgs
  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Unauthorized" }
  }

  const parsedForm = parseForm(data)
  if (isCreateListingFailure(parsedForm)) return parsedForm
  const form = parsedForm

  const supabase = auth.supabase
  const sellerAccessResult = await verifySellerAccess(supabase, sellerId, auth.user.id)
  if (isCreateListingFailure(sellerAccessResult)) return sellerAccessResult
  const sellerAccess = sellerAccessResult

  const listingLimitsFailure = await verifyListingLimits(supabase, sellerAccess.userId)
  if (listingLimitsFailure) return listingLimitsFailure

  const pricingResult = validatePricing(form)
  if (isCreateListingFailure(pricingResult)) return pricingResult
  const pricing = pricingResult

  const categoryResolution = await resolveLeafCategoryForListing({
    supabase,
    selectedCategoryId: form.categoryId || null,
    context: {
      title: form.title,
      description: form.description,
      tags: form.tags,
      attributes: (form.attributes || []).map((attribute) => ({
        name: attribute.name,
        value: attribute.value,
      })),
    },
  })
  if (!categoryResolution.ok) {
    return {
      success: false,
      error: categoryResolution.error,
      message: categoryResolution.message,
    }
  }

  const { attributesJson, condition } = await buildAttributesPayload(supabase, form)
  const imageUrls = (form.images || []).map((img) => img.url)

  const productData = {
    seller_id: sellerAccess.userId,
    title: form.title,
    description: form.description || "",
    price: pricing.price,
    list_price: pricing.hasDiscount ? pricing.listPrice : null,
    is_on_sale: pricing.hasDiscount,
    sale_percent: pricing.salePercent,
    sale_end_date: null,
    category_id: categoryResolution.categoryId,
    brand_id: form.brandId || null,
    tags: form.tags || [],
    images: imageUrls,
    stock: form.quantity ?? 1,
    listing_type: "normal",
    status: "active",
    is_boosted: false,
    boost_expires_at: null,
    seller_city: form.sellerCity || null,
    ships_to_bulgaria: form.shipsToBulgaria ?? true,
    ships_to_uk: form.shipsToUK ?? false,
    ships_to_europe: form.shipsToEurope ?? false,
    ships_to_usa: form.shipsToUSA ?? false,
    ships_to_worldwide: form.shipsToWorldwide ?? false,
    pickup_only: form.pickupOnly ?? false,
    free_shipping: form.freeShipping ?? false,
    // Keep condition in the dedicated column too (canonical for the DB)
    condition,
    attributes: attributesJson,
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert(productData)
    .select("id, slug")
    .single()

  if (error) {
    return mapInsertError(error)
  }

  await insertOptionalProductImages(supabase, product.id, form)
  await insertOptionalProductAttributes(supabase, product.id, form)
  await updateDefaultSellerCity(supabase, sellerAccess.userId, form.sellerCity || undefined)

  return {
    success: true,
    id: product.id,
    sellerUsername: sellerAccess.username,
    product: {
      id: product.id,
      slug: product.slug ?? null,
    },
  }
}

