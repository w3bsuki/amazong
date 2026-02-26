"use server"

import { z } from "zod"
import { revalidateTag } from "next/cache"

import { requireAuth } from "@/lib/auth/require-auth"
import { createAdminClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

const ReportListingSchema = z.object({
  productId: z.string().uuid(),
  reason: z.enum(["spam", "harassment", "scam", "inappropriate", "other"]),
  details: z.string().trim().max(1000).optional(),
})

export type ListingReportReason = z.infer<typeof ReportListingSchema.shape.reason>

export type ReportListingResult =
  | { success: true }
  | {
      success: false
      error: string
      code: "auth_required" | "invalid_input" | "not_found" | "not_allowed" | "create_failed"
    }

export async function reportListing(input: {
  productId: string
  reason: ListingReportReason
  details?: string
}): Promise<ReportListingResult> {
  const parsed = ReportListingSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, code: "invalid_input", error: "Invalid report input" }
  }

  const auth = await requireAuth()
  if (!auth) {
    return { success: false, code: "auth_required", error: "Not authenticated" }
  }

  const { user, supabase } = auth

  try {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, seller_id, status")
      .eq("id", parsed.data.productId)
      .maybeSingle()

    if (productError || !product) {
      return { success: false, code: "not_found", error: "Listing not found" }
    }

    if (product.seller_id === user.id) {
      return { success: false, code: "not_allowed", error: "Cannot report your own listing" }
    }

    const details = parsed.data.details?.trim() || null
    const body = details ? `Reason: ${parsed.data.reason} — ${details}` : `Reason: ${parsed.data.reason}`

    const admin = createAdminClient()
    const { error } = await admin.from("notifications").insert({
      user_id: user.id,
      type: "system",
      title: "Listing Reported",
      body,
      data: {
        type: "listing_report",
        product_id: parsed.data.productId,
        reporter_id: user.id,
        reason: parsed.data.reason,
        details,
      },
      product_id: parsed.data.productId,
    })

    if (error) {
      logger.error("[pdp:report-listing] insert_failed", error, {
        productId: parsed.data.productId,
        reporterId: user.id,
        reason: parsed.data.reason,
      })
      return { success: false, code: "create_failed", error: "Failed to submit report" }
    }

    revalidateTag("notifications", "max")

    return { success: true }
  } catch (err) {
    logger.error("[pdp:report-listing] unexpected_error", err, {
      productId: parsed.data.productId,
      reporterId: user.id,
      reason: parsed.data.reason,
    })
    return { success: false, code: "create_failed", error: "An unexpected error occurred" }
  }
}

