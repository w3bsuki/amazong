"use server"

import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { fetchCurrentUserProfile, fetchPublicProfileByUsername, type PublicProfileRow } from "@/lib/data/profile"
import { updateProfileFields } from "@/lib/data/profile-mutations"
import { updateProfileBannerUrl, uploadFileToAvatarsBucket } from "@/lib/data/profile-avatar"
import { publicProfileSchema, requireUsernameAuth } from "./username-shared"
import type { z } from "zod"

import { logger } from "@/lib/logger"
export type UsernameProfileErrorCode =
  | "NOT_AUTHENTICATED"
  | "INVALID_PROFILE_DATA"
  | "NO_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"
  | "PUBLIC_PROFILE_UPDATE_FAILED"
  | "BANNER_UPLOAD_FAILED"
  | "BANNER_SAVE_FAILED"
  | "PROFILE_NOT_FOUND"
  | "UNKNOWN_ERROR"

export type UpdatePublicProfileResult = Envelope<
  Record<string, never>,
  { errorCode: UsernameProfileErrorCode }
>

function profileOk(): UpdatePublicProfileResult {
  return successEnvelope<Record<string, never>>()
}

function profileError(errorCode: UsernameProfileErrorCode) {
  return errorEnvelope({ errorCode })
}

/**
 * Update authenticated user's public profile fields.
 */
export async function updatePublicProfile(
  data: z.infer<typeof publicProfileSchema>
): Promise<UpdatePublicProfileResult> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return profileError("NOT_AUTHENTICATED")
    }
    const { userId, supabase } = auth

    const validation = publicProfileSchema.safeParse(data)
    if (!validation.success) {
      return profileError("INVALID_PROFILE_DATA")
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (data.display_name !== undefined) updateData.display_name = data.display_name || null
    if (data.bio !== undefined) updateData.bio = data.bio || null
    if (data.location !== undefined) updateData.location = data.location || null
    if (data.website_url !== undefined) updateData.website_url = data.website_url || null
    if (data.social_links !== undefined) updateData.social_links = data.social_links || {}

    const updateResult = await updateProfileFields({ supabase, userId, updateData })
    if (!updateResult.ok) {
      logger.error("[username-profile] public_profile_update_failed", updateResult.error, { userId })
      return profileError("PUBLIC_PROFILE_UPDATE_FAILED")
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return profileOk()
  } catch (error) {
    logger.error("[username-profile] public_profile_update_unexpected", error)
    return profileError("UNKNOWN_ERROR")
  }
}

export type UploadBannerResult = Envelope<
  { bannerUrl: string },
  { errorCode: UsernameProfileErrorCode }
>

/**
 * Upload and save profile banner image.
 */
export async function uploadBanner(formData: FormData): Promise<UploadBannerResult> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return profileError("NOT_AUTHENTICATED")
    }
    const { userId, supabase } = auth

    const file = formData.get("banner") as File | null
    if (!file || file.size === 0) {
      return profileError("NO_FILE")
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return profileError("FILE_TOO_LARGE")
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return profileError("INVALID_FILE_TYPE")
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const filename = `${userId}/banner.${ext}`

    const uploadResult = await uploadFileToAvatarsBucket({
      supabase,
      filePath: filename,
      file,
      options: { upsert: true, contentType: file.type },
    })

    if (!uploadResult.ok) {
      logger.error("[username-profile] banner_upload_failed", uploadResult.error, { userId })
      return profileError("BANNER_UPLOAD_FAILED")
    }

    const bannerUrl = `${uploadResult.publicUrl}?t=${Date.now()}`

    const updatedAt = new Date().toISOString()
    const updateResult = await updateProfileBannerUrl({ supabase, userId, bannerUrl, updatedAt })
    if (!updateResult.ok) {
      logger.error("[username-profile] banner_save_failed", updateResult.error, { userId })
      return profileError("BANNER_SAVE_FAILED")
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return successEnvelope({ bannerUrl })
  } catch (error) {
    logger.error("[username-profile] banner_upload_unexpected", error)
    return profileError("UNKNOWN_ERROR")
  }
}

export type PublicProfileReadResult = Envelope<
  {
    data: Omit<PublicProfileRow, "social_links"> & {
      social_links: Record<string, string> | null
    }
  },
  { errorCode: UsernameProfileErrorCode }
>

/**
 * Fetch profile by username for public profile route.
 */
export async function getPublicProfile(username: string): Promise<PublicProfileReadResult> {
  try {
    const profile = await fetchPublicProfileByUsername(username)
    if (!profile) {
      return profileError("PROFILE_NOT_FOUND")
    }

    const socialLinksData =
      profile.social_links && typeof profile.social_links === "object" && !Array.isArray(profile.social_links)
        ? (profile.social_links as Record<string, string>)
        : null

    return successEnvelope({
      data: {
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        banner_url: profile.banner_url,
        bio: profile.bio,
        account_type: profile.account_type,
        is_seller: profile.is_seller,
        is_verified_business: profile.is_verified_business,
        verified: profile.verified,
        location: profile.location,
        business_name: profile.account_type === "business" ? profile.business_name : null,
        website_url: profile.account_type === "business" ? profile.website_url : null,
        social_links: profile.account_type === "business" ? socialLinksData : null,
        created_at: profile.created_at,
      },
    })
  } catch (error) {
    logger.error("[username-profile] get_public_profile_unexpected", error)
    return profileError("UNKNOWN_ERROR")
  }
}

export type CurrentUserProfileResult = Envelope<
  { data: Record<string, unknown> },
  { data: null; error: string }
>

/**
 * Get full profile for currently authenticated user.
 */
export async function getCurrentUserProfile(): Promise<CurrentUserProfileResult> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return errorEnvelope({ data: null, error: auth.error })
    }
    const { userId, supabase } = auth

    const profile = await fetchCurrentUserProfile({ supabase, userId })
    if (!profile) {
      return errorEnvelope({ data: null, error: "Profile not found" })
    }

    return successEnvelope({
      data: {
        ...profile,
      },
    })
  } catch {
    return errorEnvelope({ data: null, error: "Failed to load profile" })
  }
}
