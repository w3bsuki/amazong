"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
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

import { logger } from "@/lib/logger"
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

type RequireAuthResult = Awaited<ReturnType<typeof requireAuth>>
type AuthedContext = NonNullable<RequireAuthResult>

type ProfileMutationResult = {
  success: boolean
  errorCode?: ProfileMutationErrorCode
}

async function getProfileMutationContext(): Promise<
  | { ok: true; user: AuthedContext["user"]; supabase: AuthedContext["supabase"] }
  | { ok: false; result: ProfileMutationResult }
> {
  const auth = await requireAuth()
  if (!auth) {
    return { ok: false, result: { success: false, errorCode: "NOT_AUTHENTICATED" } }
  }

  return { ok: true, user: auth.user, supabase: auth.supabase }
}

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
    const ctx = await getProfileMutationContext()
    if (!ctx.ok) return ctx.result

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
      ctx.supabase
        .from("profiles")
        .update(profileUpdatePayload)
        .eq("id", ctx.user.id),
      privateUpdatePayload
        ? ctx.supabase
            .from("private_profiles")
            .upsert({ id: ctx.user.id, ...privateUpdatePayload }, { onConflict: "id" })
        : Promise.resolve({ error: null }),
    ])

    if (updateError || privateError) {
      logger.error("[profile] update_profile_failed", updateError ?? privateError, { userId: ctx.user.id })
      return { success: false, errorCode: "PROFILE_UPDATE_FAILED" }
    }

    await revalidatePublicProfileTagsForUser(ctx.supabase, ctx.user.id, "max")
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
    const ctx = await getProfileMutationContext()
    if (!ctx.ok) return ctx.result

    const newEmail = formData.get("email") as string
    const validationResult = emailSchema.safeParse({ email: newEmail })

    if (!validationResult.success) {
      return { success: false, errorCode: "INVALID_EMAIL" }
    }

    // Check if email is already in use
    if (newEmail === ctx.user.email) {
      return { success: false, errorCode: "EMAIL_UNCHANGED" }
    }

    // Update email - Supabase will send a confirmation email
    const { error: updateError } = await ctx.supabase.auth.updateUser({
      email: newEmail,
    })

    if (updateError) {
      if (updateError.message.includes("already registered")) {
        return { success: false, errorCode: "EMAIL_ALREADY_REGISTERED" }
      }
      logger.error("[profile] update_email_failed", updateError, { userId: ctx.user.id })
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
    const ctx = await getProfileMutationContext()
    if (!ctx.ok) return ctx.result

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
    if (!ctx.user.email) {
      return { success: false, errorCode: "PASSWORD_UPDATE_UNAVAILABLE" }
    }

    const { error: signInError } = await ctx.supabase.auth.signInWithPassword({
      email: ctx.user.email,
      password: rawData.currentPassword,
    })

    if (signInError) {
      return { success: false, errorCode: "CURRENT_PASSWORD_INCORRECT" }
    }

    // Update password
    const { error: updateError } = await ctx.supabase.auth.updateUser({
      password: rawData.newPassword,
    })

    if (updateError) {
      logger.error("[profile] update_password_failed", updateError, { userId: ctx.user.id })
      return { success: false, errorCode: "PASSWORD_UPDATE_FAILED" }
    }

    return { success: true }
  } catch (error) {
    logger.error("[profile] update_password_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}
