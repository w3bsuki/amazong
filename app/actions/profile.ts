"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePublicProfileTagsForUser } from "@/lib/cache/revalidate-profile-tags"
import { z } from "zod"

// =====================================================
// PROFILE MANAGEMENT SERVER ACTIONS
// For users to manage their profile, avatar, and account settings
// =====================================================

// Validation schemas
const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  shipping_region: z.string().max(100).optional().nullable(),
  country_code: z.string().max(2).optional().nullable(),
})

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const ALLOWED_AVATAR_VARIANTS = ["marble", "pixel", "sunset", "ring", "bauhaus"] as const

function getPaletteIndexFromSeed(seed: string): number {
  const paletteCount = 6
  if (seed.length === 0) return 0

  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }

  return hash % paletteCount
}

function buildGeneratedAvatar(seed: string, paletteIndex?: number): string {
  const resolvedSeed = seed.trim().length > 0 ? seed.trim() : "user"
  const resolvedPalette = paletteIndex ?? getPaletteIndexFromSeed(resolvedSeed)
  return `boring-avatar:marble:${resolvedPalette}:${resolvedSeed}`
}

function isGeneratedAvatar(value: string): boolean {
  if (!value.startsWith("boring-avatar:")) return false
  const [, variant, palette, seed] = value.split(":")
  if (!variant || !palette || !seed) return false
  if (!ALLOWED_AVATAR_VARIANTS.includes(variant as (typeof ALLOWED_AVATAR_VARIANTS)[number])) return false
  return Number.isInteger(Number.parseInt(palette, 10))
}

function isSafeAvatarUrl(value: string): boolean {
  if (isGeneratedAvatar(value)) return true
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

const avatarUrlSchema = z.object({
  avatar_url: z
    .string()
    .max(500, "Avatar URL too long")
    .refine((value) => isSafeAvatarUrl(value), "Invalid avatar value"),
})

// =====================================================
// GET PROFILE
// =====================================================
async function getProfile(): Promise<{
  success: boolean
  data?: {
    id: string
    email: string | null
    full_name: string | null
    avatar_url: string | null
    phone: string | null
    shipping_region: string | null
    country_code: string | null
    role: string | null
    created_at: string
  }
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const [
      { data: profile, error: profileError },
      { data: privateProfile },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, avatar_url, shipping_region, country_code, role, created_at")
        .eq("id", user.id)
        .single(),
      supabase
        .from("private_profiles")
        .select("phone, email")
        .eq("id", user.id)
        .maybeSingle(),
    ])

    if (profileError) {
      return { success: false, error: "Failed to fetch profile" }
    }

    return {
      success: true,
      data: {
        ...profile,
        email: user.email ?? privateProfile?.email ?? null,
        phone: privateProfile?.phone ?? null,
      },
    }
  } catch (error) {
    console.error("getProfile error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// UPDATE PROFILE
// =====================================================
export async function updateProfile(formData: FormData): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

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
        error: validationResult.error.issues[0]?.message || "Invalid input" 
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

    const privateUpdatePayload = validatedData.phone !== undefined
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
// UPLOAD AVATAR
// =====================================================
export async function uploadAvatar(formData: FormData): Promise<{
  success: boolean
  avatarUrl?: string
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

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
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

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
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

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

// =====================================================
// UPDATE EMAIL
// =====================================================
export async function updateEmail(formData: FormData): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const newEmail = formData.get("email") as string
    const validationResult = emailSchema.safeParse({ email: newEmail })
    
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0]?.message || "Invalid email" 
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
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validationResult = passwordSchema.safeParse(rawData)
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0]?.message || "Invalid input" 
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

