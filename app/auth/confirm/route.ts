import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

/**
 * Handles email confirmation links from Supabase Auth.
 * 
 * Supabase can send links in two formats:
 * 1. PKCE flow: /auth/confirm?code=xxx (default for email confirmations)
 * 2. Token hash flow: /auth/confirm?token_hash=xxx&type=email
 * 
 * This route handles both and exchanges them for a session.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  
  // Get parameters - Supabase uses either code (PKCE) or token_hash
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/"
  
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
  
  const supabase = await createClient()
  
  if (!supabase) {
    return NextResponse.redirect(`${redirectTo}/auth/error?error=server_error`)
  }
  
  // Handle PKCE flow (code parameter) - this is what Supabase sends for email confirmation
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if this is a new user (first time confirming email)
      // Redirect to welcome page for onboarding
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has completed onboarding
        // Note: onboarding_completed column may be added to database later
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single()
        
        // If onboarding not completed, redirect to welcome page
        const profileData = profile as { onboarding_completed?: boolean } | null
        if (!profileData?.onboarding_completed) {
          return NextResponse.redirect(`${redirectTo}/en/auth/welcome`)
        }
      }
      
      // Otherwise redirect to intended destination
      return NextResponse.redirect(`${redirectTo}/en${next}`)
    }
    
    console.error("Code exchange error:", error.message)
    return NextResponse.redirect(`${redirectTo}/en/auth/error?error=invalid_code`)
  }
  
  // Handle token_hash flow (older method)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      // Email verified successfully (use /en/ locale as default)
      if (type === "signup" || type === "email") {
        // Check if user needs onboarding
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .single()
          
          const profileData = profile as { onboarding_completed?: boolean } | null
          if (!profileData?.onboarding_completed) {
            return NextResponse.redirect(`${redirectTo}/en/auth/welcome`)
          }
        }
        return NextResponse.redirect(`${redirectTo}/en${next}`)
      } else if (type === "recovery") {
        return NextResponse.redirect(`${redirectTo}/en/auth/reset-password`)
      } else if (type === "email_change") {
        return NextResponse.redirect(`${redirectTo}/en/account/settings?email_changed=true`)
      }
      
      return NextResponse.redirect(`${redirectTo}/en${next}`)
    }
    
    console.error("Email verification error:", error.message)
  }
  
  // If verification fails, redirect to an error page
  return NextResponse.redirect(`${redirectTo}/en/auth/error?error=verification_failed`)
}
