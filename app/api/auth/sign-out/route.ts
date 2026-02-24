import { createRouteHandlerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(req)

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      logger.warn("[Auth] Sign out route failed to load user", userError)
    }

    if (user) {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        logger.error("[Auth] Sign out route failed to sign out user", signOutError)
      }
    }
  } catch (error) {
    logger.error("[Auth] Sign out route unexpected error", error)
  }

  const response = NextResponse.redirect(new URL("/", req.url), { status: 302 })
  return applyCookies(response)
}

export async function GET(req: NextRequest) {
  // Legacy endpoint: keep GET non-mutating to avoid CSRF-able signout.
  return NextResponse.redirect(new URL("/", req.url), { status: 302 })
}
