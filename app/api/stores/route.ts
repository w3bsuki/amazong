import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient, createAdminClient } from "@/lib/supabase/server"

/**
 * @deprecated This route is deprecated. Users now get a username at signup.
 * This route now updates the user's profile with seller-related fields.
 * The sellers table has been merged into the profiles table.
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Verify the user is authenticated
        const { supabase: supabaseUser, applyCookies } = createRouteHandlerClient(request)

        const { data: { user } } = await supabaseUser.auth.getUser()
        if (!user) {
            return applyCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))
        }

        const body = await request.json()
        const { 
            storeName, 
            description,
            accountType = "personal",
            businessName,
            vatNumber,
            websiteUrl,
            facebookUrl,
            instagramUrl,
            tiktokUrl
        } = body

        if (!storeName || typeof storeName !== 'string' || storeName.trim().length < 2) {
            return applyCookies(NextResponse.json({ error: "Display name must be at least 2 characters" }, { status: 400 }))
        }

        const trimmedName = storeName.trim()

        // Validate account type
        if (!["personal", "business"].includes(accountType)) {
            return applyCookies(NextResponse.json({ error: "Invalid account type" }, { status: 400 }))
        }

        // 2. Use Service Role to bypass RLS
        const supabaseAdmin = createAdminClient()

        // 3. Get existing profile
        const { data: existingProfile } = await supabaseAdmin
            .from("profiles")
            .select("id, display_name, username, account_type")
            .eq("id", user.id)
            .single()

        if (!existingProfile) {
            return applyCookies(NextResponse.json({ error: "Profile not found" }, { status: 404 }))
        }

        // 4. Build profile update data
        // Seller fields are now on profiles table
        const profileData: Record<string, unknown> = {
            display_name: trimmedName,
            bio: description || null,
            account_type: accountType,
            tier: existingProfile.account_type === accountType ? undefined : 'free', // Only reset tier if changing account type
            commission_rate: accountType === 'business' ? 10.00 : 12.00, // Business gets better rate
            final_value_fee: accountType === 'business' ? 10.00 : 12.00,
            insertion_fee: 0,
            per_order_fee: 0,
            role: 'seller'
        }

        // Add business-specific fields if business account
        if (accountType === "business") {
            if (businessName) profileData.business_name = businessName
            if (vatNumber) profileData.vat_number = vatNumber
            if (websiteUrl) profileData.website_url = websiteUrl
            if (facebookUrl) profileData.facebook_url = facebookUrl
            if (instagramUrl) profileData.instagram_url = instagramUrl
            if (tiktokUrl) profileData.tiktok_url = tiktokUrl
        }

        // Remove undefined values
        Object.keys(profileData).forEach(key => {
            if (profileData[key] === undefined) {
                delete profileData[key]
            }
        })

        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .update(profileData)
            .eq("id", user.id)
            .select()
            .single()

        if (profileError) {
            console.error("Profile Update Error:", profileError)
            throw profileError
        }

        return applyCookies(NextResponse.json(profile))
    } catch (error: unknown) {
        console.error("Store Creation Error:", error)
        const message = error instanceof Error ? error.message : "Internal Server Error"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}