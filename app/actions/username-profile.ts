"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { logger } from "@/lib/logger"
import { publicProfileSchema, requireUsernameAuth } from "./username-shared"
import type { z } from "zod"

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

/**
 * Update authenticated user's public profile fields.
 */
export async function updatePublicProfile(data: z.infer<typeof publicProfileSchema>): Promise<{
  success: boolean
  errorCode?: UsernameProfileErrorCode
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, errorCode: "NOT_AUTHENTICATED" }
    }
    const { userId, supabase } = auth

    const validation = publicProfileSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, errorCode: "INVALID_PROFILE_DATA" }
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (data.display_name !== undefined) updateData.display_name = data.display_name || null
    if (data.bio !== undefined) updateData.bio = data.bio || null
    if (data.location !== undefined) updateData.location = data.location || null
    if (data.website_url !== undefined) updateData.website_url = data.website_url || null
    if (data.social_links !== undefined) updateData.social_links = data.social_links || {}

    const { error: updateError } = await supabase.from("profiles").update(updateData).eq("id", userId)

    if (updateError) {
      logger.error("[username-profile] public_profile_update_failed", updateError, { userId })
      return { success: false, errorCode: "PUBLIC_PROFILE_UPDATE_FAILED" }
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return { success: true }
  } catch (error) {
    logger.error("[username-profile] public_profile_update_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

/**
 * Upload and save profile banner image.
 */
export async function uploadBanner(formData: FormData): Promise<{
  success: boolean
  bannerUrl?: string
  errorCode?: UsernameProfileErrorCode
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, errorCode: "NOT_AUTHENTICATED" }
    }
    const { userId, supabase } = auth

    const file = formData.get("banner") as File | null
    if (!file || file.size === 0) {
      return { success: false, errorCode: "NO_FILE" }
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, errorCode: "FILE_TOO_LARGE" }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, errorCode: "INVALID_FILE_TYPE" }
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const filename = `${userId}/banner.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filename, file, { upsert: true })

    if (uploadError) {
      logger.error("[username-profile] banner_upload_failed", uploadError, { userId })
      return { success: false, errorCode: "BANNER_UPLOAD_FAILED" }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filename)

    const bannerUrl = `${publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        banner_url: bannerUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      logger.error("[username-profile] banner_save_failed", updateError, { userId })
      return { success: false, errorCode: "BANNER_SAVE_FAILED" }
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return { success: true, bannerUrl }
  } catch (error) {
    logger.error("[username-profile] banner_upload_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

/**
 * Fetch profile by username for public profile route.
 */
export async function getPublicProfile(username: string): Promise<{
  success: boolean
  data?: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
    banner_url: string | null
    bio: string | null
    account_type: string | null
    is_seller: boolean | null
    is_verified_business: boolean | null
    verified: boolean | null
    location: string | null
    business_name: string | null
    website_url: string | null
    social_links: Record<string, string> | null
    created_at: string
  }
  errorCode?: UsernameProfileErrorCode
}> {
  try {
    const supabase = await createClient()

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        banner_url,
        bio,
        account_type,
        is_seller,
        is_verified_business,
        verified,
        location,
        business_name,
        website_url,
        social_links,
        created_at
      `)
      .ilike("username", username)
      .single()

    if (error || !profile) {
      return { success: false, errorCode: "PROFILE_NOT_FOUND" }
    }

    const socialLinksData =
      profile.social_links && typeof profile.social_links === "object" && !Array.isArray(profile.social_links)
        ? (profile.social_links as Record<string, string>)
        : null

    return {
      success: true,
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
    }
  } catch (error) {
    logger.error("[username-profile] get_public_profile_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

/**
 * Get full profile for currently authenticated user.
 */
export async function getCurrentUserProfile() {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) return null
    const { userId, supabase } = auth

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        [
          "id",
          "username",
          "display_name",
          "avatar_url",
          "banner_url",
          "bio",
          "account_type",
          "is_seller",
          "is_verified_business",
          "verified",
          "location",
          "business_name",
          "website_url",
          "social_links",
          "created_at",
          "last_username_change",
          "tier",
        ].join(",")
      )
      .eq("id", userId)
      .single()

    if (!profile) return null

    const { data: privateProfile } = await supabase
      .from("private_profiles")
      .select("vat_number")
      .eq("id", userId)
      .maybeSingle()

    const baseProfile = profile as unknown as Record<string, unknown>
    return {
      ...baseProfile,
      vat_number: privateProfile?.vat_number ?? null,
    }
  } catch {
    return null
  }
}
