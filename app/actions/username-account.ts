"use server"

import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { createAdminClient } from "@/lib/supabase/server"
import {
  revalidatePublicProfileTagsByUsername,
  revalidatePublicProfileTagsForUser,
} from "@/lib/cache/revalidate-profile-tags"
import { revalidateTag } from "next/cache"
import {
  downgradeUserToPersonalAccount,
  setUsernameForUser,
  upgradeUserToBusinessAccount,
} from "@/lib/data/username"
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

export type UsernameAccountResult = Envelope<
  Record<string, never>,
  { errorCode: UsernameAccountErrorCode; daysRemaining?: number }
>

function ok(): UsernameAccountResult {
  return successEnvelope<Record<string, never>>()
}

function fail(
  errorCode: UsernameAccountErrorCode,
  opts?: { daysRemaining?: number }
): UsernameAccountResult {
  return errorEnvelope({
    errorCode,
    ...(opts?.daysRemaining === undefined ? {} : { daysRemaining: opts.daysRemaining }),
  })
}

/**
 * Set or change username.
 */
export async function setUsername(username: string): Promise<UsernameAccountResult> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return fail("NOT_AUTHENTICATED")
    }
    const { userId, supabase } = auth

    const normalizedUsername = normalizeUsername(username)
    const validation = usernameSchema.safeParse(normalizedUsername)
    if (!validation.success) {
      return fail("INVALID_USERNAME")
    }

    if (RESERVED_USERNAMES.includes(normalizedUsername)) {
      return fail("USERNAME_RESERVED")
    }

    const result = await setUsernameForUser({ supabase, userId, username: normalizedUsername })

    if (!result.ok) {
      if (result.reason === "USERNAME_COOLDOWN_ACTIVE") {
        return fail("USERNAME_COOLDOWN_ACTIVE", { daysRemaining: result.daysRemaining })
      }

      if (result.reason === "USERNAME_TAKEN") {
        return fail("USERNAME_TAKEN")
      }

      logger.error("[username-account] set_username_update_failed", result.error, { userId })
      return fail("USERNAME_UPDATE_FAILED")
    }

    revalidateTag(`seller-${userId}`, "max")
    revalidatePublicProfileTagsByUsername(normalizedUsername, "max")

    const previousUsername = result.previousUsername ? normalizeUsername(result.previousUsername) : null
    if (previousUsername) {
      revalidatePublicProfileTagsByUsername(previousUsername, "max")
    }

    return ok()
  } catch (error) {
    logger.error("[username-account] set_username_unexpected", error)
    return fail("UNKNOWN_ERROR")
  }
}

/**
 * Upgrade personal account to business account.
 */
export async function upgradeToBusinessAccount(
  data: z.infer<typeof businessUpgradeSchema>
): Promise<UsernameAccountResult> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return fail("NOT_AUTHENTICATED")
    }
    const { userId, supabase } = auth

    const validation = businessUpgradeSchema.safeParse(data)
    if (!validation.success) {
      return fail("INVALID_BUSINESS_DATA")
    }

    if (data.change_username && data.new_username) {
      const usernameResult = await setUsername(data.new_username)
      if (!usernameResult.success) {
        return usernameResult
      }
    }

    const updatedAt = new Date().toISOString()
    const adminSupabase = createAdminClient()

    const result = await upgradeUserToBusinessAccount({
      userId,
      businessName: data.business_name,
      websiteUrl: data.website_url || null,
      vatNumber: data.vat_number || null,
      updatedAt,
      supabase,
      adminSupabase,
    })

    if (!result.ok) {
      logger.error("[username-account] upgrade_business_failed", result.error, { userId })
      return fail("ACCOUNT_UPGRADE_FAILED")
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return ok()
  } catch (error) {
    logger.error("[username-account] upgrade_business_unexpected", error)
    return fail("UNKNOWN_ERROR")
  }
}

/**
 * Downgrade business account to personal account.
 */
export async function downgradeToPersonalAccount(): Promise<UsernameAccountResult> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return fail("NOT_AUTHENTICATED")
    }
    const { userId, supabase } = auth

    const adminSupabase = createAdminClient()
    const updatedAt = new Date().toISOString()

    const result = await downgradeUserToPersonalAccount({
      userId,
      updatedAt,
      supabase,
      adminSupabase,
    })

    if (!result.ok) {
      if (result.reason === "ACTIVE_BUSINESS_SUBSCRIPTION") {
        return fail("ACTIVE_BUSINESS_SUBSCRIPTION")
      }

      logger.error("[username-account] downgrade_personal_failed", result.error, { userId })
      return fail("ACCOUNT_DOWNGRADE_FAILED")
    }

    await revalidatePublicProfileTagsForUser(supabase, userId, "max")
    return ok()
  } catch (error) {
    logger.error("[username-account] downgrade_personal_unexpected", error)
    return fail("UNKNOWN_ERROR")
  }
}
