"use server"

import { z } from "zod"
import { sellFormSchemaV4 } from "@/lib/sell/schema"
import { createAdminClient, createClient } from "@/lib/supabase/server"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"

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

export async function createListing(args: { sellerId: string; data: unknown }): Promise<CreateListingResult> {
  const schema = z.object({ sellerId: z.string().min(1), data: z.unknown() })
  const parsedArgs = schema.safeParse(args)
  if (!parsedArgs.success) {
    return { success: false, error: "Invalid input" }
  }

  const { sellerId, data } = parsedArgs.data

  const parsed = sellFormSchemaV4.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      issues: parsed.error.issues.map((i) => ({ path: i.path.map(String), message: i.message })),
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  if (user.id !== sellerId) {
    return { success: false, error: "Forbidden" }
  }

  // Ensure user has username
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .single()

  if (!profile?.username) {
    return { success: false, error: "You must set up a username to sell items" }
  }

  // Enforce listing limit using direct queries (no RPC needed)
  const [{ count: currentListings }, { data: subscription }] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", user.id)
      .eq("status", "active"),
    supabase
      .from("subscriptions")
      .select("plan_type, subscription_plans!inner(max_listings)")
      .eq("seller_id", user.id)
      .eq("status", "active")
      .single(),
  ])

  const subPlan = subscription?.subscription_plans as unknown as { max_listings: number } | null
  const maxListings = subPlan?.max_listings ?? 10
  const isUnlimited = maxListings === -1
  const remaining = isUnlimited ? Number.POSITIVE_INFINITY : Math.max(maxListings - (currentListings ?? 0), 0)

  if (!isUnlimited && remaining <= 0) {
    return {
      success: false,
      error: "LISTING_LIMIT_REACHED",
      message: `You have reached your listing limit (${currentListings} of ${maxListings}). Please upgrade your plan to add more listings.`,
      upgradeRequired: true,
    }
  }

  const form = parsed.data

  const imageUrls = (form.images || []).map((img) => img.url)

  // Build attributes JSONB (canonical keys).
  // Keep `condition` in JSONB too, so filters/hero specs can rely on a single key.
  const attributesJson: Record<string, string> = {}

  const attributeIds = Array.from(
    new Set(
      (form.attributes || [])
        .map((attr) => attr.attributeId)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  )

  const attributeKeyById = new Map<string, string>()
  if (attributeIds.length > 0) {
    const { data: defs, error: defsError } = await supabase
      .from("category_attributes")
      .select("id, attribute_key, name")
      .in("id", attributeIds)

    if (defsError) {
      console.error("[sell:createListing] Failed to resolve attribute_key:", defsError)
    } else {
      for (const def of defs || []) {
        const key = (def.attribute_key ?? normalizeAttributeKey(def.name ?? "")).trim()
        if (def.id && key) attributeKeyById.set(def.id, key)
      }
    }
  }

  for (const attr of form.attributes || []) {
    const keyFromId = attr.attributeId ? attributeKeyById.get(attr.attributeId) : null
    const key = (keyFromId ?? normalizeAttributeKey(attr.name)).trim()
    if (!key) continue
    attributesJson[key] = attr.value
  }

  const conditionRaw = typeof form.condition === "string" ? form.condition.trim() : ""
  const condition = conditionRaw || attributesJson.condition || "new"
  attributesJson.condition = condition

  const price = Number.parseFloat(form.price)
  if (!Number.isFinite(price) || price <= 0) {
    return {
      success: false,
      error: "Validation failed",
      issues: [
        {
          path: ["price"],
          message: "Enter a valid price greater than 0",
        },
      ],
    }
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
      issues: [
        {
          path: ["compareAtPrice"],
          message: "Compare at price must be higher than your price",
        },
      ],
    }
  }

  const salePercent = hasDiscount && listPrice > 0
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0

  const productData = {
    seller_id: user.id,
    title: form.title,
    description: form.description || "",
    price,
    list_price: hasDiscount ? listPrice : null,
    is_on_sale: hasDiscount,
    sale_percent: salePercent,
    sale_end_date: null,
    category_id: form.categoryId || null,
    brand_id: form.brandId || null,
    tags: form.tags || [],
    images: imageUrls,
    stock: form.quantity ?? 1,
    listing_type: "normal",
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

  const imageRecords = (form.images || []).map((img, index) => ({
    product_id: product.id,
    image_url: img.url,
    thumbnail_url: img.thumbnailUrl || img.url,
    display_order: index,
    is_primary: index === 0,
  }))

  if (imageRecords.length > 0) {
    const { error: imagesError } = await supabase.from("product_images").insert(imageRecords)
    if (imagesError) {
      // Non-critical: product created but images failed
    }
  }

  if (form.attributes && form.attributes.length > 0) {
    const attributeRecords = form.attributes.map((attr) => ({
      product_id: product.id,
      attribute_id: attr.attributeId || null,
      name: attr.name,
      value: attr.value,
      is_custom: attr.isCustom ?? false,
    }))

    const { error: attrError } = await supabase.from("product_attributes").insert(attributeRecords)
    if (attrError) {
      // Non-critical: product created but attributes failed
    }
  }

  // Default city hint
  if (form.sellerCity) {
    try {
      await supabase
        .from("profiles")
        .update({ default_city: form.sellerCity })
        .eq("id", user.id)
        .is("default_city", null)
    } catch {
      // ignore
    }
  }

  return {
    success: true,
    id: product.id,
    sellerUsername: profile.username,
    product: {
      id: product.id,
      slug: product.slug ?? null,
    },
  }
}

