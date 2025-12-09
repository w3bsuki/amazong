
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
        const { storeName, description } = body

        if (!storeName || typeof storeName !== 'string' || storeName.trim().length < 2) {
            return NextResponse.json({ error: "Store name must be at least 2 characters" }, { status: 400 })
        }

        const trimmedName = storeName.trim()

        // 2. Use Service Role to bypass RLS for sellers table
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 3. Check if user already has a store
        const { data: existingSeller } = await supabaseAdmin
            .from("sellers")
            .select("id, store_name")
            .eq("id", user.id)
            .single()

        if (existingSeller) {
            return NextResponse.json({ 
                error: `You already have a store: "${existingSeller.store_name}"` 
            }, { status: 400 })
        }

        // 4. Check if store name is already taken
        const { data: nameExists } = await supabaseAdmin
            .from("sellers")
            .select("id")
            .ilike("store_name", trimmedName)
            .single()

        if (nameExists) {
            return NextResponse.json({ 
                error: `Store name "${trimmedName}" is already taken` 
            }, { status: 400 })
        }

        // 5. Ensure profile exists and has seller role
        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .upsert({
                id: user.id,
                email: user.email,
                role: 'seller'
            })

        if (profileError) {
            console.error("Profile Error:", profileError)
            throw profileError
        }

        // 6. Create new seller record (INSERT, not UPSERT)
        const { data: seller, error: sellerError } = await supabaseAdmin
            .from("sellers")
            .insert({
                id: user.id,
                store_name: trimmedName,
                description: description || null
            })
            .select()
            .single()

        if (sellerError) {
            console.error("Seller Error:", sellerError)
            // Handle unique constraint violation
            if (sellerError.code === '23505') {
                return NextResponse.json({ 
                    error: "Store name is already taken" 
                }, { status: 400 })
            }
            throw sellerError
        }

        return NextResponse.json(seller)
    } catch (error: unknown) {
        console.error("Store Creation Error:", error)
        const message = error instanceof Error ? error.message : "Internal Server Error"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
