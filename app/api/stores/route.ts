
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
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

        if (!storeName) {
            return NextResponse.json({ error: "Store name is required" }, { status: 400 })
        }

        // 2. Use Service Role to bypass RLS for sellers table
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // 3. Ensure profile exists and has seller role
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

        // 4. Create seller record
        const { error: sellerError } = await supabaseAdmin
            .from("sellers")
            .insert({
                id: user.id,
                store_name: storeName,
                description: description
            })

        if (sellerError) {
            console.error("Seller Error:", sellerError)
            throw sellerError
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Store Creation Error:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}
