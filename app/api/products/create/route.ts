import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

// Image schema - supports both URL string and object format
const imageSchema = z.union([
  z.string().url(),
  z.object({
    url: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
  })
])

// Attribute schema for Item Specifics
const attributeSchema = z.object({
  attribute_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  value: z.string().min(1),
  is_custom: z.boolean().default(false),
})

// Server-side validation schema - flexible to accept various form formats
const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().max(5000).optional().default(""),
  price: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'string' ? parseFloat(val) : val
  ).refine(val => val > 0, "Price must be greater than 0"),
  listPrice: z.union([z.string(), z.number(), z.null()]).optional().transform(val => {
    if (val === null || val === undefined || val === '') return null
    const num = typeof val === 'string' ? parseFloat(val) : val
    return isNaN(num) ? null : num
  }),
  categoryId: z.string().uuid().nullable().optional(),
  brandId: z.string().uuid().nullable().optional(),
  stock: z.union([z.string(), z.number()]).transform(val =>
    typeof val === 'string' ? parseInt(val, 10) : val
  ).default(1),
  tags: z.array(z.string()).default([]),
  images: z.array(imageSchema).min(1, "At least one image is required"),
  attributes: z.array(attributeSchema).optional().default([]),
  // Shipping - Updated December 2025 with UK and USA
  shipsToBulgaria: z.boolean().default(true),
  shipsToUK: z.boolean().default(false),
  shipsToEurope: z.boolean().default(false),
  shipsToUSA: z.boolean().default(false),
  shipsToWorldwide: z.boolean().default(false),
  pickupOnly: z.boolean().default(false),
  // Condition
  condition: z.string().optional(),
  // Sell format
  format: z.enum(["fixed", "auction"]).default("fixed"),
  acceptOffers: z.boolean().default(false),
})

export async function POST(request: Request) {
  try {
    // 1. Verify the user is authenticated
    const supabaseUser = await createServerClient()
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Check if user has a username (required to sell)
    const { data: profile } = await supabaseUser
      .from("profiles")
      .select("id, username, display_name, business_name")
      .eq("id", user.id)
      .single()

    if (!profile || !profile.username) {
      return NextResponse.json({ 
        error: "You must set up a username to sell items" 
      }, { status: 403 })
    }
    
    // Map profile to seller format - keeping for compatibility reference
    const _seller = {
      id: profile.id,
      store_name: profile.display_name || profile.business_name || profile.username,
    }

    // 2.5. Check listing limit before proceeding
    const { data: limitInfo } = await supabaseUser.rpc('get_seller_listing_info', {
      seller_uuid: user.id
    })
    
    if (limitInfo && limitInfo.length > 0) {
      const info = limitInfo[0]
      // max_listings=-1 means unlimited
      const isUnlimited = info.max_listings === -1
      const remaining = isUnlimited ? 999 : Math.max(info.max_listings - info.current_listings, 0)
      if (!isUnlimited && remaining <= 0) {
        return NextResponse.json({ 
          error: "LISTING_LIMIT_REACHED",
          message: `You have reached your listing limit (${info.current_listings} of ${info.max_listings}). Please upgrade your plan to add more listings.`,
          currentCount: info.current_listings,
          maxAllowed: info.max_listings,
          upgradeRequired: true
        }, { status: 403 })
      }
    }

    const body = await request.json()
    
    // 3. Parse and validate request body
    const parseResult = productSchema.safeParse(body)

    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors
      console.error("Validation errors:", errors)
      return NextResponse.json({ 
        error: "Validation failed", 
        details: errors 
      }, { status: 400 })
    }

    const data = parseResult.data

    // 4. Use Service Role to bypass RLS for insert
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 5. Normalize images to URL array for products table
    const imageUrls = data.images.map(img => 
      typeof img === 'string' ? img : img.url
    )

    // 6. Build condition attribute for JSONB
    const attributesJson: Record<string, string> = {}
    if (data.condition) {
      attributesJson.condition = data.condition
    }
    // Add any custom attributes
    if (data.attributes) {
      for (const attr of data.attributes) {
        attributesJson[attr.name.toLowerCase().replace(/\s+/g, '_')] = attr.value
      }
    }

    // 7. Insert product
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .insert({
        seller_id: user.id,
        title: data.title,
        description: data.description || "",
        price: data.price,
        list_price: data.listPrice,
        category_id: data.categoryId || null,
        brand_id: data.brandId || null,
        tags: data.tags,
        images: imageUrls,
        stock: data.stock,
        listing_type: "normal",
        is_boosted: false,
        boost_expires_at: null,
        ships_to_bulgaria: data.shipsToBulgaria ?? true,
        ships_to_uk: data.shipsToUK ?? false,
        ships_to_europe: data.shipsToEurope ?? false,
        ships_to_usa: data.shipsToUSA ?? false,
        ships_to_worldwide: data.shipsToWorldwide ?? false,
        pickup_only: data.pickupOnly ?? false,
        attributes: attributesJson,
      })
      .select()
      .single()

    if (error) {
      console.error("Product Creation Error:", error)
      
      // Check for listing limit error (raised by check_listing_limit trigger)
      if (error.message?.includes('LISTING_LIMIT_REACHED') || error.code === 'P0001') {
        return NextResponse.json({ 
          error: "LISTING_LIMIT_REACHED",
          message: "You have reached your listing limit. Please upgrade your plan to add more listings.",
          upgradeRequired: true
        }, { status: 403 })
      }
      
      return NextResponse.json({ 
        error: error.message || "Failed to create product" 
      }, { status: 500 })
    }

    // 8. Insert product images to product_images table
    const imageRecords = data.images.map((img, index) => ({
      product_id: product.id,
      image_url: typeof img === 'string' ? img : img.url,
      thumbnail_url: typeof img === 'string' ? img : (img.thumbnailUrl || img.url),
      display_order: index,
      is_primary: index === 0
    }))

    const { error: imagesError } = await supabaseAdmin
      .from('product_images')
      .insert(imageRecords)

    if (imagesError) {
      console.error("Product Images Insert Error:", imagesError)
      // Product was created, log error but don't fail
    }

    // 9. Save product attributes (Item Specifics) to separate table
    if (data.attributes && data.attributes.length > 0) {
      const attributeRecords = data.attributes.map(attr => ({
        product_id: product.id,
        attribute_id: attr.attribute_id || null,
        name: attr.name,
        value: attr.value,
        is_custom: attr.is_custom ?? false,
      }))

      const { error: attrError } = await supabaseAdmin
        .from('product_attributes')
        .insert(attributeRecords)

      if (attrError) {
        console.error("Product Attributes Insert Error:", attrError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      id: product.id,
      product 
    })
  } catch (error: unknown) {
    console.error("Product Creation Error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }, { status: 500 })
  }
}
