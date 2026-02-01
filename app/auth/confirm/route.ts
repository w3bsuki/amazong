import { createRouteHandlerClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

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
  
  // Handle the redirect URL for production vs development
  const forwardedHost = request.headers.get("x-forwarded-host")
  const isLocalEnv = process.env.NODE_ENV === "development"
  
  let redirectTo: string
  if (isLocalEnv) {
    redirectTo = origin
  } else if (forwardedHost) {
    redirectTo = `https://${forwardedHost}`
  } else {
    // Fallback to NEXT_PUBLIC_SITE_URL or origin
    redirectTo = process.env.NEXT_PUBLIC_SITE_URL || origin
  }
  
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const redirectWithCookies = (url: string) => applyCookies(NextResponse.redirect(url))
  
  // Handle PKCE flow (code parameter) - this is what Supabase sends for email confirmation
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if this is a new user (first time confirming email)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single()
        
        // Cast to expected shape (column may not be in generated types yet)
        const profileData = profile as { onboarding_completed?: boolean | null } | null
        
        // If onboarding not completed, redirect to home with onboarding modal trigger
        if (!profileData?.onboarding_completed) {
          return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, "/")}/?onboarding=true`)
        }
      }
      
      // Otherwise redirect to intended destination
      return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, next)}`)
    }
    
    console.error("Code exchange error:", error.message)
    return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, "/auth/error")}?error=invalid_code`)
  }
  
  // Handle token_hash flow (older method)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      // Email verified successfully
      if (type === "signup" || type === "email") {
        // Check if user needs onboarding
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", user.id)
            .single()
          
          // Cast to expected shape
          const profileData = profile as { onboarding_completed?: boolean | null } | null
          
          if (!profileData?.onboarding_completed) {
            return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, "/")}/?onboarding=true`)
          }
        }
        return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, next)}`)
      } else if (type === "recovery") {
        return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, "/auth/reset-password")}`)
      } else if (type === "email_change") {
        return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, "/account/settings")}?email_changed=true`)
      }
      
      return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, next)}`)
    }
    
    console.error("Email verification error:", error.message)
  }
  
  // If verification fails, redirect to an error page
  return redirectWithCookies(`${redirectTo}${withLocalePrefix(locale, "/auth/error")}?error=verification_failed`)
}
