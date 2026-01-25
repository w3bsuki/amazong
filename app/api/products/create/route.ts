import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { z } from "zod"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"

// Image schema - supports both URL string and object format (including isPrimary from form)
const imageSchema = z.union([
  z.string().url("Invalid image URL"),
  z.object({
    url: z.string().url("Invalid image URL in object"),
    thumbnailUrl: z.string().optional().transform(val => {
      // Handle empty string as undefined
      if (!val || val.trim() === '') return
      // Don't validate as URL - just pass through
      return val
    }),
    isPrimary: z.boolean().optional(), // Form sends this, we ignore it
  })
]).transform(img => {
  // Normalize to always return an object for consistency in logging
  if (typeof img === 'string') {
    return { url: img, thumbnailUrl: undefined, isPrimary: false }
  }
  return img
})

// Attribute schema for Item Specifics - supports both camelCase (from form) and snake_case
const attributeSchema = z.object({
  attribute_id: z.string().nullable().optional(),
  attributeId: z.string().nullable().optional(), // Form sends camelCase
  name: z.string().min(1),
  value: z.string().min(1),
  is_custom: z.boolean().optional().default(false),
  isCustom: z.boolean().optional(), // Form sends camelCase
}).transform(attr => {
  // Handle attributeId - can be UUID, empty string, null, or undefined
  let attrId = attr.attribute_id || attr.attributeId || null
  if (attrId && typeof attrId === 'string' && // Validate it's a proper UUID, otherwise set to null
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(attrId)) {
      attrId = null
    }
  return {
    attribute_id: attrId,
    name: attr.name,
    value: attr.value,
    is_custom: attr.is_custom || attr.isCustom || false,
  }
})

// Helper to validate UUID format or empty string - more lenient for form compatibility
const uuidOrEmpty = z.string().transform(val => {
  if (!val || val.trim() === '') return null
  // Check if it's a valid UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)) {
    return val
  }
  // Not a valid UUID - return null (database will handle missing category)
  return null
})

// Server-side validation schema - flexible to accept various form formats
const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().max(5000).optional().default(""),
  price: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'string' ? Number.parseFloat(val) : val
  ).refine(val => val > 0, "Price must be greater than 0"),
  // Accept both listPrice (API) and compareAtPrice (form V4)
  listPrice: z.union([z.string(), z.number(), z.null()]).optional().transform(val => {
    if (val === null || val === undefined || val === '') return null
    const num = typeof val === 'string' ? Number.parseFloat(val) : val
    return isNaN(num) ? null : num
  }),
  compareAtPrice: z.union([z.string(), z.number(), z.null()]).optional().transform(val => {
    if (val === null || val === undefined || val === '') return null
    const num = typeof val === 'string' ? Number.parseFloat(val) : val
    return isNaN(num) ? null : num
  }),
  // categoryId - accept empty string and transform to null
  categoryId: uuidOrEmpty.nullable().optional(),
  brandId: uuidOrEmpty.nullable().optional(),
  // Accept both stock (API) and quantity (form V4)
  stock: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined || val === null || val === '') return 1
    return typeof val === 'string' ? Number.parseInt(val, 10) : val
  }).default(1),
  quantity: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined || val === null || val === '') return
    return typeof val === 'string' ? Number.parseInt(val, 10) : val
  }),
  tags: z.array(z.string()).default([]),
  images: z.array(imageSchema).min(1, "At least one image is required"),
  attributes: z.array(attributeSchema).optional().default([]),
  // Shipping - Updated December 2025 with UK and USA
  sellerCity: z.string().optional(), // Seller's city for item location
  shipsToBulgaria: z.boolean().default(true),
  shipsToUK: z.boolean().default(false),
  shipsToEurope: z.boolean().default(false),
  shipsToUSA: z.boolean().default(false),
  shipsToWorldwide: z.boolean().default(false),
  pickupOnly: z.boolean().default(false),
  freeShipping: z.boolean().default(false),
  // Condition
  condition: z.string().optional(),
  // Sell format
  format: z.enum(["fixed", "auction"]).default("fixed"),
  acceptOffers: z.boolean().default(false),
  // Additional fields from form V4 that we accept but might not use
  currency: z.string().optional(),
  categoryPath: z.array(z.any()).optional(),
  brandName: z.string().optional(),
  shippingPrice: z.string().optional(),
  dimensions: z.any().optional(),
  processingDays: z.number().optional(),
  minOfferPercent: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the user is authenticated
    const { supabase: supabaseUser, applyCookies } = createRouteHandlerClient(request)

    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) {
      return applyCookies(NextResponse.json({ error: "Unauthorized - no user" }, { status: 401 }))
    }

    // 2. Check if user has a username (required to sell)
    const { data: profile } = await supabaseUser
      .from("profiles")
      .select("id, username, display_name, business_name, tier")
      .eq("id", user.id)
      .single()

    if (!profile || !profile.username) {
      return applyCookies(NextResponse.json({ 
        error: "You must set up a username to sell items" 
      }, { status: 403 }))
    }
    
    // Map profile to seller format - keeping for compatibility reference
    const _seller = {
      id: profile.id,
      store_name: profile.display_name || profile.business_name || profile.username,
    }

    // 2.5. Check listing limit before proceeding
    // Get listing count and profile tier, then look up plan limits
    const [productCountResult, planResult] = await Promise.all([
      supabaseUser
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("seller_id", user.id)
        .eq("status", "active"),
      // Get plan limits based on profile tier (free/premium/business)
      supabaseUser
        .from("subscription_plans")
        .select("max_listings")
        .eq("tier", profile.tier || "free")
        .maybeSingle()
    ])
    
    const currentListings = productCountResult.count ?? 0
    // Default to free tier limits (5 listings) if no plan found
    const maxListings = planResult.data?.max_listings ?? 5
    
    // max_listings=-1 means unlimited
    const isUnlimited = maxListings === -1
    const remaining = isUnlimited ? 999 : Math.max(maxListings - currentListings, 0)
    
    if (!isUnlimited && remaining <= 0) {
      return applyCookies(NextResponse.json({ 
        error: "LISTING_LIMIT_REACHED",
        message: `You have reached your listing limit (${currentListings} of ${maxListings}). Please upgrade your plan to add more listings.`,
        currentCount: currentListings,
        maxAllowed: maxListings,
        upgradeRequired: true
      }, { status: 403 }))
    }

    let body;
    try {
      body = await request.json()
    } catch (e) {
      return applyCookies(NextResponse.json({ error: "Invalid JSON body", details: String(e) }, { status: 400 }))
    }
    
    // 3. Parse and validate request body
    const parseResult = productSchema.safeParse(body)

    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors
      const formErrors = parseResult.error.flatten().formErrors
      return applyCookies(NextResponse.json({ 
        error: "Validation failed", 
        details: errors,
        formErrors: formErrors,
        issues: parseResult.error.issues
      }, { status: 400 }))
    }

    const data = parseResult.data

    // 4. Use the authenticated user client so RLS is enforced

    // 5. Normalize images to URL array for products table
    // After transform, all images are objects with url property
    const imageUrls = data.images.map(img => img.url)

    // 6. Build attributes JSONB (canonical keys).
    // Keep `condition` in JSONB too, so filters/hero specs can rely on a single key.
    const attributesJson: Record<string, string> = {}

    // Fetch canonical keys for known attribute_ids in one query.
    const attributeIds = Array.from(
      new Set(
        (data.attributes || [])
          .map((attr) => attr.attribute_id)
          .filter((id): id is string => typeof id === "string" && id.length > 0),
      ),
    )

    const attributeKeyById = new Map<string, string>()
    if (attributeIds.length > 0) {
      const { data: defs, error: defsError } = await supabaseUser
        .from("category_attributes")
        .select("id, attribute_key, name")
        .in("id", attributeIds)

      if (defsError) {
        console.error("[products/create] Failed to resolve attribute_key:", defsError)
      } else {
        for (const def of defs || []) {
          const key = (def.attribute_key ?? normalizeAttributeKey(def.name ?? "")).trim()
          if (def.id && key) attributeKeyById.set(def.id, key)
        }
      }
    }

    if (data.attributes) {
      for (const attr of data.attributes) {
        const keyFromId = attr.attribute_id ? attributeKeyById.get(attr.attribute_id) : null
        const key = (keyFromId ?? normalizeAttributeKey(attr.name)).trim()
        if (!key) continue
        attributesJson[key] = attr.value
      }
    }

    const conditionRaw = typeof data.condition === "string" ? data.condition.trim() : ""
    const condition = conditionRaw || attributesJson.condition || "new"
    attributesJson.condition = condition

    // 7. Compute final values - handle form V4 field names
    const finalListPrice = data.listPrice ?? data.compareAtPrice ?? null
    const finalStock = data.stock ?? data.quantity ?? 1

    // 8. Insert product
    const productData = {
      seller_id: user.id,
      title: data.title,
      description: data.description || "",
      price: data.price,
      list_price: finalListPrice,
      category_id: data.categoryId || null,
      brand_id: data.brandId || null,
      tags: data.tags,
      images: imageUrls,
      stock: finalStock,
      listing_type: "normal",
      is_boosted: false,
      boost_expires_at: null,
      seller_city: data.sellerCity || null,
      ships_to_bulgaria: data.shipsToBulgaria ?? true,
      ships_to_uk: data.shipsToUK ?? false,
      ships_to_europe: data.shipsToEurope ?? false,
      ships_to_usa: data.shipsToUSA ?? false,
      ships_to_worldwide: data.shipsToWorldwide ?? false,
      pickup_only: data.pickupOnly ?? false,
      free_shipping: data.freeShipping ?? false,
      // Keep condition in the dedicated column too (canonical for the DB)
      condition,
      attributes: attributesJson,
    }
    
    const { data: product, error } = await supabaseUser
      .from("products")
      .insert(productData)
      .select('id')
      .single()

    if (error) {
      // Check for listing limit error (raised by check_listing_limit trigger)
      if (error.message?.includes('LISTING_LIMIT_REACHED') || error.code === 'P0001') {
        return applyCookies(NextResponse.json({ 
          error: "LISTING_LIMIT_REACHED",
          message: "You have reached your listing limit. Please upgrade your plan to add more listings.",
          upgradeRequired: true
        }, { status: 403 }))
      }

      if (error.code === "23514" && error.message?.includes("Category must be a leaf category")) {
        return applyCookies(
          NextResponse.json(
            {
              error: "LEAF_CATEGORY_REQUIRED",
              message: "Please select a more specific category (leaf category)",
            },
            { status: 400 },
          ),
        )
      }
      
      return applyCookies(NextResponse.json({ 
        error: error.message || "Failed to create product" 
      }, { status: 500 }))
    }

    // 9. Insert product images to product_images table
    const imageRecords = data.images.map((img, index) => ({
      product_id: product.id,
      image_url: typeof img === 'string' ? img : img.url,
      thumbnail_url: typeof img === 'string' ? img : (img.thumbnailUrl || img.url),
      display_order: index,
      is_primary: index === 0
    }))

    const { error: imagesError } = await supabaseUser
      .from('product_images')
      .insert(imageRecords)

    if (imagesError) {
      // Product was created, images failed but don't fail the whole request
    }

    // 10. Save product attributes (Item Specifics) to separate table
    if (data.attributes && data.attributes.length > 0) {
      const attributeRecords = data.attributes.map(attr => ({
        product_id: product.id,
        attribute_id: attr.attribute_id || null,
        name: attr.name,
        value: attr.value,
        is_custom: attr.is_custom ?? false,
      }))

      const { error: attrError } = await supabaseUser
        .from('product_attributes')
        .insert(attributeRecords)

      if (attrError) {
        // Attributes failed but product was created - non-fatal
      }
    }

    // 11. Update user's default_city in profile (for future listings)
    if (data.sellerCity) {
      try {
        await supabaseUser
          .from('profiles')
          .update({ default_city: data.sellerCity })
          .eq('id', user.id)
          .is('default_city', null)
      } catch {
        // Ignore error - not critical
      }
    }

    return applyCookies(NextResponse.json({ 
      success: true, 
      id: product.id,
      sellerUsername: profile.username,
      product 
    }))
  } catch (error: unknown) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }, { status: 500 })
  }
}
