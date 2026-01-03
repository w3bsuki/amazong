import { createRouteHandlerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const { supabase, applyCookies } = createRouteHandlerClient(req)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    revalidatePath("/", "layout")
    const response = NextResponse.redirect(new URL("/", req.url), { status: 302 })
    return applyCookies(response)
}

export async function GET(req: NextRequest) {
    // Legacy endpoint: keep GET non-mutating to avoid CSRF-able signout.
    return NextResponse.redirect(new URL("/", req.url), { status: 302 })
}