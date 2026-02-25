import { createRouteHandlerClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

import { logger } from "@/lib/logger"
type AuthConfirmSupabaseClient = ReturnType<typeof createRouteHandlerClient>["supabase"]

function safeNextPath(input: string | null | undefined): string {
  if (!input) return "/"
  if (!input.startsWith("/")) return "/"
  if (input.startsWith("//")) return "/"
  return input
}

function withLocalePrefix(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/") return `/${locale}`
  if (normalized.startsWith(`/${locale}/`) || normalized === `/${locale}`) return normalized
  return `/${locale}${normalized}`
}

function resolveLocaleFromRequest(searchParams: URLSearchParams, nextPath: string): string {
  const qpLocale = searchParams.get("locale")
  if (qpLocale && /^[a-z]{2}(-[A-Z]{2})?$/.test(qpLocale)) return qpLocale

  // If next already contains a locale prefix (/en/..., /bg/...), respect it.
  const m = nextPath.match(/^\/([a-z]{2})(?:\/|$)/)
  if (m?.[1]) return m[1]

  return "en"
}

function resolveRedirectBaseUrl(request: NextRequest, origin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host")
  const isLocalEnv = process.env.NODE_ENV === "development"

  if (isLocalEnv) return origin
  if (forwardedHost) return `https://${forwardedHost}`
  return process.env.NEXT_PUBLIC_SITE_URL || origin
}

function onboardingRedirectUrl(redirectTo: string, locale: string): string {
  return `${redirectTo}${withLocalePrefix(locale, "/")}/?onboarding=true`
}

async function needsOnboarding(supabase: AuthConfirmSupabaseClient): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single()

  const profileData = profile as { onboarding_completed?: boolean | null } | null
  return !profileData?.onboarding_completed
}

async function resolveCodeFlowRedirect(params: {
  supabase: AuthConfirmSupabaseClient
  code: string
  redirectTo: string
  locale: string
  next: string
}): Promise<string> {
  const { supabase, code, redirectTo, locale, next } = params
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    logger.error("Code exchange error:", error.message)
    return `${redirectTo}${withLocalePrefix(locale, "/auth/error")}?error=invalid_code`
  }

  if (await needsOnboarding(supabase)) {
    return onboardingRedirectUrl(redirectTo, locale)
  }

  return `${redirectTo}${withLocalePrefix(locale, next)}`
}

async function resolveTokenHashFlowRedirect(params: {
  supabase: AuthConfirmSupabaseClient
  token_hash: string
  type: EmailOtpType
  redirectTo: string
  locale: string
  next: string
}): Promise<string | null> {
  const { supabase, token_hash, type, redirectTo, locale, next } = params
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    logger.error("Email verification error:", error.message)
    return null
  }

  if (type === "signup" || type === "email") {
    if (await needsOnboarding(supabase)) {
      return onboardingRedirectUrl(redirectTo, locale)
    }
    return `${redirectTo}${withLocalePrefix(locale, next)}`
  }
  if (type === "recovery") {
    return `${redirectTo}${withLocalePrefix(locale, "/auth/reset-password")}`
  }
  if (type === "email_change") {
    return `${redirectTo}${withLocalePrefix(locale, "/account/settings")}?email_changed=true`
  }
  return `${redirectTo}${withLocalePrefix(locale, next)}`
}

/**
 * Handles email confirmation links from Supabase Auth.
 * 
 * Supabase can send links in two formats:
 * 1. PKCE flow: /auth/confirm?code=xxx (default for email confirmations)
 * 2. Token hash flow: /auth/confirm?token_hash=xxx&type=email
 * 
 * This route handles both and exchanges them for a session.
 * 
 * Post-confirmation behavior:
 * - New users (onboarding_completed=false): Redirect to home with ?onboarding=true
 * - Existing users: Redirect to intended destination
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  
  // Get parameters - Supabase uses either code (PKCE) or token_hash
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = safeNextPath(searchParams.get("next"))
  const locale = resolveLocaleFromRequest(searchParams, next)
  const redirectTo = resolveRedirectBaseUrl(request, origin)
  
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const redirectWithCookies = (url: string) => applyCookies(NextResponse.redirect(url))
  
  // Handle PKCE flow (code parameter) - this is what Supabase sends for email confirmation
  if (code) {
    const target = await resolveCodeFlowRedirect({
      supabase,
      code,
      redirectTo,
      locale,
      next,
    })
    return redirectWithCookies(target)
  }
  
  // Handle token_hash flow (older method)
  if (token_hash && type) {
    const target = await resolveTokenHashFlowRedirect({
      supabase,
      token_hash,
      type,
      redirectTo,
      locale,
      next,
    })

    if (target) {
      return redirectWithCookies(target)
    }
  }
  
  // If verification fails, redirect to an error page
  return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, "/auth/error")}?error=verification_failed`)
}
