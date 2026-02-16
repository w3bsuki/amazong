import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createAdminClient, createRouteHandlerClient } from "@/lib/supabase/server"

const optionalNonEmptyString = (schema: z.ZodString) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return value
    const trimmed = value.trim()
    return trimmed.length === 0 ? undefined : trimmed
  }, schema.optional())

const requestSchema = z.object({
  username: optionalNonEmptyString(z.string().min(3).max(30)),
  displayName: optionalNonEmptyString(z.string().max(50)),
  businessName: optionalNonEmptyString(z.string().max(100)),
  accountType: z.enum(["personal", "business"]),
  category: optionalNonEmptyString(z.string().max(100)),
  website: z.preprocess((value) => {
    if (typeof value !== "string") return value
    const trimmed = value.trim()
    return trimmed.length === 0 ? undefined : trimmed
  }, z.string().url().optional()),
  location: optionalNonEmptyString(z.string().max(100)),
  interests: z.array(z.string().min(1).max(50)).max(50).optional(),
  avatarType: z.enum(["custom", "generated"]).optional(),
  avatarVariant: z.string().optional(),
  avatarPalette: z.number().int().min(0).max(50).optional(),
})

type OnboardingCompleteRequest = z.infer<typeof requestSchema>

function getPaletteIndexFromSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash % 6
}

function buildGeneratedAvatar(seed: string, palette?: number): string {
  const safeSeed = seed.trim().length > 0 ? seed.trim() : "user"
  const paletteIndex = palette ?? getPaletteIndexFromSeed(safeSeed)
  return `boring-avatar:marble:${paletteIndex}:${safeSeed}`
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  try {
    const rawBody: unknown = await request.json()
    const parsed = requestSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const body: OnboardingCompleteRequest = parsed.data
    void (await params) // Keep route signature stable for locale-prefixed API

    const { supabase, applyCookies } = createRouteHandlerClient(request)
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return applyCookies(
        NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
      )
    }

    // Idempotency + safety: this endpoint should only be used to finish first-run onboarding.
    // If a user already completed onboarding, don't let this route become a "backdoor" for
    // changing protected/sensitive profile fields.
    const { data: currentProfile, error: currentProfileError } = await supabase
      .from("profiles")
      .select("onboarding_completed, avatar_url, username")
      .eq("id", user.id)
      .single()

    if (currentProfileError) {
      return applyCookies(
        NextResponse.json({ error: "Failed to load profile" }, { status: 500 })
      )
    }

    if (currentProfile?.onboarding_completed) {
      if (!currentProfile.avatar_url) {
        const avatarSeed = currentProfile.username ?? body.username ?? user.email ?? user.id
        const generatedAvatar = buildGeneratedAvatar(avatarSeed, body.avatarPalette)
        await supabase
          .from("profiles")
          .update({
            avatar_url: generatedAvatar,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
      }
      return applyCookies(NextResponse.json({ success: true }))
    }

    // NOTE: `account_type` is treated as a sensitive entitlement-like field in Treido.
    // Authenticated users may be restricted from updating it directly at the DB grant layer.
    // Prefer the service-role client, but fall back to the authed client so onboarding can
    // still complete even if the service key is not configured in the runtime.
    let adminSupabase: ReturnType<typeof createAdminClient> | null = null
    try {
      adminSupabase = createAdminClient()
    } catch {
      adminSupabase = null
    }

    // Build profile update object (only columns that exist in `public.profiles`)
    const profileUpdate: Record<string, unknown> = {
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    }

    if (adminSupabase) {
      profileUpdate.account_type = body.accountType
    }

    if (body.username) {
      profileUpdate.username = body.username
    }

    if (body.displayName) {
      profileUpdate.display_name = body.displayName
    }

    if (body.location) {
      profileUpdate.location = body.location
    }

    if (body.accountType === "business") {
      if (body.businessName) profileUpdate.business_name = body.businessName
      if (body.website) profileUpdate.website_url = body.website
    }

    const avatarSeed = currentProfile?.username ?? body.username ?? user.email ?? user.id
    const generatedAvatar = buildGeneratedAvatar(avatarSeed, body.avatarPalette)
    if (body.avatarType === "generated" || !currentProfile?.avatar_url) {
      profileUpdate.avatar_url = generatedAvatar
    }

    // Update profile. Service role bypasses column grants; fallback respects grants.
    //
    // Important: if the service-role client is present but misconfigured (bad key / bad env),
    // onboarding should still be able to complete via the authed client (without `account_type`).
    // Otherwise we can deadlock users into onboarding forever.
    const updateClient = adminSupabase ?? supabase
    const { error: profileError } = await updateClient.from("profiles").update(profileUpdate).eq("id", user.id)

    if (profileError && adminSupabase) {
      const fallbackUpdate: Record<string, unknown> = { ...profileUpdate }
      delete fallbackUpdate.account_type

      const { error: fallbackError } = await supabase
        .from("profiles")
        .update(fallbackUpdate)
        .eq("id", user.id)

      if (!fallbackError) {
        return applyCookies(NextResponse.json({ success: true }))
      }
    }

    if (profileError) {
      // Friendly conflict for username collisions (race vs availability check).
      if (profileError.code === "23505") {
        return applyCookies(
          NextResponse.json(
            { error: "Username already taken" },
            { status: 409 }
          )
        )
      }

      return applyCookies(
        NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
      )
    }

    return applyCookies(NextResponse.json({ success: true }))
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
