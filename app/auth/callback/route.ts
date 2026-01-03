import { createRouteHandlerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

function safeNextPath(input: string | null | undefined): string {
    if (!input) return "/"
    if (!input.startsWith("/")) return "/"
    if (input.startsWith("//")) return "/"
    return input
}

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    // if "next" is in param, use it as the redirect URL
    const next = safeNextPath(searchParams.get("next"))

    if (code) {
        const { supabase, applyCookies } = createRouteHandlerClient(request)

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === "development"

            const redirectBase = isLocalEnv ? origin : forwardedHost ? `https://${forwardedHost}` : origin
            const response = NextResponse.redirect(`${redirectBase}${next}`)
            return applyCookies(response)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
