"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { logger } from "@/lib/logger"
import {
  emailSchema,
  passwordSchema,
  profileSchema,
} from "./profile-reads"

import {
  deleteAvatar as deleteAvatarInner,
  type ProfileAvatarMutationErrorCode,
  setAvatarUrl as setAvatarUrlInner,
  uploadAvatar as uploadAvatarInner,
} from "./profile-avatar-mutations"

export type ProfileMutationErrorCode =
  | "NOT_AUTHENTICATED"
  | "INVALID_INPUT"
  | "INVALID_EMAIL"
  | "EMAIL_UNCHANGED"
  | "EMAIL_ALREADY_REGISTERED"
  | "PROFILE_UPDATE_FAILED"
  | "EMAIL_UPDATE_FAILED"
  | "PASSWORD_UPDATE_UNAVAILABLE"
  | "CURRENT_PASSWORD_INCORRECT"
  | "PASSWORD_UPDATE_FAILED"
  | "UNKNOWN_ERROR"

export type ProfileActionErrorCode = ProfileMutationErrorCode | ProfileAvatarMutationErrorCode

export async function uploadAvatar(formData: FormData) {
  return uploadAvatarInner(formData)
}

export async function setAvatarUrl(formData: FormData) {
  return setAvatarUrlInner(formData)
}

export async function deleteAvatar() {
  return deleteAvatarInner()
}

// =====================================================
// PROFILE MANAGEMENT SERVER ACTIONS
// For users to manage their profile, avatar, and account settings
// =====================================================

// =====================================================
// UPDATE PROFILE
// =====================================================
export async function updateProfile(formData: FormData): Promise<{
  success: boolean
  errorCode?: ProfileMutationErrorCode
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, errorCode: "NOT_AUTHENTICATED" }
    }

    const { user, supabase } = auth

    // Parse and validate form data
    const rawData = {
      full_name: formData.get("full_name") as string | null,
      phone: formData.get("phone") as string | null,
      shipping_region: formData.get("shipping_region") as string | null,
      country_code: formData.get("country_code") as string | null,
    }

    const validationResult = profileSchema.safeParse(rawData)
    if (!validationResult.success) {
      return { success: false, errorCode: "INVALID_INPUT" }
    }

    const { data: validatedData } = validationResult

    const updatedAt = new Date().toISOString()

    const profileUpdatePayload = {
      ...(validatedData.full_name !== undefined ? { full_name: validatedData.full_name } : {}),
      ...(validatedData.shipping_region !== undefined ? { shipping_region: validatedData.shipping_region } : {}),
      ...(validatedData.country_code !== undefined ? { country_code: validatedData.country_code } : {}),
      updated_at: updatedAt,
    }

    const privateUpdatePayload =
      validatedData.phone !== undefined
        ? { phone: validatedData.phone, updated_at: updatedAt }
        : null

    // Update public profile surface + private phone field
    const [{ error: updateError }, { error: privateError }] = await Promise.all([
      supabase
        .from("profiles")
        .update(profileUpdatePayload)
        .eq("id", user.id),
      privateUpdatePayload
        ? supabase
            .from("private_profiles")
            .upsert({ id: user.id, ...privateUpdatePayload }, { onConflict: "id" })
        : Promise.resolve({ error: null }),
    ])

    if (updateError || privateError) {
      logger.error("[profile] update_profile_failed", updateError ?? privateError, { userId: user.id })
      return { success: false, errorCode: "PROFILE_UPDATE_FAILED" }
    }

    await revalidatePublicProfileTagsForUser(supabase, user.id, "max")
    return { success: true }
  } catch (error) {
    logger.error("[profile] update_profile_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

// =====================================================
// UPDATE EMAIL
// =====================================================
export async function updateEmail(formData: FormData): Promise<{
  success: boolean
  errorCode?: ProfileMutationErrorCode
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, errorCode: "NOT_AUTHENTICATED" }
    }

    const { user, supabase } = auth

    const newEmail = formData.get("email") as string
    const validationResult = emailSchema.safeParse({ email: newEmail })

    if (!validationResult.success) {
      return { success: false, errorCode: "INVALID_EMAIL" }
    }

    // Check if email is already in use
    if (newEmail === user.email) {
      return { success: false, errorCode: "EMAIL_UNCHANGED" }
    }

    // Update email - Supabase will send a confirmation email
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (updateError) {
      if (updateError.message.includes("already registered")) {
        return { success: false, errorCode: "EMAIL_ALREADY_REGISTERED" }
      }
      logger.error("[profile] update_email_failed", updateError, { userId: user.id })
      return { success: false, errorCode: "EMAIL_UPDATE_FAILED" }
    }

    return {
      success: true,
    }
  } catch (error) {
    logger.error("[profile] update_email_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

// =====================================================
// UPDATE PASSWORD
// =====================================================
export async function updatePassword(formData: FormData): Promise<{
  success: boolean
  errorCode?: ProfileMutationErrorCode
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, errorCode: "NOT_AUTHENTICATED" }
    }

    const { user, supabase } = auth

    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validationResult = passwordSchema.safeParse(rawData)
    if (!validationResult.success) {
      return { success: false, errorCode: "INVALID_INPUT" }
    }

    // Verify current password by attempting to sign in
    if (!user.email) {
      return { success: false, errorCode: "PASSWORD_UPDATE_UNAVAILABLE" }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: rawData.currentPassword,
    })

    if (signInError) {
      return { success: false, errorCode: "CURRENT_PASSWORD_INCORRECT" }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: rawData.newPassword,
    })

    if (updateError) {
      logger.error("[profile] update_password_failed", updateError, { userId: user.id })
      return { success: false, errorCode: "PASSWORD_UPDATE_FAILED" }
    }

    return { success: true }
  } catch (error) {
    logger.error("[profile] update_password_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}
