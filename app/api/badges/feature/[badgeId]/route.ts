import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"

interface RouteContext {
  params: Promise<{ badgeId: string }>
}

interface FeatureBadgeRow {
  id: string
  user_id: string
  is_featured: boolean | null
}

function isMissingIsFeaturedColumnError(error: { code?: string; message?: string }) {
  return error.code === "42703" || error.message?.includes("is_featured") === true
}

/**
 * PATCH /api/badges/feature/[badgeId]
 * Toggles featured state for a user-owned badge.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
    applyCookies(NextResponse.json(body, init))

  try {
    const { badgeId } = await params
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get the badge and verify ownership
    const { data: badgeData, error: badgeError } = await supabase
      .from("user_badges")
      .select("id, user_id, is_featured")
      .eq("id", badgeId)
      .single()
    
    if (badgeError || !badgeData) {
      if (badgeError && isMissingIsFeaturedColumnError(badgeError)) {
        return json({ error: "Badge feature toggle is unavailable" }, { status: 501 })
      }
      return json({ error: "Badge not found" }, { status: 404 })
    }

    const badge = badgeData as unknown as FeatureBadgeRow
    
    if (badge.user_id !== user.id) {
      return json({ error: "Forbidden" }, { status: 403 })
    }

    const nextIsFeatured = !(badge.is_featured ?? false)

    const { data: updatedData, error: updateError } = await supabase
      .from("user_badges")
      .update({ is_featured: nextIsFeatured } as never)
      .eq("id", badgeId)
      .eq("user_id", user.id)
      .select("is_featured")
      .single()

    if (updateError || !updatedData) {
      if (updateError && isMissingIsFeaturedColumnError(updateError)) {
        return json({ error: "Badge feature toggle is unavailable" }, { status: 501 })
      }
      return json({ error: "Failed to update badge" }, { status: 500 })
    }

    const updatedBadge = updatedData as unknown as { is_featured: boolean | null }

    return json({
      success: true,
      is_featured: updatedBadge.is_featured === true,
    })
    
  } catch (error) {
    console.error("Error updating badge:", error)
    return json({ error: "Internal server error" }, { status: 500 })
  }
}
