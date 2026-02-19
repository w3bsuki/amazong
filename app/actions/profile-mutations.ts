"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import {
  emailSchema,
  passwordSchema,
  profileSchema,
} from "./profile-reads"

export { deleteAvatar, setAvatarUrl, uploadAvatar } from "./profile-avatar-mutations"

// =====================================================
// PROFILE MANAGEMENT SERVER ACTIONS
// For users to manage their profile, avatar, and account settings
// =====================================================

// =====================================================
// UPDATE PROFILE
// =====================================================
export async function updateProfile(formData: FormData): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
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
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      }
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
      console.error("updateProfile error:", updateError || privateError)
      return { success: false, error: "Failed to update profile" }
    }

    await revalidatePublicProfileTagsForUser(supabase, user.id, "max")
    return { success: true }
  } catch (error) {
    console.error("updateProfile error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// UPDATE EMAIL
// =====================================================
export async function updateEmail(formData: FormData): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }

    const { user, supabase } = auth

    const newEmail = formData.get("email") as string
    const validationResult = emailSchema.safeParse({ email: newEmail })

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid email",
      }
    }

    // Check if email is already in use
    if (newEmail === user.email) {
      return { success: false, error: "New email is the same as current email" }
    }

    // Update email - Supabase will send a confirmation email
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (updateError) {
      console.error("updateEmail error:", updateError)
      if (updateError.message.includes("already registered")) {
        return { success: false, error: "This email is already registered" }
      }
      return { success: false, error: "Failed to update email" }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("updateEmail error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// UPDATE PASSWORD
// =====================================================
export async function updatePassword(formData: FormData): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }

    const { user, supabase } = auth

    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validationResult = passwordSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message || "Invalid input",
      }
    }

    // Verify current password by attempting to sign in
    if (!user.email) {
      return { success: false, error: "Password update is not available for this account" }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: rawData.currentPassword,
    })

    if (signInError) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: rawData.newPassword,
    })

    if (updateError) {
      console.error("updatePassword error:", updateError)
      return { success: false, error: "Failed to update password" }
    }

    return { success: true }
  } catch (error) {
    console.error("updatePassword error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
