"use server"

import { createAdminClient } from "@/lib/supabase/server"
import {
  revalidatePublicProfileTagsByUsername,
  revalidatePublicProfileTagsForUser,
} from "@/lib/cache/revalidate-profile-tags"
import { revalidateTag } from "next/cache"
import {
  RESERVED_USERNAMES,
  businessUpgradeSchema,
  normalizeUsername,
  requireUsernameAuth,
  usernameSchema,
} from "./username-shared"
import type { z } from "zod"

/**
 * Set or change username.
 */
export async function setUsername(username: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { userId, supabase } = auth

    const normalizedUsername = normalizeUsername(username)
    const validation = usernameSchema.safeParse(normalizedUsername)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message ?? "Invalid username" }
    }

    if (RESERVED_USERNAMES.includes(normalizedUsername)) {
      return { success: false, error: "This username is reserved" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, last_username_change")
      .eq("id", userId)
      .single()

    const previousUsername = profile?.username ? normalizeUsername(profile.username) : null

    if (profile?.username) {
      if (profile.last_username_change) {
        const lastChange = new Date(profile.last_username_change)
        const cooldownEnd = new Date(lastChange.getTime() + 14 * 24 * 60 * 60 * 1000)

        if (new Date() < cooldownEnd) {
          const daysLeft = Math.ceil((cooldownEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
          return {
            success: false,
            error: `You can change your username in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`,
          }
        }
      }

      await supabase.from("username_history").insert({
        user_id: userId,
        old_username: profile.username,
        new_username: normalizedUsername,
      })
    }

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", normalizedUsername)
      .neq("id", userId)
      .maybeSingle()

    if (existing) {
      return { success: false, error: "This username is already taken" }
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: normalizedUsername,
        last_username_change: profile?.username ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("setUsername error:", updateError)
      return { success: false, error: "Failed to update username" }
    }

    revalidateTag(`seller-${userId}`, "max")
    revalidatePublicProfileTagsByUsername(normalizedUsername, "max")
    if (previousUsername) {
      revalidatePublicProfileTagsByUsername(previousUsername, "max")
    }

    return { success: true }
  } catch (error) {
    console.error("setUsername error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Upgrade personal account to business account.
 */
export async function upgradeToBusinessAccount(
  data: z.infer<typeof businessUpgradeSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { userId, supabase } = auth

    const validation = businessUpgradeSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message ?? "Invalid business data" }
    }

    if (data.change_username && data.new_username) {
      const usernameResult = await setUsername(data.new_username)
      if (!usernameResult.success) {
        return { success: false, error: `Username: ${usernameResult.error ?? "Failed to set username"}` }
      }
    }

    const updatedAt = new Date().toISOString()
    const adminSupabase = createAdminClient()

    const [{ error: updateError }, { error: privateError }] = await Promise.all([
      adminSupabase
        .from("profiles")
        .update({
          account_type: "business",
          business_name: data.business_name,
          website_url: data.website_url || null,
          updated_at: updatedAt,
        })
        .eq("id", userId),
      supabase
        .from("private_profiles")
        .upsert({ id: userId, vat_number: data.vat_number || null, updated_at: updatedAt }, { onConflict: "id" }),
    ])

    if (updateError || privateError) {
      console.error("upgradeToBusinessAccount error:", updateError || privateError)
      return { success: false, error: "Failed to upgrade account" }
    }

    await supabase.from("business_verification").upsert(
      {
        seller_id: userId,
        legal_name: data.business_name,
        vat_number: data.vat_number || null,
        verification_level: 0,
      },
      { onConflict: "seller_id" }
    )

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return { success: true }
  } catch (error) {
    console.error("upgradeToBusinessAccount error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Downgrade business account to personal account.
 */
export async function downgradeToPersonalAccount(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, error: auth.error }
    }
    const { userId, supabase } = auth

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id, status, plan_type")
      .eq("seller_id", userId)
      .eq("status", "active")
      .single()

    if (subscription && subscription.plan_type !== "free") {
      return {
        success: false,
        error: "Please cancel your business subscription first before downgrading",
      }
    }

    const adminSupabase = createAdminClient()
    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({
        account_type: "personal",
        is_verified_business: false,
        tier: "free",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("downgradeToPersonalAccount error:", updateError)
      return { success: false, error: "Failed to downgrade account" }
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return { success: true }
  } catch (error) {
    console.error("downgradeToPersonalAccount error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

