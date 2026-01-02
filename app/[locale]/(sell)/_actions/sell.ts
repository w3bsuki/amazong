"use server"

import { z } from "zod"
import { sellFormSchemaV4 } from "@/lib/sell/schema-v4"
import { createClient } from "@/lib/supabase/server"

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
      .select("*", { count: "exact", head: true })
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

  const attributesJson: Record<string, string> = {}
  if (form.condition) attributesJson.condition = form.condition
  for (const attr of form.attributes || []) {
    attributesJson[attr.name.toLowerCase().replaceAll(/\s+/g, "_")] = attr.value
  }

  const listPrice = form.compareAtPrice ? Number(form.compareAtPrice) : null

  const productData = {
    seller_id: user.id,
    title: form.title,
    description: form.description || "",
    price: Number(form.price),
    list_price: Number.isFinite(listPrice) ? listPrice : null,
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
    attributes: attributesJson,
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
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
      console.error("Product Images Insert Error:", imagesError)
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
      console.error("Product Attributes Insert Error:", attrError)
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

export async function completeSellerOnboarding(args: {
  userId: string
  accountType: "personal" | "business"
  username: string
  displayName: string
  bio: string
  businessName?: string
}) {
  const schema = z.object({
    userId: z.string().min(1),
    accountType: z.enum(["personal", "business"]),
    username: z.string().min(1),
    displayName: z.string().optional().default(""),
    bio: z.string().optional().default(""),
    businessName: z.string().optional().default(""),
  })

  const refined = schema.superRefine((data, ctx) => {
    if (data.accountType === "business" && (!data.businessName || data.businessName.trim().length < 2)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessName"],
          message: "Business name is required",
        })
      }
  })

  const parsed = refined.safeParse(args)
  if (!parsed.success) {
    return { error: "Invalid input" as const }
  }

  const { userId, accountType, username, displayName, bio, businessName } = parsed.data

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" as const }
  if (user.id !== userId) return { error: "Forbidden" as const }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      account_type: accountType,
      display_name: displayName.trim() || username,
      bio: bio.trim() || null,
      business_name: accountType === "business" ? (businessName.trim() || null) : null,
      is_seller: true,
      role: "seller",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (updateError) return { error: updateError.message }

  const { error: statsError } = await supabase
    .from("seller_stats")
    .upsert(
      {
        seller_id: userId,
        total_listings: 0,
        active_listings: 0,
        total_sales: 0,
        total_revenue: 0,
        average_rating: 0,
        total_reviews: 0,
      },
      { onConflict: "seller_id" }
    )

  if (statsError) {
    console.error("Failed to create seller_stats:", statsError)
  }

  return { success: true as const }
}
