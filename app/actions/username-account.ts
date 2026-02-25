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

import { logger } from "@/lib/logger"
export type UsernameAccountErrorCode =
  | "NOT_AUTHENTICATED"
  | "INVALID_USERNAME"
  | "USERNAME_RESERVED"
  | "USERNAME_COOLDOWN_ACTIVE"
  | "USERNAME_TAKEN"
  | "USERNAME_UPDATE_FAILED"
  | "INVALID_BUSINESS_DATA"
  | "ACCOUNT_UPGRADE_FAILED"
  | "ACTIVE_BUSINESS_SUBSCRIPTION"
  | "ACCOUNT_DOWNGRADE_FAILED"
  | "UNKNOWN_ERROR"

/**
 * Set or change username.
 */
export async function setUsername(username: string): Promise<{
  success: boolean
  errorCode?: UsernameAccountErrorCode
  daysRemaining?: number
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, errorCode: "NOT_AUTHENTICATED" }
    }
    const { userId, supabase } = auth

    const normalizedUsername = normalizeUsername(username)
    const validation = usernameSchema.safeParse(normalizedUsername)
    if (!validation.success) {
      return { success: false, errorCode: "INVALID_USERNAME" }
    }

    if (RESERVED_USERNAMES.includes(normalizedUsername)) {
      return { success: false, errorCode: "USERNAME_RESERVED" }
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
            errorCode: "USERNAME_COOLDOWN_ACTIVE",
            daysRemaining: daysLeft,
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
      return { success: false, errorCode: "USERNAME_TAKEN" }
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
      logger.error("[username-account] set_username_update_failed", updateError, { userId })
      return { success: false, errorCode: "USERNAME_UPDATE_FAILED" }
    }

    revalidateTag(`seller-${userId}`, "max")
    revalidatePublicProfileTagsByUsername(normalizedUsername, "max")
    if (previousUsername) {
      revalidatePublicProfileTagsByUsername(previousUsername, "max")
    }

    return { success: true }
  } catch (error) {
    logger.error("[username-account] set_username_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

/**
 * Upgrade personal account to business account.
 */
export async function upgradeToBusinessAccount(
  data: z.infer<typeof businessUpgradeSchema>
): Promise<{ success: boolean; errorCode?: UsernameAccountErrorCode; daysRemaining?: number }> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, errorCode: "NOT_AUTHENTICATED" }
    }
    const { userId, supabase } = auth

    const validation = businessUpgradeSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, errorCode: "INVALID_BUSINESS_DATA" }
    }

    if (data.change_username && data.new_username) {
      const usernameResult = await setUsername(data.new_username)
      if (!usernameResult.success) {
        return {
          success: false,
          errorCode: usernameResult.errorCode ?? "USERNAME_UPDATE_FAILED",
          ...(usernameResult.daysRemaining !== undefined
            ? { daysRemaining: usernameResult.daysRemaining }
            : {}),
        }
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
      logger.error("[username-account] upgrade_business_failed", updateError ?? privateError, { userId })
      return { success: false, errorCode: "ACCOUNT_UPGRADE_FAILED" }
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
    logger.error("[username-account] upgrade_business_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}

/**
 * Downgrade business account to personal account.
 */
export async function downgradeToPersonalAccount(): Promise<{
  success: boolean
  errorCode?: UsernameAccountErrorCode
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return { success: false, errorCode: "NOT_AUTHENTICATED" }
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
        errorCode: "ACTIVE_BUSINESS_SUBSCRIPTION",
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
      logger.error("[username-account] downgrade_personal_failed", updateError, { userId })
      return { success: false, errorCode: "ACCOUNT_DOWNGRADE_FAILED" }
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return { success: true }
  } catch (error) {
    logger.error("[username-account] downgrade_personal_unexpected", error)
    return { success: false, errorCode: "UNKNOWN_ERROR" }
  }
}
