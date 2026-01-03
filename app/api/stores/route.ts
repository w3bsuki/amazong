import { NextResponse, type NextRequest } from "next/server"

/**
 * @deprecated REMOVED - This route is no longer in use.
 * 
 * Users now get a username at signup and seller profile data
 * is managed via server actions in app/actions/username.ts
 * 
 * Callers should use:
 * - updateProfile() server action for profile updates
 * - Server actions in app/actions/ for other operations
 */
export async function POST(_request: NextRequest) {
    return NextResponse.json(
        { 
            error: "This endpoint is deprecated. Use server actions for profile management.",
            migration: {
                action: "updateProfile",
                location: "app/actions/username.ts"
            }
        }, 
        { 
            status: 410, // Gone
            headers: {
                "Deprecation": "true",
                "Sunset": "2026-02-01",
                "Link": "</api/docs>; rel=\"deprecation\""
            }
        }
    )
}