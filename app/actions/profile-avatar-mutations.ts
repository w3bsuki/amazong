"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import {
  avatarUrlSchema,
  buildGeneratedAvatar,
  isGeneratedAvatar,
} from "./profile-reads"

import { logger } from "@/lib/logger"
export type ProfileAvatarMutationErrorCode =
  | "NOT_AUTHENTICATED"
  | "NO_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"
  | "INVALID_INPUT"
  | "AVATAR_UPLOAD_FAILED"
  | "AVATAR_PROFILE_UPDATE_FAILED"
  | "AVATAR_UPDATE_FAILED"
  | "AVATAR_RESET_FAILED"
  | "UNKNOWN_ERROR"

type RequireAuthResult = Awaited<ReturnType<typeof requireAuth>>
type AuthedContext = NonNullable<RequireAuthResult>

type ProfileAvatarMutationResult = {
  success: boolean
  avatarUrl?: string
  errorCode?: ProfileAvatarMutationErrorCode
}

async function getProfileAvatarMutationContext(): Promise<
  | { ok: true; user: AuthedContext["user"]; supabase: AuthedContext["supabase"] }
  | { ok: false; result: ProfileAvatarMutationResult }
> {
  const auth = await requireAuth()
  if (!auth) {
    return { ok: false, result: { success: false, errorCode: "NOT_AUTHENTICATED" } }
  }

  return { ok: true, user: auth.user, supabase: auth.supabase }
}

async function revalidateAvatarTags(supabase: AuthedContext["supabase"], userId: string) {
  await revalidatePublicProfileTagsForUser(supabase, userId, "max")
}

// =====================================================
// UPLOAD AVATAR
// =====================================================
export async function uploadAvatar(formData: FormData): Promise<{
  success: boolean
  avatarUrl?: string
  errorCode?: ProfileAvatarMutationErrorCode
}> {
  try {
    const ctx = await getProfileAvatarMutationContext()
    if (!ctx.ok) return ctx.result

    const { user, supabase } = ctx

    const file = formData.get("avatar") as File | null
    if (!file || file.size === 0) {
      return { success: false, errorCode: "NO_FILE" }
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { success: false, errorCode: "FILE_TOO_LARGE" }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, errorCode: "INVALID_FILE_TYPE" }
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
      logger.error("[profile-avatar] upload_avatar_storage_failed", uploadError, { userId: user.id })
      return { success: false, errorCode: "AVATAR_UPLOAD_FAILED" }
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
      logger.error("[profile-avatar] upload_avatar_profile_update_failed", updateError, { userId: user.id })
      return { success: false, errorCode: "AVATAR_PROFILE_UPDATE_FAILED" }
    }

    await revalidateAvatarTags(supabase, user.id)
    return { success: true, avatarUrl: publicUrl }
  } catch (error) {
    logger.error("[profile-avatar] upload_avatar_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

// =====================================================
// SET AVATAR URL (Preset avatars)
// =====================================================
export async function setAvatarUrl(formData: FormData): Promise<{
  success: boolean
  avatarUrl?: string
  errorCode?: ProfileAvatarMutationErrorCode
}> {
  try {
    const ctx = await getProfileAvatarMutationContext()
    if (!ctx.ok) return ctx.result

    const { user, supabase } = ctx

    const rawData = {
      avatar_url: formData.get("avatar_url") as string | null,
    }

    const validationResult = avatarUrlSchema.safeParse(rawData)
    if (!validationResult.success) {
      return { success: false, errorCode: "INVALID_INPUT" }
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
      logger.error("[profile-avatar] set_avatar_url_update_failed", updateError, { userId: user.id })
      return { success: false, errorCode: "AVATAR_UPDATE_FAILED" }
    }

    await revalidateAvatarTags(supabase, user.id)
    return { success: true, avatarUrl }
  } catch (error) {
    logger.error("[profile-avatar] set_avatar_url_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

// =====================================================
// DELETE AVATAR
// =====================================================
export async function deleteAvatar(): Promise<{
  success: boolean
  avatarUrl?: string
  errorCode?: ProfileAvatarMutationErrorCode
}> {
  try {
    const ctx = await getProfileAvatarMutationContext()
    if (!ctx.ok) return ctx.result

    const { user, supabase } = ctx

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
      return { success: false, errorCode: "AVATAR_RESET_FAILED" }
    }

    await revalidateAvatarTags(supabase, user.id)
    return { success: true, avatarUrl: generatedAvatar }
  } catch (error) {
    logger.error("[profile-avatar] delete_avatar_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}
