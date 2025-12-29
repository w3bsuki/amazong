
import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { z } from "zod"

// Attribute schema
const attributeSchema = z.object({
    attribute_id: z.string().uuid().nullable(),
    name: z.string().min(1),
    value: z.string().min(1),
    is_custom: z.boolean().default(false),
})

// Server-side validation schema matching DB constraints
const productSchema = z.object({
    title: z.string().min(5).max(200),
    description: z.string().min(20).max(5000),
    price: z.number().positive("Price must be greater than 0"),
    listPrice: z.number().positive().nullable().optional(),
    categoryId: z.string().uuid().nullable().optional(),
    stock: z.number().int().min(0).default(1),
    tags: z.array(z.string()).default([]),
    listingType: z.enum(["normal", "boosted"]).default("normal"),
    images: z.array(z.object({
        url: z.string().url(),
        thumbnailUrl: z.string().url()
    })).min(1, "At least one image is required"),
    attributes: z.array(attributeSchema).optional(),
    // Shipping options
    sellerCity: z.string().optional(),
    shipsToBulgaria: z.boolean().default(true),
    shipsToUK: z.boolean().default(false),
    shipsToEurope: z.boolean().default(false),
    shipsToUSA: z.boolean().default(false),
    shipsToWorldwide: z.boolean().default(false),
    pickupOnly: z.boolean().default(false),
    freeShipping: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
    try {
        // 1. Verify the user is authenticated
        const { supabase: supabaseUser, applyCookies } = createRouteHandlerClient(request)

        const { data: { user } } = await supabaseUser.auth.getUser()
        if (!user) {
            return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))
        }

        const body = await request.json()
        
        // Parse and validate request body
        const parseResult = productSchema.safeParse({
            title: body.title,
            description: body.description,
            price: typeof body.price === 'string' ? Number.parseFloat(body.price) : body.price,
            listPrice: body.listPrice ? (typeof body.listPrice === 'string' ? Number.parseFloat(body.listPrice) : body.listPrice) : null,
            categoryId: body.categoryId || null,
            stock: typeof body.stock === 'string' ? Number.parseInt(body.stock, 10) : (body.stock ?? 1),
            tags: Array.isArray(body.tags) ? body.tags : [],
            listingType: body.listingType || "normal",
            images: body.images,
            attributes: Array.isArray(body.attributes) ? body.attributes : [],
            // Shipping options
            sellerCity: body.sellerCity || null,
            shipsToBulgaria: body.shipsToBulgaria ?? true,
            shipsToUK: body.shipsToUK ?? false,
            shipsToEurope: body.shipsToEurope ?? false,
            shipsToUSA: body.shipsToUSA ?? false,
            shipsToWorldwide: body.shipsToWorldwide ?? false,
            pickupOnly: body.pickupOnly ?? false,
            freeShipping: body.freeShipping ?? false,
        })

        if (!parseResult.success) {
            const errors = parseResult.error.flatten().fieldErrors
            return applyCookies(NextResponse.json({ 
                error: "Validation failed", 
                details: errors 
            }, { status: 400 }))
        }

        const data = parseResult.data

        // 2. Use Service Role to bypass RLS
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 3. Products are always created as normal - boosting requires Stripe payment
        // The boost is applied via /api/boost/checkout -> /api/boost/webhook flow

        // 4. Insert product with validated data (always normal listing type)
        const { data: product, error } = await supabaseAdmin
            .from("products")
            .insert({
                seller_id: user.id,
                title: data.title,
                description: data.description,
                price: data.price,
                list_price: data.listPrice,
                category_id: data.categoryId,
                tags: data.tags,
                images: data.images.map((img) => img.url),
                stock: data.stock,
                listing_type: "normal", // Always normal - boost applied after payment
                is_boosted: false,
                boost_expires_at: null,
                // Shipping fields
                seller_city: data.sellerCity || null,
                ships_to_bulgaria: data.shipsToBulgaria ?? true,
                ships_to_uk: data.shipsToUK ?? false,
                ships_to_europe: data.shipsToEurope ?? false,
                ships_to_usa: data.shipsToUSA ?? false,
                ships_to_worldwide: data.shipsToWorldwide ?? false,
                pickup_only: data.pickupOnly ?? false,
                free_shipping: data.freeShipping ?? false,
            })
            .select()
            .single()

        if (error) {
            console.error("Product Creation Error:", error)
            return applyCookies(NextResponse.json({ 
                error: error.message || "Failed to create product" 
            }, { status: 500 }))
        }

        // 5. Insert all product images to product_images table
        const imageRecords = data.images.map((img, index) => ({
            product_id: product.id,
            image_url: img.url,
            thumbnail_url: img.thumbnailUrl,
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

        // 6. Save product attributes (Item Specifics)
        if (data.attributes && data.attributes.length > 0) {
            const attributeRecords = data.attributes.map(attr => ({
                product_id: product.id,
                attribute_id: attr.attribute_id,
                name: attr.name,
                value: attr.value,
                is_custom: attr.is_custom,
            }))

            const { error: attrError } = await supabaseAdmin
                .from('product_attributes')
                .insert(attributeRecords)

            if (attrError) {
                console.error("Product Attributes Insert Error:", attrError)
                // Product was created, log error but don't fail
            }
        }

        // Note: Boost is NO LONGER auto-created here
        // User must complete Stripe checkout via /api/boost/checkout to activate boost

        return applyCookies(NextResponse.json({ success: true, product }))
    } catch (error: unknown) {
        console.error("Product Creation Error:", error)
        const message = error instanceof Error ? error.message : "Internal Server Error"
        return NextResponse.json({ 
            error: message 
        }, { status: 500 })
    }
}