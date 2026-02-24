"use server"

import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import {
  RESERVED_USERNAMES,
  normalizeUsername,
  requireUsernameAuth,
  usernameSchema,
} from "./username-shared"

export type UsernameAvailabilityErrorCode =
  | "INVALID_USERNAME"
  | "USERNAME_RESERVED"
  | "USERNAME_TAKEN"
  | "CHECK_FAILED"

/**
 * Check whether a username can be used.
 */
export async function checkUsernameAvailability(username: string): Promise<{
  available: boolean
  errorCode?: UsernameAvailabilityErrorCode
}> {
  try {
    const normalizedUsername = normalizeUsername(username)

    const validation = usernameSchema.safeParse(normalizedUsername)
    if (!validation.success) {
      return { available: false, errorCode: "INVALID_USERNAME" }
    }

    if (RESERVED_USERNAMES.includes(normalizedUsername)) {
      return { available: false, errorCode: "USERNAME_RESERVED" }
    }

    const supabase = await createClient()

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", normalizedUsername)
      .maybeSingle()

    if (existing) {
      return { available: false, errorCode: "USERNAME_TAKEN" }
    }

    return { available: true }
  } catch (error) {
    logger.error("[username-availability] check_failed", error)
    return { available: false, errorCode: "CHECK_FAILED" }
  }
}

/**
 * Check if the current user has a username.
 */
export async function hasUsername(): Promise<boolean> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) return false
    const { userId, supabase } = auth

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single()

    return !!profile?.username
  } catch {
    return false
  }
}

/**
 * Return username change cooldown details for current user.
 */
export async function getUsernameChangeCooldown(): Promise<{
  canChange: boolean
  daysRemaining?: number
}> {
  try {
    const auth = await requireUsernameAuth()
    if ("error" in auth) return { canChange: false }
    const { userId, supabase } = auth

    const { data: profile } = await supabase
      .from("profiles")
      .select("last_username_change")
      .eq("id", userId)
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
