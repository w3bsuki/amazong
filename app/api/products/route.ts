
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"

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

        const body = await request.json()
        const { title, description, price, categoryId, tags, images } = body

        if (!title || !price || !images || images.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 2. Use Service Role to bypass RLS
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 3. Insert product
        // Note: tags column now exists and supports Bulgarian text
        const { data: product, error } = await supabaseAdmin
            .from("products")
            .insert({
                seller_id: user.id,
                title,
                description,
                price: parseFloat(price),
                category_id: categoryId || null,
                tags: Array.isArray(tags) ? tags : [], // Ensure tags is an array
                images: images.map((img: any) => img.url), // Array of image URLs
                stock: 0, // Default stock, seller can update later
                search_vector: null // Let trigger handle it (supports Cyrillic)
            })
            .select()
            .single()

        if (error) {
            console.error("Product Creation Error:", error)
            throw error
        }

        // 4. Insert all product images
        if (images && images.length > 0) {
            const imageRecords = images.map((img: any, index: number) => ({
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
                // Don't fail the whole request, product is already created
            }
        }

        return NextResponse.json({ success: true, product })
    } catch (error: any) {
        console.error("Product Creation Error:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}
