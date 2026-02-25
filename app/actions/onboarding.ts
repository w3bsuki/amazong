"use server"

import { z } from "zod"
import { requireAuth } from "@/lib/auth/require-auth"
import { createClient } from "@/lib/supabase/server"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"

import { logger } from "@/lib/logger"
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

type AvatarStorageClient = {
  storage: {
    from(bucket: string): {
      upload(
        path: string,
        file: File,
        options: { upsert: boolean }
      ): Promise<{ error: unknown; data: unknown }>
      getPublicUrl(path: string): { data: { publicUrl: string } }
    }
  }
}

async function uploadAvatarAsset(
  supabase: AvatarStorageClient,
  userId: string,
  file: File,
  suffix: "avatar" | "banner"
): Promise<string | null> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}-${suffix}-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error: uploadError, data: uploadData } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true })

  if (uploadError || !uploadData) {
    return null
  }

  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath)
  return publicUrl
}

function buildProfileUpdateData(params: {
  accountType: OnboardingData["accountType"]
  displayName: string | null
  bio: string | null
  businessName: string | null
  website: string | null
  location: string | null
  socialLinks: Record<string, string> | null
  avatarUrl: string
  bannerUrl: string | null
}): Record<string, unknown> {
  const {
    accountType,
    displayName,
    bio,
    businessName,
    website,
    location,
    socialLinks,
    avatarUrl,
    bannerUrl,
  } = params

  const updateData: Record<string, unknown> = {
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
    avatar_url: avatarUrl,
  }

  if (displayName) updateData.display_name = displayName
  if (bio) updateData.bio = bio
  if (bannerUrl) updateData.banner_url = bannerUrl
  if (location) updateData.location = location

  if (accountType === "business") {
    if (businessName) updateData.business_name = businessName
    if (website) updateData.website_url = website
  }

  if (socialLinks && Object.keys(socialLinks).length > 0) {
    updateData.social_links = socialLinks
  }

  return updateData
}

export async function completePostSignupOnboarding(
  data: OnboardingData,
  avatarFile: File | null,
  coverFile: File | null
): Promise<{ success: boolean; error?: string }> {
  const parsed = onboardingSchema.safeParse(data)

  if (!parsed.success) {
    logger.error("[onboarding] validation_failed", parsed.error)
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
    avatarPalette,
  } = parsed.data

  // Verify the user is authenticated and matches
  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "Unauthorized" }
  }

  const { supabase, user } = auth

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
    avatarUrl = await uploadAvatarAsset(supabase, userId, avatarFile, "avatar")
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
    bannerUrl = await uploadAvatarAsset(supabase, userId, coverFile, "banner")
  }

  const updateData = buildProfileUpdateData({
    accountType,
    displayName,
    bio,
    businessName,
    website,
    location,
    socialLinks,
    avatarUrl,
    bannerUrl,
  })

  // Update profile with authed client (RLS enforces ownership)
  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId)

  if (updateError) {
    logger.error("[onboarding] profile_update_failed", updateError, { userId })
    return { success: false, error: "Failed to update profile" }
  }

  await revalidatePublicProfileTagsForUser(supabase, userId, "max")

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
