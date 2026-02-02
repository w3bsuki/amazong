import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface OnboardingCompleteRequest {
  username?: string
  displayName?: string
  businessName?: string
  accountType: "personal" | "business"
  category?: string
  website?: string
  location?: string
  interests?: string[]
  avatarType?: "custom" | "generated"
  avatarVariant?: string
  avatarPalette?: number
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  try {
    const body: OnboardingCompleteRequest = await request.json()
    const { locale } = await params

    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Build profile update object
    const profileUpdate: Record<string, unknown> = {
      onboarding_completed: true,
      account_type: body.accountType,
    }

    if (body.username) {
      profileUpdate.username = body.username
    }

    if (body.displayName) {
      profileUpdate.display_name = body.displayName
    }

    if (body.location) {
      profileUpdate.location_city = body.location
    }

    if (body.interests && body.interests.length > 0) {
      profileUpdate.interests = body.interests
    }

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", user.id)

    if (profileError) {
      console.error("Error updating profile:", profileError)
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    // If business account, update private_profiles for business-specific fields
    if (body.accountType === "business") {
      const privateProfileUpdate: Record<string, unknown> = {}

      if (body.businessName) {
        privateProfileUpdate.business_name = body.businessName
      }

      if (body.website) {
        privateProfileUpdate.business_website = body.website
      }

      if (body.category) {
        privateProfileUpdate.business_category = body.category
      }

      // Only update if there are business fields to save
      if (Object.keys(privateProfileUpdate).length > 0) {
        const { error: privateError } = await supabase
          .from("private_profiles")
          .upsert({
            id: user.id,
            ...privateProfileUpdate,
          })

        if (privateError) {
          console.error("Error updating private profile:", privateError)
          // Non-critical error, don't fail the whole request
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
