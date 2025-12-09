import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

/**
 * Handles email confirmation links from Supabase Auth.
 * 
 * Supabase sends email verification links in this format:
 * /auth/confirm?token_hash=xxx&type=email (or type=signup, recovery, etc.)
 * 
 * This route exchanges the token for a session and redirects the user.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  
  // Get the token hash and type from the URL
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
  
  if (token_hash && type) {
    const supabase = await createClient()
    
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      
      if (!error) {
        // Email verified successfully
        // Redirect to welcome page or the intended destination
        if (type === "signup" || type === "email") {
          return NextResponse.redirect(`${redirectTo}${next}?welcome=true`)
        } else if (type === "recovery") {
          // Redirect to password reset page
          return NextResponse.redirect(`${redirectTo}/auth/reset-password`)
        } else if (type === "email_change") {
          // Email change confirmation
          return NextResponse.redirect(`${redirectTo}/account/settings?email_changed=true`)
        }
        
        // Default redirect
        return NextResponse.redirect(`${redirectTo}${next}`)
      }
      
      console.error("Email verification error:", error.message)
    }
  }
  
  // If verification fails, redirect to an error page
  return NextResponse.redirect(`${redirectTo}/auth/error?error=verification_failed`)
}
