"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import {
  avatarUrlSchema,
  buildGeneratedAvatar,
  isGeneratedAvatar,
} from "./profile-reads"

// =====================================================
// UPLOAD AVATAR
// =====================================================
export async function uploadAvatar(formData: FormData): Promise<{
  success: boolean
  avatarUrl?: string
  error?: string
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }

    const { user, supabase } = auth

    const file = formData.get("avatar") as File | null
    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" }
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { success: false, error: "File too large. Maximum size is 5MB" }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" }
    }

    // Get file extension from MIME type
    const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1]
    const fileName = `${user.id}-${Date.now()}.${extension}`
    const filePath = `${user.id}/${fileName}`

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      console.error("uploadAvatar storage error:", uploadError)
      return { success: false, error: "Failed to upload avatar" }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("uploadAvatar profile update error:", updateError)
      return { success: false, error: "Failed to update profile with new avatar" }
    }

    await revalidatePublicProfileTagsForUser(supabase, user.id, "max")
    return { success: true, avatarUrl: publicUrl }
  } catch (error) {
    console.error("uploadAvatar error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// SET AVATAR URL (Preset avatars)
// =====================================================
export async function setAvatarUrl(formData: FormData): Promise<{
  success: boolean
  avatarUrl?: string
  error?: string
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }

    const { user, supabase } = auth

    const rawData = {
      avatar_url: formData.get("avatar_url") as string | null,
    }

    const validationResult = avatarUrlSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      }
    }

    const avatarUrl = validationResult.data.avatar_url

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("setAvatarUrl error:", updateError)
      return { success: false, error: "Failed to update avatar" }
    }

    await revalidatePublicProfileTagsForUser(supabase, user.id, "max")
    return { success: true, avatarUrl }
  } catch (error) {
    console.error("setAvatarUrl error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// DELETE AVATAR
// =====================================================
export async function deleteAvatar(): Promise<{
  success: boolean
  avatarUrl?: string
  error?: string
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }

    const { user, supabase } = auth

    // Get current avatar URL + username (used for deterministic generated fallback)
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url, username")
      .eq("id", user.id)
      .single()

    const currentAvatar = profile?.avatar_url
    const usernameSeed = profile?.username ?? user.email?.split("@")[0] ?? user.id
    const generatedAvatar = buildGeneratedAvatar(usernameSeed)

    // If there's a custom storage avatar, try to delete it from storage.
    if (currentAvatar && !isGeneratedAvatar(currentAvatar)) {
      try {
        const url = new URL(currentAvatar)
        const pathParts = url.pathname.split("/avatars/")
        if (pathParts.length > 1) {
          const filePath = pathParts[1]
          if (filePath) {
            await supabase.storage.from("avatars").remove([filePath])
          }
        }
      } catch {
        // Ignore invalid legacy avatar URLs; we still reset to generated avatar below.
      }
    }

    // Lock-down rule: never leave avatar_url empty in production.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: generatedAvatar,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      return { success: false, error: "Failed to update profile" }
    }

    await revalidatePublicProfileTagsForUser(supabase, user.id, "max")
    return { success: true, avatarUrl: generatedAvatar }
  } catch (error) {
    console.error("deleteAvatar error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

