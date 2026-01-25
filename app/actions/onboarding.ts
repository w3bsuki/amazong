"use server"

import { z } from "zod"
import { createAdminClient, createClient } from "@/lib/supabase/server"

export interface OnboardingData {
  userId: string
  intent: "sell" | "shop" | "browse"
  accountType: "personal" | "business" | null
  displayName: string | null
  bio: string | null
  businessName: string | null
  website: string | null
  location: string | null
  socialLinks: Record<string, string> | null
  avatarType: "custom" | "generated"
  avatarVariant?: string | undefined
  avatarPalette?: number | undefined
}

const onboardingSchema = z.object({
  userId: z.string().uuid(),
  intent: z.enum(["sell", "shop", "browse"]),
  accountType: z.enum(["personal", "business"]).nullable(),
  displayName: z.string().max(50).nullable(),
  bio: z.string().max(160).nullable(),
  businessName: z.string().max(100).nullable(),
  website: z.string().url().nullable().or(z.literal("")).transform(v => v || null),
  location: z.string().max(100).nullable(),
  socialLinks: z.record(z.string(), z.string()).nullable(),
  avatarType: z.enum(["custom", "generated"]),
  avatarVariant: z.string().optional(),
  avatarPalette: z.number().optional(),
})

export async function completePostSignupOnboarding(
  data: OnboardingData,
  avatarFile: File | null,
  coverFile: File | null
): Promise<{ success: boolean; error?: string }> {
  const parsed = onboardingSchema.safeParse(data)
  
  if (!parsed.success) {
    console.error("Onboarding validation error:", parsed.error)
    return { success: false, error: "Invalid data provided" }
  }

  const {
    userId,
    intent,
    accountType,
    displayName,
    bio,
    businessName,
    website,
    location,
    socialLinks,
    avatarType,
    avatarVariant,
    avatarPalette,
  } = parsed.data

  const supabase = await createClient()

  // Verify the user is authenticated and matches
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  if (user.id !== userId) {
    return { success: false, error: "Forbidden" }
  }

  // Get current profile for username (needed for avatar generation)
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single()

  const username = profile?.username || "user"

  // Upload avatar if custom
  let avatarUrl: string | null = null
  if (avatarType === "custom" && avatarFile) {
    const fileExt = avatarFile.name.split(".").pop()
    const fileName = `${userId}-avatar-${Date.now()}.${fileExt}`

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile, { upsert: true })

    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName)
      avatarUrl = publicUrl
    }
  } else if (avatarType === "generated" && avatarVariant !== undefined) {
    // Store as a special format that can be parsed by the avatar component
    avatarUrl = `boring-avatar:${avatarVariant}:${avatarPalette ?? 0}:${username}`
  }

  // Upload cover image if provided (business only)
  let bannerUrl: string | null = null
  if (coverFile && accountType === "business") {
    const fileExt = coverFile.name.split(".").pop()
    const fileName = `${userId}-banner-${Date.now()}.${fileExt}`

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("avatars") // Using same bucket for simplicity
      .upload(fileName, coverFile, { upsert: true })

    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName)
      bannerUrl = publicUrl
    }
  }

  // Determine if user is becoming a seller
  const isSeller = intent === "sell"
  const finalAccountType = isSeller && accountType ? accountType : "personal"

  // Build update object
  const updateData: Record<string, unknown> = {
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  }

  // Only update if values are provided
  if (displayName) updateData.display_name = displayName
  if (bio) updateData.bio = bio
  if (avatarUrl) updateData.avatar_url = avatarUrl
  if (bannerUrl) updateData.banner_url = bannerUrl
  if (location) updateData.location = location
  
  // Seller-specific updates
  if (isSeller) {
    updateData.is_seller = true
    updateData.role = "seller"
    updateData.account_type = finalAccountType
    
    if (finalAccountType === "business") {
      if (businessName) updateData.business_name = businessName
      if (website) updateData.website_url = website
    }
    
    if (socialLinks && Object.keys(socialLinks).length > 0) {
      updateData.social_links = socialLinks
    }
  }

  // Update profile
  // Use service role for sensitive profile fields (role/is_seller/account_type).
  const adminSupabase = createAdminClient()

  const { error: updateError } = await adminSupabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId)

  if (updateError) {
    console.error("Profile update error:", updateError)
    return { success: false, error: "Failed to update profile" }
  }

  // Create seller_stats if becoming a seller
  if (isSeller) {
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
      // Non-critical, log but don't fail
      console.error("Seller stats creation error:", statsError)
    }

    // Create user_verification entry if not exists
    const { error: verificationError } = await supabase
      .from("user_verification")
      .upsert(
        {
          user_id: userId,
          email_verified: true, // They confirmed their email to get here
        },
        { onConflict: "user_id" }
      )

    if (verificationError) {
      console.error("User verification creation error:", verificationError)
    }
  }

  return { success: true }
}

/**
 * Check if a user needs to complete onboarding
 */
export async function checkOnboardingStatus(userId: string): Promise<{
  needsOnboarding: boolean
  profile: {
    username: string | null
    displayName: string | null
    onboardingCompleted: boolean
  } | null
}> {
  const supabase = await createClient()

  const { data: rawProfile, error } = await supabase
    .from("profiles")
    .select("username, display_name, onboarding_completed")
    .eq("id", userId)
    .single()

  if (error || !rawProfile) {
    return { needsOnboarding: false, profile: null }
  }

  // Cast to expected shape (column may not be in generated types yet)
  const profile = rawProfile as {
    username?: string | null
    display_name?: string | null
    onboarding_completed?: boolean | null
  }

  return {
    needsOnboarding: !profile.onboarding_completed,
    profile: {
      username: profile.username ?? null,
      displayName: profile.display_name ?? null,
      onboardingCompleted: profile.onboarding_completed ?? false,
    },
  }
}
