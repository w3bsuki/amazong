"use server"

import { z } from "zod"
import { sellFormSchemaV4 } from "@/lib/sell/schema-v4"
import { createAdminClient, createClient } from "@/lib/supabase/server"

export async function createListing(args: { sellerId: string; data: unknown }) {
  const schema = z.object({ sellerId: z.string().min(1), data: z.unknown() })
  const parsedArgs = schema.safeParse(args)
  if (!parsedArgs.success) {
    return { error: "Invalid input" as const }
  }

  const { sellerId, data } = parsedArgs.data

  const parsed = sellFormSchemaV4.safeParse(data)
  if (!parsed.success) {
    return {
      error: "Validation failed" as const,
      issues: parsed.error.issues.map((i) => ({ path: i.path.map(String), message: i.message })),
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" as const }
  }

  if (user.id !== sellerId) {
    return { error: "Forbidden" as const }
  }

  // Ensure user has username
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .single()

  if (!profile?.username) {
    return { error: "You must set up a username to sell items" as const }
  }

  // Enforce listing limit (same RPC used by route handler)
  const { data: limitInfo } = await supabase.rpc("get_seller_listing_info", {
    seller_uuid: user.id,
  })

  if (limitInfo && Array.isArray(limitInfo) && limitInfo.length > 0) {
    const info = limitInfo[0] as any
    const isUnlimited = info?.max_listings === -1
    const remaining = isUnlimited ? 999 : Math.max((info?.max_listings ?? 0) - (info?.current_listings ?? 0), 0)
    if (!isUnlimited && remaining <= 0) {
      return {
        error: "LISTING_LIMIT_REACHED" as const,
        message: `You have reached your listing limit (${info?.current_listings} of ${info?.max_listings}). Please upgrade your plan to add more listings.`,
        upgradeRequired: true as const,
      }
    }
  }

  const admin = createAdminClient()

  const form = parsed.data

  const imageUrls = (form.images || []).map((img) => img.url)

  const attributesJson: Record<string, string> = {}
  if (form.condition) attributesJson.condition = form.condition
  for (const attr of form.attributes || []) {
    attributesJson[attr.name.toLowerCase().replace(/\s+/g, "_")] = attr.value
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

  const { data: product, error } = await admin
    .from("products")
    .insert(productData)
    .select()
    .single()

  if (error) {
    if (error.message?.includes("LISTING_LIMIT_REACHED") || (error as any).code === "P0001") {
      return {
        error: "LISTING_LIMIT_REACHED" as const,
        message: "You have reached your listing limit. Please upgrade your plan to add more listings.",
        upgradeRequired: true as const,
      }
    }
    return { error: error.message || "Failed to create product" }
  }

  const imageRecords = (form.images || []).map((img, index) => ({
    product_id: product.id,
    image_url: img.url,
    thumbnail_url: img.thumbnailUrl || img.url,
    display_order: index,
    is_primary: index === 0,
  }))

  if (imageRecords.length > 0) {
    const { error: imagesError } = await admin.from("product_images").insert(imageRecords)
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

    const { error: attrError } = await admin.from("product_attributes").insert(attributeRecords)
    if (attrError) {
      console.error("Product Attributes Insert Error:", attrError)
    }
  }

  // Default city hint
  if (form.sellerCity) {
    try {
      await admin
        .from("profiles")
        .update({ default_city: form.sellerCity })
        .eq("id", user.id)
        .is("default_city", null)
    } catch {
      // ignore
    }
  }

  return {
    success: true as const,
    id: product.id as string,
    sellerUsername: profile.username as string,
    product: product as any,
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
    if (data.accountType === "business") {
      if (!data.businessName || data.businessName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessName"],
          message: "Business name is required",
        })
      }
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
