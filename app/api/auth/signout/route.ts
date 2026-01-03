import { createRouteHandlerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
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

  // Revalidate the entire layout to ensure fresh data
  revalidatePath("/", "layout")

  // Redirect to homepage after sign-out
  const response = NextResponse.redirect(new URL("/", req.url), {
    status: 302,
  })

  // Apply the cookies from signOut to the response
  return applyCookies(response)
}

// Also support GET for easier testing, but POST is preferred
export async function GET(req: NextRequest) {
  return POST(req)
}
