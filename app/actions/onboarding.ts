"use server"

import { z } from "zod"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { getOnboardingProfileSnapshot, getUsernameForUser, updateOnboardingProfile } from "@/lib/data/onboarding"
import { uploadFileToAvatarsBucket } from "@/lib/data/profile-avatar"
import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"

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

type CompletePostSignupOnboardingResult = Envelope<
  Record<string, never>,
  { error: string }
>

type OnboardingStatusResult = Envelope<
  {
    needsOnboarding: boolean
    profile: {
      username: string | null
      displayName: string | null
      onboardingCompleted: boolean
    } | null
  }
>

function ok(): CompletePostSignupOnboardingResult {
  return successEnvelope<Record<string, never>>()
}

function fail(error: string): CompletePostSignupOnboardingResult {
  return errorEnvelope({ error })
}

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

type DbClient = SupabaseClient<Database>

async function uploadAvatarAsset(
  supabase: DbClient,
  userId: string,
  file: File,
  suffix: "avatar" | "banner"
): Promise<string | null> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}-${suffix}-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const result = await uploadFileToAvatarsBucket({
    supabase,
    filePath,
    file,
    options: { upsert: true, contentType: file.type },
  })

  if (!result.ok) {
    return null
  }

  return result.publicUrl
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
): Promise<CompletePostSignupOnboardingResult> {
  const parsed = onboardingSchema.safeParse(data)

  if (!parsed.success) {
    logger.error("[onboarding] validation_failed", parsed.error)
    return fail("Invalid data provided")
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
    return fail("Unauthorized")
  }

  const { supabase, user } = auth

  if (user.id !== userId) {
    return fail("Forbidden")
  }

  // Get current profile for username (needed for avatar generation)
  const username = (await getUsernameForUser({ supabase, userId })) || "user"

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

  const updateResult = await updateOnboardingProfile({ supabase, userId, updateData })

  if (!updateResult.ok) {
    logger.error("[onboarding] profile_update_failed", updateResult.error, { userId })
    return fail("Failed to update profile")
  }

  await revalidatePublicProfileTagsForUser(supabase, userId, "max")

  return ok()
}

/**
 * Check if a user needs to complete onboarding
 */
export async function checkOnboardingStatus(userId: string): Promise<OnboardingStatusResult> {
  const rawProfile = await getOnboardingProfileSnapshot(userId)

  if (!rawProfile) {
    return successEnvelope({
      needsOnboarding: false,
      profile: null,
    })
  }

  return successEnvelope({
    needsOnboarding: !rawProfile.onboardingCompleted,
    profile: {
      username: rawProfile.username,
      displayName: rawProfile.displayName,
      onboardingCompleted: rawProfile.onboardingCompleted,
    },
  })
}
