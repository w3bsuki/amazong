"use server"

import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import {
  updateProfileAndPrivateProfile,
  updateUserEmail,
  updateUserPasswordWithVerification,
} from "@/lib/data/profile-mutations"
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

type ProfileMutationResult = Envelope<
  Record<string, never>,
  { errorCode: ProfileMutationErrorCode }
>

type ProfileAvatarMutationResult = Envelope<
  { avatarUrl: string },
  { errorCode: ProfileAvatarMutationErrorCode }
>

function ok(): ProfileMutationResult {
  return successEnvelope<Record<string, never>>()
}

function fail(errorCode: ProfileMutationErrorCode): ProfileMutationResult {
  return errorEnvelope({ errorCode })
}

async function getProfileMutationContext(): Promise<
  | { ok: true; user: AuthedContext["user"]; supabase: AuthedContext["supabase"] }
  | { ok: false; result: ProfileMutationResult }
> {
  const auth = await requireAuth()
  if (!auth) {
    return { ok: false, result: fail("NOT_AUTHENTICATED") }
  }

  return { ok: true, user: auth.user, supabase: auth.supabase }
}

export async function uploadAvatar(formData: FormData): Promise<ProfileAvatarMutationResult> {
  return uploadAvatarInner(formData)
}

export async function setAvatarUrl(formData: FormData): Promise<ProfileAvatarMutationResult> {
  return setAvatarUrlInner(formData)
}

export async function deleteAvatar(): Promise<ProfileAvatarMutationResult> {
  return deleteAvatarInner()
}

// =====================================================
// PROFILE MANAGEMENT SERVER ACTIONS
// For users to manage their profile, avatar, and account settings
// =====================================================

// =====================================================
// UPDATE PROFILE
// =====================================================
export async function updateProfile(formData: FormData): Promise<ProfileMutationResult> {
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
      return fail("INVALID_INPUT")
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

    const result = await updateProfileAndPrivateProfile({
      supabase: ctx.supabase,
      userId: ctx.user.id,
      profileUpdatePayload,
      privateProfilePayload: privateUpdatePayload,
    })

    if (!result.ok) {
      logger.error("[profile] update_profile_failed", result.error, { userId: ctx.user.id })
      return fail("PROFILE_UPDATE_FAILED")
    }

    await revalidatePublicProfileTagsForUser(ctx.supabase, ctx.user.id, "max")
    return ok()
  } catch (error) {
    logger.error("[profile] update_profile_unexpected", error)
    return fail("UNKNOWN_ERROR")
  }
}

// =====================================================
// UPDATE EMAIL
// =====================================================
export async function updateEmail(formData: FormData): Promise<ProfileMutationResult> {
  try {
    const ctx = await getProfileMutationContext()
    if (!ctx.ok) return ctx.result

    const newEmail = formData.get("email") as string
    const validationResult = emailSchema.safeParse({ email: newEmail })

    if (!validationResult.success) {
      return fail("INVALID_EMAIL")
    }

    // Check if email is already in use
    if (newEmail === ctx.user.email) {
      return fail("EMAIL_UNCHANGED")
    }

    const result = await updateUserEmail({ supabase: ctx.supabase, email: newEmail })

    if (!result.ok) {
      const message =
        typeof result.error === "object" && result.error !== null && "message" in result.error
          ? String((result.error as { message?: unknown }).message ?? "")
          : ""

      if (message.includes("already registered")) {
        return fail("EMAIL_ALREADY_REGISTERED")
      }

      logger.error("[profile] update_email_failed", result.error, { userId: ctx.user.id })
      return fail("EMAIL_UPDATE_FAILED")
    }

    return ok()
  } catch (error) {
    logger.error("[profile] update_email_unexpected", error)
    return fail("UNKNOWN_ERROR")
  }
}

// =====================================================
// UPDATE PASSWORD
// =====================================================
export async function updatePassword(formData: FormData): Promise<ProfileMutationResult> {
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
      return fail("INVALID_INPUT")
    }

    // Verify current password by attempting to sign in
    if (!ctx.user.email) {
      return fail("PASSWORD_UPDATE_UNAVAILABLE")
    }

    const result = await updateUserPasswordWithVerification({
      supabase: ctx.supabase,
      email: ctx.user.email,
      currentPassword: rawData.currentPassword,
      newPassword: rawData.newPassword,
    })

    if (!result.ok) {
      if (result.reason === "CURRENT_PASSWORD_INCORRECT") {
        return fail("CURRENT_PASSWORD_INCORRECT")
      }

      logger.error("[profile] update_password_failed", result.error, { userId: ctx.user.id })
      return fail("PASSWORD_UPDATE_FAILED")
    }

    return ok()
  } catch (error) {
    logger.error("[profile] update_password_unexpected", error)
    return fail("UNKNOWN_ERROR")
  }
}
