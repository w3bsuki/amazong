"use server"

import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { getUserUsernameAndLastChange, isUsernameTaken } from "@/lib/data/username"
import {
  RESERVED_USERNAMES,
  normalizeUsername,
  requireUsernameAuth,
  usernameSchema,
} from "./username-shared"

import { logger } from "@/lib/logger"
export type UsernameAvailabilityErrorCode =
  | "INVALID_USERNAME"
  | "USERNAME_RESERVED"
  | "USERNAME_TAKEN"
  | "CHECK_FAILED"

export type CheckUsernameAvailabilityResult = Envelope<
  { available: boolean },
  { available: boolean; errorCode: UsernameAvailabilityErrorCode }
>

function availableOk(): CheckUsernameAvailabilityResult {
  return successEnvelope({ available: true })
}

function availableFail(errorCode: UsernameAvailabilityErrorCode): CheckUsernameAvailabilityResult {
  return errorEnvelope({ available: false, errorCode })
}

/**
 * Check whether a username can be used.
 */
export async function checkUsernameAvailability(
  username: string
): Promise<CheckUsernameAvailabilityResult> {
  try {
    const normalizedUsername = normalizeUsername(username)

    const validation = usernameSchema.safeParse(normalizedUsername)
    if (!validation.success) {
      return availableFail("INVALID_USERNAME")
    }

    if (RESERVED_USERNAMES.includes(normalizedUsername)) {
      return availableFail("USERNAME_RESERVED")
    }

    if (await isUsernameTaken(normalizedUsername)) {
      return availableFail("USERNAME_TAKEN")
    }

    return availableOk()
  } catch (error) {
    logger.error("[username-availability] check_failed", error)
    return availableFail("CHECK_FAILED")
  }
}

export type HasUsernameResult = Envelope<
  { hasUsername: boolean },
  { hasUsername: boolean; error: string }
>

/**
 * Check if the current user has a username.
 */
export async function hasUsername(): Promise<HasUsernameResult> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return errorEnvelope({ hasUsername: false, error: auth.error })
    }
    const { userId, supabase } = auth

    const profile = await getUserUsernameAndLastChange({ supabase, userId })

    return successEnvelope({ hasUsername: Boolean(profile?.username ?? null) })
  } catch {
    return errorEnvelope({ hasUsername: false, error: "Failed to check username" })
  }
}

export type UsernameChangeCooldownResult = Envelope<
  { canChange: boolean; daysRemaining?: number },
  { canChange: boolean; error: string }
>

/**
 * Return username change cooldown details for current user.
 */
export async function getUsernameChangeCooldown(): Promise<UsernameChangeCooldownResult> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) {
      return errorEnvelope({ canChange: false, error: auth.error })
    }
    const { userId, supabase } = auth

    const profile = await getUserUsernameAndLastChange({ supabase, userId })

    if (!profile?.lastUsernameChange) {
      return successEnvelope({ canChange: true })
    }

    const lastChange = new Date(profile.lastUsernameChange)
    const cooldownEnd = new Date(lastChange.getTime() + 14 * 24 * 60 * 60 * 1000)

    if (new Date() >= cooldownEnd) {
      return successEnvelope({ canChange: true })
    }

    const daysRemaining = Math.ceil((cooldownEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    return successEnvelope({ canChange: false, daysRemaining })
  } catch {
    return errorEnvelope({ canChange: false, error: "Failed to compute cooldown" })
  }
}
