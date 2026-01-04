import { createRouteHandlerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

/**
 * Server-side sign-out route handler.
 * 
 * This is the RECOMMENDED approach for Supabase Auth in Next.js.
 * Calling signOut() on the server ensures cookies are properly cleared
 * and avoids client-side race conditions with auth state listeners.
 * 
 * @see https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs#sign-out
 */
export async function POST(req: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(req)

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  // Redirect to homepage after sign-out
  const response = NextResponse.redirect(new URL("/", req.url), {
    status: 302,
  })

  // Apply the cookies from signOut to the response
  return applyCookies(response)
}

export async function GET(req: NextRequest) {
  // Avoid CSRF-able sign-out via cross-site GET. Only POST mutates session.
  return NextResponse.redirect(new URL("/", req.url), { status: 302 })
}
