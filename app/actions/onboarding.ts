"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export interface OnboardingData {
  userId: string
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

function getPaletteIndexFromSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash % 6
}

function buildGeneratedAvatar(seed: string, palette?: number): string {
  const safeSeed = seed.trim().length > 0 ? seed.trim() : "user"
  const paletteIndex = palette ?? getPaletteIndexFromSeed(safeSeed)
  return `boring-avatar:marble:${paletteIndex}:${safeSeed}`
}

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
    const filePath = `${userId}/${fileName}`

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true })

    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath)
      avatarUrl = publicUrl
    }
  } else if (avatarType === "generated") {
    // Lock-down rule: generated avatar must always resolve to a supported preset.
    avatarUrl = buildGeneratedAvatar(username, avatarPalette)
  }

  if (!avatarUrl) {
    avatarUrl = buildGeneratedAvatar(username)
  }

  // Upload cover image if provided (business only)
  let bannerUrl: string | null = null
  if (coverFile && accountType === "business") {
    const fileExt = coverFile.name.split(".").pop()
    const fileName = `${userId}-banner-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("avatars") // Using same bucket for simplicity
      .upload(filePath, coverFile, { upsert: true })

    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath)
      bannerUrl = publicUrl
    }
  }

  // Build update object - simplified without intent, just update profile
  const updateData: Record<string, unknown> = {
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  }

  // Only update if values are provided
  if (displayName) updateData.display_name = displayName
  if (bio) updateData.bio = bio
  updateData.avatar_url = avatarUrl
  if (bannerUrl) updateData.banner_url = bannerUrl
  if (location) updateData.location = location
  
  // Business account-specific updates
  if (accountType === "business") {
    if (businessName) updateData.business_name = businessName
    if (website) updateData.website_url = website
  }
  
  // Social links for all account types
  if (socialLinks && Object.keys(socialLinks).length > 0) {
    updateData.social_links = socialLinks
  }

  // Update profile with authed client (RLS enforces ownership)
  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId)

  if (updateError) {
    console.error("Profile update error:", updateError)
    return { success: false, error: "Failed to update profile" }
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

  return {
    needsOnboarding: !rawProfile.onboarding_completed,
    profile: {
      username: rawProfile.username ?? null,
      displayName: rawProfile.display_name ?? null,
      onboardingCompleted: rawProfile.onboarding_completed ?? false,
    },
  }
}
