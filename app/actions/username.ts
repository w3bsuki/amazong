"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"
import { z } from "zod"

// =====================================================
// USERNAME & PUBLIC PROFILE MANAGEMENT
// =====================================================

// Username validation schema
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(/^[a-z0-9]/, "Username must start with a letter or number")
  .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores")
  .refine((val) => !val.includes("__"), "Username cannot have consecutive underscores")
  .refine((val) => !val.endsWith("_"), "Username cannot end with an underscore")

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
  "admin", "administrator", "support", "help", "info", "contact",
  "treido", "store", "shop", "seller", "buyer", "user", "users",
  "account", "settings", "profile", "members", "member", "api",
  "auth", "login", "signup", "register", "logout", "signout",
  "home", "index", "about", "terms", "privacy", "legal",
  "search", "explore", "discover", "trending", "popular",
  "checkout", "cart", "order", "orders", "payment", "payments",
  "sell", "selling", "buy", "buying", "deals", "offers",
  "messages", "notifications", "inbox", "outbox",
  "test", "demo", "example", "null", "undefined", "root",
]

// =====================================================
// CHECK USERNAME AVAILABILITY
// =====================================================
export async function checkUsernameAvailability(username: string): Promise<{
  available: boolean
  error?: string
}> {
  try {
    const normalizedUsername = username.toLowerCase().trim()
    
    // Validate format
    const validation = usernameSchema.safeParse(normalizedUsername)
    if (!validation.success) {
      return { available: false, error: validation.error.errors[0]?.message ?? "Invalid username" }
    }
    
    // Check reserved
    if (RESERVED_USERNAMES.includes(normalizedUsername)) {
      return { available: false, error: "This username is reserved" }
    }
    
    const supabase = await createClient()
    if (!supabase) {
      return { available: false, error: "Database connection failed" }
    }
    
    // Check if taken
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", normalizedUsername)
      .maybeSingle()
    
    if (existing) {
      return { available: false, error: "This username is already taken" }
    }
    
    return { available: true }
  } catch (error) {
    console.error("checkUsernameAvailability error:", error)
    return { available: false, error: "Failed to check username" }
  }
}

// =====================================================
// SET USERNAME (First time or change)
// =====================================================
export async function setUsername(username: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }
    
    const normalizedUsername = username.toLowerCase().trim()
    
    // Validate format
    const validation = usernameSchema.safeParse(normalizedUsername)
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message ?? "Invalid username" }
    }
    
    // Check reserved
    if (RESERVED_USERNAMES.includes(normalizedUsername)) {
      return { success: false, error: "This username is reserved" }
    }
    
    // Get current profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, last_username_change")
      .eq("id", user.id)
      .single()

    const previousUsername = profile?.username ? profile.username.toLowerCase().trim() : null
    
    // Check if this is a change (not first time)
    if (profile?.username) {
      // Check if change is allowed (14 day cooldown)
      if (profile.last_username_change) {
        const lastChange = new Date(profile.last_username_change)
        const cooldownEnd = new Date(lastChange.getTime() + 14 * 24 * 60 * 60 * 1000)
        
        if (new Date() < cooldownEnd) {
          const daysLeft = Math.ceil((cooldownEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
          return { 
            success: false, 
            error: `You can change your username in ${daysLeft} day${daysLeft > 1 ? 's' : ''}` 
          }
        }
      }
      
      // Record the change in history
      await supabase.from("username_history").insert({
        user_id: user.id,
        old_username: profile.username,
        new_username: normalizedUsername,
      })
    }
    
    // Check availability
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", normalizedUsername)
      .neq("id", user.id)
      .maybeSingle()
    
    if (existing) {
      return { success: false, error: "This username is already taken" }
    }
    
    // Update username
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: normalizedUsername,
        last_username_change: profile?.username ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
    
    if (updateError) {
      console.error("setUsername error:", updateError)
      return { success: false, error: "Failed to update username" }
    }

    revalidateTag("profiles", "max")
    revalidateTag(`profile-${normalizedUsername}`, "max")
    revalidateTag(`profile-meta-${normalizedUsername}`, "max")
    revalidateTag(`seller-${user.id}`, "max")
    revalidateTag(`seller-${normalizedUsername}`, "max")
    if (previousUsername) {
      revalidateTag(`profile-${previousUsername}`, "max")
      revalidateTag(`profile-meta-${previousUsername}`, "max")
      revalidateTag(`seller-${previousUsername}`, "max")
    }
    
    return { success: true }
  } catch (error) {
    console.error("setUsername error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// UPDATE PUBLIC PROFILE
// =====================================================
const publicProfileSchema = z.object({
  display_name: z.string().max(50, "Display name must be less than 50 characters").optional().nullable(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
  location: z.string().max(100, "Location must be less than 100 characters").optional().nullable(),
  website_url: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  social_links: z.object({
    facebook: z.string().optional().nullable(),
    instagram: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
    tiktok: z.string().optional().nullable(),
    youtube: z.string().optional().nullable(),
  }).optional().nullable(),
})

export async function updatePublicProfile(data: z.infer<typeof publicProfileSchema>): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }
    
    // Validate
    const validation = publicProfileSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message ?? "Invalid profile data" }
    }
    
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    
    if (data.display_name !== undefined) updateData.display_name = data.display_name || null
    if (data.bio !== undefined) updateData.bio = data.bio || null
    if (data.location !== undefined) updateData.location = data.location || null
    if (data.website_url !== undefined) updateData.website_url = data.website_url || null
    if (data.social_links !== undefined) updateData.social_links = data.social_links || {}
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
    
    if (updateError) {
      console.error("updatePublicProfile error:", updateError)
      return { success: false, error: "Failed to update profile" }
    }
    
    revalidateTag("profiles", "max")
    
    return { success: true }
  } catch (error) {
    console.error("updatePublicProfile error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// UPLOAD BANNER IMAGE
// =====================================================
export async function uploadBanner(formData: FormData): Promise<{
  success: boolean
  bannerUrl?: string
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }
    
    const file = formData.get("banner") as File | null
    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" }
    }
    
    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { success: false, error: "File too large. Maximum size is 5MB" }
    }
    
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Use JPEG, PNG, or WebP" }
    }
    
    // Generate filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const filename = `${user.id}/banner.${ext}`
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars") // Reuse avatars bucket for banners
      .upload(filename, file, { upsert: true })
    
    if (uploadError) {
      console.error("uploadBanner storage error:", uploadError)
      return { success: false, error: "Failed to upload banner" }
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filename)
    
    // Add cache-busting query param
    const bannerUrl = `${publicUrl}?t=${Date.now()}`
    
    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        banner_url: bannerUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)
    
    if (updateError) {
      console.error("uploadBanner profile error:", updateError)
      return { success: false, error: "Failed to save banner URL" }
    }

    revalidateTag("profiles", "max")
    
    return { success: true, bannerUrl }
  } catch (error) {
    console.error("uploadBanner error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// UPGRADE TO BUSINESS ACCOUNT
// =====================================================
const businessUpgradeSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters").max(100),
  vat_number: z.string().optional().nullable(),
  business_address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  }).optional().nullable(),
  website_url: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  change_username: z.boolean().optional(),
  new_username: z.string().optional(),
})

export async function upgradeToBusinessAccount(data: z.infer<typeof businessUpgradeSchema>): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }
    
    // Validate
    const validation = businessUpgradeSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message ?? "Invalid business data" }
    }
    
    // If changing username with upgrade
    if (data.change_username && data.new_username) {
      const usernameResult = await setUsername(data.new_username)
      if (!usernameResult.success) {
        return { success: false, error: `Username: ${usernameResult.error ?? "Failed to set username"}` }
      }
    }
    
    // Update to business account
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        account_type: "business",
        business_name: data.business_name,
        vat_number: data.vat_number || null,
        business_address: data.business_address || null,
        website_url: data.website_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
    
    if (updateError) {
      console.error("upgradeToBusinessAccount error:", updateError)
      return { success: false, error: "Failed to upgrade account" }
    }

    // Create business_verification record for future verification
    await supabase
      .from("business_verification")
      .upsert(
        {
          seller_id: user.id,
          legal_name: data.business_name,
          vat_number: data.vat_number || null,
          verification_level: 0,
        },
        { onConflict: "seller_id" }
      )
    
    revalidateTag("profiles", "max")
    
    return { success: true }
  } catch (error) {
    console.error("upgradeToBusinessAccount error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// DOWNGRADE TO PERSONAL ACCOUNT
// =====================================================
export async function downgradeToPersonalAccount(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check for active business subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id, status, plan_type")
      .eq("seller_id", user.id)
      .eq("status", "active")
      .single()

    if (subscription && subscription.plan_type !== "free") {
      return { 
        success: false, 
        error: "Please cancel your business subscription first before downgrading" 
      }
    }
    
    // Update to personal account (reset business-related fields)
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        account_type: "personal",
        is_verified_business: false,
        tier: "free",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
    
    if (updateError) {
      console.error("downgradeToPersonalAccount error:", updateError)
      return { success: false, error: "Failed to downgrade account" }
    }
    
    revalidateTag("profiles", "max")
    
    return { success: true }
  } catch (error) {
    console.error("downgradeToPersonalAccount error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// GET PUBLIC PROFILE BY USERNAME
// =====================================================
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
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }
    
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
    
    // Hide business fields if personal account
    const socialLinksData = profile.social_links && typeof profile.social_links === 'object' && !Array.isArray(profile.social_links)
      ? profile.social_links as Record<string, string>
      : null
    
    const publicData = {
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
    }
    
    return { success: true, data: publicData }
  } catch (error) {
    console.error("getPublicProfile error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// GET CURRENT USER PROFILE (Full)
// =====================================================
export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient()
    if (!supabase) return null
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
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
          "vat_number",
        ].join(",")
      )
      .eq("id", user.id)
      .single()
    
    return profile
  } catch {
    return null
  }
}

// =====================================================
// CHECK IF USERNAME IS SET
// =====================================================
export async function hasUsername(): Promise<boolean> {
  try {
    const supabase = await createClient()
    if (!supabase) return false
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()
    
    return !!profile?.username
  } catch {
    return false
  }
}

// =====================================================
// GET USERNAME CHANGE COOLDOWN
// =====================================================
export async function getUsernameChangeCooldown(): Promise<{
  canChange: boolean
  daysRemaining?: number
}> {
  try {
    const supabase = await createClient()
    if (!supabase) return { canChange: false }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { canChange: false }
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("last_username_change")
      .eq("id", user.id)
      .single()
    
    if (!profile?.last_username_change) {
      return { canChange: true }
    }
    
    const lastChange = new Date(profile.last_username_change)
    const cooldownEnd = new Date(lastChange.getTime() + 14 * 24 * 60 * 60 * 1000)
    
    if (new Date() >= cooldownEnd) {
      return { canChange: true }
    }
    
    const daysRemaining = Math.ceil((cooldownEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    return { canChange: false, daysRemaining }
  } catch {
    return { canChange: false }
  }
}
