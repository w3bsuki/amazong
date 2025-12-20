"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// =====================================================
// ACCOUNT UPGRADE SERVER ACTIONS
// For upgrading personal accounts to business accounts
// =====================================================

// Validation schema for business account upgrade
const businessUpgradeSchema = z.object({
  business_name: z.string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be less than 100 characters"),
  vat_number: z.string()
    .max(20, "VAT number must be less than 20 characters")
    .optional()
    .nullable(),
  website_url: z.string()
    .url("Invalid website URL")
    .max(200, "Website URL must be less than 200 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
})

export type BusinessUpgradeInput = z.infer<typeof businessUpgradeSchema>

// =====================================================
// UPGRADE TO BUSINESS ACCOUNT
// =====================================================
export async function upgradeToBusinessAccount(input: BusinessUpgradeInput): Promise<{
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

    // Validate input
    const validation = businessUpgradeSchema.safeParse(input)
    if (!validation.success) {
      return { 
        success: false, 
        error: validation.error.errors[0]?.message || "Invalid input" 
      }
    }

    const { business_name, vat_number, website_url } = validation.data

    // Check current account type
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "Profile not found" }
    }

    if (profile.account_type === "business") {
      return { success: false, error: "Account is already a business account" }
    }

    // Update profile to business account
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        account_type: "business",
        business_name,
        vat_number: vat_number || null,
        website_url: website_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("upgradeToBusinessAccount error:", updateError)
      return { success: false, error: "Failed to upgrade account" }
    }

    // Create business_verification record for future verification
    const adminClient = createAdminClient()
    await adminClient
      .from("business_verification")
      .upsert({
        seller_id: user.id,
        legal_name: business_name,
        vat_number: vat_number || null,
        verification_level: 0,
      }, { onConflict: "seller_id" })

    revalidatePath("/account")
    revalidatePath("/account/profile")
    revalidatePath("/dashboard")
    
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
      return { success: false, error: "Failed to connect to database" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check for active business subscription
    const adminClient = createAdminClient()
    const { data: subscription } = await adminClient
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

    // Update profile to personal account
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

    revalidatePath("/account")
    revalidatePath("/account/profile")
    
    return { success: true }
  } catch (error) {
    console.error("downgradeToPersonalAccount error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// =====================================================
// GET ACCOUNT TYPE STATUS
// =====================================================
export async function getAccountTypeStatus(): Promise<{
  success: boolean
  data?: {
    account_type: "personal" | "business"
    business_name: string | null
    vat_number: string | null
    is_verified_business: boolean
    tier: string
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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("account_type, business_name, vat_number, is_verified_business, tier")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "Profile not found" }
    }

    return {
      success: true,
      data: {
        account_type: (profile.account_type || "personal") as "personal" | "business",
        business_name: profile.business_name,
        vat_number: profile.vat_number,
        is_verified_business: profile.is_verified_business ?? false,
        tier: profile.tier || "free",
      },
    }
  } catch (error) {
    console.error("getAccountTypeStatus error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
