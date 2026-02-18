"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { publicProfileSchema, requireUsernameAuth } from "./username-shared"
import type { z } from "zod"

/**
 * Update authenticated user's public profile fields.
 */
export async function updatePublicProfile(data: z.infer<typeof publicProfileSchema>): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { userId, supabase } = auth

    const validation = publicProfileSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message ?? "Invalid profile data" }
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
      console.error("updatePublicProfile error:", updateError)
      return { success: false, error: "Failed to update profile" }
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return { success: true }
  } catch (error) {
    console.error("updatePublicProfile error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Upload and save profile banner image.
 */
export async function uploadBanner(formData: FormData): Promise<{
  success: boolean
  bannerUrl?: string
  error?: string
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { userId, supabase } = auth

    const file = formData.get("banner") as File | null
    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" }
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: "File too large. Maximum size is 5MB" }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Use JPEG, PNG, or WebP" }
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const filename = `${userId}/banner.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filename, file, { upsert: true })

    if (uploadError) {
      console.error("uploadBanner storage error:", uploadError)
      return { success: false, error: "Failed to upload banner" }
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
      console.error("uploadBanner profile error:", updateError)
      return { success: false, error: "Failed to save banner URL" }
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return { success: true, bannerUrl }
  } catch (error) {
    console.error("uploadBanner error:", error)
    return { success: false, error: "An unexpected error occurred" }
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
  error?: string
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
      return { success: false, error: "Profile not found" }
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
    console.error("getPublicProfile error:", error)
    return { success: false, error: "An unexpected error occurred" }
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

