"use server"

import { redirect } from "@/i18n/routing"
import { headers } from "next/headers"
import { createClient, createStaticClient } from "@/lib/supabase/server"
import { loginSchema, signUpSchema } from "@/lib/validation/auth"
import { logger } from "@/lib/logger"
import { z } from "zod"

export type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

type SafeLocale = "en" | "bg"

function toSafeLocale(locale: string): SafeLocale {
  return locale === "bg" ? "bg" : "en"
}

/**
 * Sanitize Supabase auth errors to prevent information leakage.
 * Maps internal error messages to generic user-friendly messages.
 */
function sanitizeAuthError(error: Error | { message: string }): string {
  const msg = error.message.toLowerCase()

  if (msg.includes("invalid login credentials")) {
    return "invalidCredentials"
  }
  if (msg.includes("email not confirmed")) {
    return "emailNotConfirmed"
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "rateLimitError"
  }
  if (msg.includes("user already registered") || msg.includes("already been registered")) {
    return "emailAlreadyRegistered"
  }
  if (msg.includes("password")) return "error"
  if (msg.includes("network") || msg.includes("timeout") || msg.includes("fetch")) return "error"

  // Log unexpected errors for debugging but return generic message
  logger.error("[Auth] Unexpected error", error, { originalMessage: error.message })
  return "error"
}

function toAuthError(error: unknown): Error | { message: string } {
  if (error instanceof Error) return error
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return { message: (error as { message: string }).message }
  }
  return { message: "Unexpected auth error" }
}

async function getSiteUrlFromHeaders(): Promise<string | null> {
  const hdrs = await headers()
  const forwardedHost = hdrs.get("x-forwarded-host")
  const forwardedProto = hdrs.get("x-forwarded-proto")

  if (forwardedHost) {
    const proto = forwardedProto ?? "https"
    return `${proto}://${forwardedHost}`
  }

  const host = hdrs.get("host")
  if (!host) return null

  // In dev, host usually includes port (e.g. localhost:3000)
  const proto = process.env.NODE_ENV === "development" ? "http" : "https"
  return `${proto}://${host}`
}

async function getSiteUrl(): Promise<string> {
  return process.env.NEXT_PUBLIC_SITE_URL || (await getSiteUrlFromHeaders()) || "http://localhost:3000"
}

function safeRedirectPath(input: string | null | undefined): string | null {
  if (!input) return null
  if (!input.startsWith("/")) return null
  if (input.startsWith("//")) return null
  return input
}

function stripLocalePrefixFromPath(path: string, locale: SafeLocale): string {
  const prefix = `/${locale}`
  let result = path

  // Some callers may accidentally pass `next` values that already include the locale prefix
  // (or even include it twice). Since `redirect({ locale })` will add it back, strip any
  // repeated prefix here to prevent `/<locale>/<locale>/...` redirects.
  while (true) {
    if (result === prefix) {
      result = "/"
      break
    }

    if (result.startsWith(`${prefix}/`)) {
      const rest = result.slice(prefix.length)
      result = rest.length > 0 ? rest : "/"
      continue
    }

    break
  }

  return result
}

const forgotPasswordSchema = z.object({
  email: z.string().email("invalidEmail"),
})

function parseFieldErrors(parsed: { success: false; error: z.ZodError }): AuthActionState {
  const fieldErrors: Record<string, string> = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0]
    if (typeof key === "string") fieldErrors[key] = issue.message
  }
  return { fieldErrors, success: false }
}

async function signInWithPassword(formData: FormData, prevState: AuthActionState): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return parseFieldErrors(parsed)
  }

  const isE2E = process.env.NEXT_PUBLIC_E2E === "true"
  const allowRealAuthInE2E =
    process.env.E2E_REAL_AUTH === "true" || process.env.NEXT_PUBLIC_E2E_REAL_AUTH === "true"
  if (isE2E && !allowRealAuthInE2E) {
    // Keep E2E runs stable and independent from external Supabase availability.
    // Opt into real auth explicitly via E2E_REAL_AUTH=true.
    return { ...prevState, error: "invalidCredentials", success: false }
  }

  let supabase
  try {
    supabase = await createClient()
  } catch (error) {
    return { ...prevState, error: sanitizeAuthError(toAuthError(error)), success: false }
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      return { ...prevState, error: sanitizeAuthError(error), success: false }
    }
  } catch (error) {
    return { ...prevState, error: sanitizeAuthError(toAuthError(error)), success: false }
  }

  return { success: true }
}

async function signUpWithEmail(
  locale: string,
  formData: FormData,
  prevState: AuthActionState
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return parseFieldErrors(parsed)
  }

  const usernameLower = parsed.data.username.toLowerCase()
  const availability = await checkUsernameAvailability(usernameLower)
  if (!availability.available) {
    return { ...prevState, error: "usernameAlreadyTaken", success: false }
  }

  let supabase
  try {
    supabase = await createClient()
  } catch (error) {
    return { ...prevState, error: sanitizeAuthError(toAuthError(error)), success: false }
  }

  const siteUrl = await getSiteUrl()
  const safeLocale = toSafeLocale(locale)
  let error: { message: string } | null = null
  let authData: unknown = null
  try {
    const signUpResult = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        // Include locale/next as query params so the non-locale /auth/confirm route
        // can redirect users back into the correct locale after verification.
        // After signup, redirect to onboarding flow to select account type
        emailRedirectTo: `${siteUrl}/auth/confirm?locale=${encodeURIComponent(safeLocale)}&next=${encodeURIComponent("/onboarding")}`,
        data: {
          full_name: parsed.data.name,
          username: usernameLower,
          // Account type is now selected during onboarding, defaulting to personal
          account_type_intent: "personal",
        },
      },
    })
    error = signUpResult.error
    authData = signUpResult.data
  } catch (caughtError) {
    return { ...prevState, error: sanitizeAuthError(toAuthError(caughtError)), success: false }
  }

  if (error) {
    return { ...prevState, error: sanitizeAuthError(error), success: false }
  }

  // IMPORTANT: Supabase intentionally avoids revealing whether an email is registered.
  // For existing emails, signUp may succeed but return null user/session and send no email.
  // We intentionally treat this as success in both page and drawer flows.
  void authData

  return { success: true }
}

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
  if (process.env.NEXT_PUBLIC_E2E === "true") {
    // E2E should not depend on external Supabase availability.
    return { available: true }
  }

  const cleaned = username.trim().toLowerCase()
  if (!cleaned || cleaned.length < 3) return { available: false }
  if (!/^[a-z0-9_]+$/.test(cleaned)) return { available: false }

  let supabase
  try {
    supabase = createStaticClient()
  } catch {
    return { available: false }
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", cleaned)
      .maybeSingle()

    if (error) return { available: false }
    return { available: !data }
  } catch {
    return { available: false }
  }
}

/**
 * Login action for full-page auth route flow.
 * Keeps redirect behavior after successful sign in.
 */
export async function login(
  locale: string,
  redirectPath: string | null | undefined,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const result = await signInWithPassword(formData, prevState)
  if (!result.success) return result

  const safe = safeRedirectPath(redirectPath) || "/"
  const safeLocale = toSafeLocale(locale)
  const normalized = stripLocalePrefixFromPath(safe, safeLocale)
  return redirect({ href: normalized, locale: safeLocale })
}

/**
 * Login action for in-drawer auth flow.
 * Returns success state without forcing navigation.
 */
export async function loginInPlace(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  void locale
  return signInWithPassword(formData, prevState)
}

/**
 * Sign-up action for full-page auth route flow.
 * Keeps redirect behavior to the sign-up success page.
 */
export async function signUp(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const result = await signUpWithEmail(locale, formData, prevState)
  if (!result.success) return result

  const safeLocale = toSafeLocale(locale)
  return redirect({ href: "/auth/sign-up-success", locale: safeLocale })
}

/**
 * Sign-up action for in-drawer auth flow.
 * Returns success state without forcing navigation.
 */
export async function signUpInPlace(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  return signUpWithEmail(locale, formData, prevState)
}

export async function requestPasswordReset(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return {
      ...prevState,
      fieldErrors: { email: parsed.error.issues[0]?.message ?? "invalidEmail" },
      success: false,
    }
  }

  let supabase
  try {
    supabase = await createClient()
  } catch (error) {
    return { ...prevState, error: sanitizeAuthError(toAuthError(error)), success: false }
  }
  let siteUrl: string
  try {
    siteUrl = await getSiteUrl()
  } catch (error) {
    return { ...prevState, error: sanitizeAuthError(toAuthError(error)), success: false }
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${siteUrl}/${toSafeLocale(locale)}/auth/reset-password`,
    })

    if (error) {
      return { ...prevState, error: sanitizeAuthError(error), success: false }
    }
  } catch (error) {
    return { ...prevState, error: sanitizeAuthError(toAuthError(error)), success: false }
  }

  return { success: true }
}
