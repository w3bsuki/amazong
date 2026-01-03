"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createClient, createStaticClient } from "@/lib/supabase/server"
import { loginSchema, signUpSchema } from "@/lib/validations/auth"
import { logger } from "@/lib/logger"
import { z } from "zod"

export type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

/**
 * Sanitize Supabase auth errors to prevent information leakage.
 * Maps internal error messages to generic user-friendly messages.
 */
function sanitizeAuthError(error: Error | { message: string }): string {
  const msg = error.message.toLowerCase()

  if (msg.includes("invalid login credentials")) {
    return "Invalid email or password"
  }
  if (msg.includes("email not confirmed")) {
    return "Please verify your email before signing in"
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts. Please try again later."
  }
  if (msg.includes("user already registered") || msg.includes("already been registered")) {
    return "An account with this email may already exist. Try signing in or resetting your password."
  }
  if (msg.includes("password")) {
    return error.message // Password-specific errors are safe to show
  }
  if (msg.includes("network") || msg.includes("timeout") || msg.includes("fetch")) {
    return "Connection error. Please check your internet and try again."
  }

  // Log unexpected errors for debugging but return generic message
  logger.error("[Auth] Unexpected error", error, { originalMessage: error.message })
  return "An error occurred. Please try again."
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

function withLocalePrefix(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/") return `/${locale}`
  if (normalized.startsWith(`/${locale}/`) || normalized === `/${locale}`) return normalized
  return `/${locale}${normalized}`
}

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }>
{
  if (process.env.NEXT_PUBLIC_E2E === "true") {
    // E2E should not depend on external Supabase availability.
    return { available: true }
  }

  const cleaned = username.trim().toLowerCase()
  if (!cleaned || cleaned.length < 3) return { available: false }

  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", cleaned)
    .maybeSingle()

  if (error) return { available: false }
  return { available: !data }
}

export async function login(
  locale: string,
  redirectPath: string | null | undefined,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string") fieldErrors[key] = issue.message
    }
    return { fieldErrors, success: false }
  }

  const isE2E = process.env.NEXT_PUBLIC_E2E === "true"
  const allowRealAuthInE2E =
    process.env.E2E_REAL_AUTH === "true" || process.env.NEXT_PUBLIC_E2E_REAL_AUTH === "true"
  if (isE2E && !allowRealAuthInE2E) {
    // Keep E2E runs stable and independent from external Supabase availability.
    // Opt into real auth explicitly via E2E_REAL_AUTH=true.
    return { ...prevState, error: "Invalid login credentials", success: false }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { ...prevState, error: sanitizeAuthError(error), success: false }
  }

  const safe = safeRedirectPath(redirectPath) || "/"
  redirect(withLocalePrefix(locale, safe))
}

export async function signUp(
  locale: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    accountType: formData.get("accountType"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string") fieldErrors[key] = issue.message
    }
    return { fieldErrors, success: false }
  }

  const usernameLower = parsed.data.username.toLowerCase()
  const availability = await checkUsernameAvailability(usernameLower)
  if (!availability.available) {
    return { ...prevState, error: "This username is already taken", success: false }
  }

  const supabase = await createClient()
  const siteUrl = await getSiteUrl()

  const { error, data: authData } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // Include locale/next as query params so the non-locale /auth/confirm route
      // can redirect users back into the correct locale after verification.
      emailRedirectTo: `${siteUrl}/auth/confirm?locale=${encodeURIComponent(locale)}&next=${encodeURIComponent("/")}`,
      data: {
        full_name: parsed.data.name,
        username: usernameLower,
        account_type_intent: parsed.data.accountType,
      },
    },
  })

  // Handle Supabase edge cases for existing users
  if (error) {
    return { ...prevState, error: sanitizeAuthError(error), success: false }
  }

  // IMPORTANT: Supabase intentionally avoids revealing whether an email is registered.
  // For existing emails, signUp may succeed but return null user/session and send no email.
  // We always redirect to a neutral success page that instructs users to check email or sign in.
  void authData

  // NOTE: Do not use a service-role client here.
  // The profile trigger should hydrate initial profile fields from auth metadata.

  redirect(withLocalePrefix(locale, "/auth/sign-up-success"))
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
    return { ...prevState, fieldErrors: { email: parsed.error.issues[0]?.message ?? "Invalid email" }, success: false }
  }

  const supabase = await createClient()
  const siteUrl = await getSiteUrl()

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/${locale}/auth/reset-password`,
  })

  if (error) {
    return { ...prevState, error: sanitizeAuthError(error), success: false }
  }

  return { success: true }
}
