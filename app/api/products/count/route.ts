import { NextRequest, NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { getPublicSupabaseEnv } from "@/lib/supabase/shared"
import { getShippingFilter, parseShippingRegion } from "@/lib/shipping"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import { logError } from "@/lib/logger"
import { z } from "zod"

/**
 * POST /api/products/count
 * 
 * Live count endpoint for Filter Hub. Returns count-only, no payload.
 * Uses `count: "planned"` for fast response (<300ms p95).
 */

interface CountResponse {
  count: number
  timestamp: string
}

const CountRequestSchema = z
  .object({
    categoryId: z.string().uuid().nullable().optional(),
    query: z.string().trim().min(1).max(200).nullable().optional(),
    filters: z
      .object({
        minPrice: z.coerce.number().nonnegative().nullable().optional(),
        maxPrice: z.coerce.number().nonnegative().nullable().optional(),
        minRating: z.coerce.number().min(0).max(5).nullable().optional(),
        availability: z.enum(["instock"]).nullable().optional(),
        deals: z.coerce.boolean().nullable().optional(),
        verified: z.coerce.boolean().nullable().optional(),
        city: z.string().trim().min(1).max(80).nullable().optional(),
        nearby: z.coerce.boolean().nullable().optional(),
        attributes: z
          .record(z.string(), z.union([z.string(), z.array(z.string()).max(20)]))
          .optional(),
      })
      .optional(),
  })
  .strict()

function getAbortErrorMessage(err: unknown): string | null {
  if (!err) return null
  if (err instanceof Error && err.name === "AbortError") return err.message
  if (err instanceof Error && /aborted/i.test(err.message)) return err.message
  if (typeof err === "object" && err && "message" in err) {
    const message = (err as { message?: unknown }).message
    if (typeof message === "string" && /aborted/i.test(message)) return message
  }
  return null
}

function mergeAbortSignals(a: AbortSignal | undefined, b: AbortSignal | undefined): AbortSignal | undefined {
  if (a?.aborted || b?.aborted) return AbortSignal.abort()
  if (!a) return b
  if (!b) return a

  const controller = new AbortController()
  const abort = () => controller.abort()
  a.addEventListener("abort", abort, { once: true })
  b.addEventListener("abort", abort, { once: true })
  return controller.signal
}

function fetchWithTimeoutMs(timeoutMs: number, requestSignal?: AbortSignal) {
  return (input: RequestInfo | URL, init?: RequestInit) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const merged = mergeAbortSignals(init?.signal ?? undefined, requestSignal)
    if (merged) {
      if (merged.aborted) controller.abort()
      else merged.addEventListener("abort", () => controller.abort(), { once: true })
    }

    return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeoutId))
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<CountResponse | { error: string }>> {
  try {
    const parseResult = CountRequestSchema.safeParse(await request.json())
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const body = parseResult.data
    const { categoryId, query, filters = {} } = body
    const verifiedOnly = filters.verified === true

    const { url, anonKey } = getPublicSupabaseEnv()
    const supabase = createSupabaseClient<Database>(url, anonKey, {
      global: { fetch: fetchWithTimeoutMs(2500, request.signal) },
    })

    // Build count-only query (select single column, head: true)
    let countQuery = supabase
      .from("products")
      .select(
        verifiedOnly
          ? "id, profiles!products_seller_id_fkey(is_verified_business)"
          : "id",
        { count: "planned", head: true }
      )
      // Public browsing surfaces must not show non-active listings.
      // Temporary legacy allowance: status can be NULL for older rows.
      .or("status.eq.active,status.is.null")

    // Category filter via category_ancestors (GIN index)
    if (categoryId) {
      countQuery = countQuery.filter("category_ancestors", "cs", `{${categoryId}}`)
    }

    // Search query filter
    if (query && query.trim()) {
      const searchTerm = `%${query.trim()}%`
      countQuery = countQuery.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    }

    // Shipping zone filter from cookie (shared helper; avoids invalid column names)
    const zone = parseShippingRegion(request.cookies.get("user-zone")?.value)
    const shippingFilter = getShippingFilter(zone)
    if (shippingFilter) {
      countQuery = countQuery.or(shippingFilter)
    }

    // Price filters
    if (filters.minPrice != null) {
      countQuery = countQuery.gte("price", filters.minPrice)
    }
    if (filters.maxPrice != null) {
      countQuery = countQuery.lte("price", filters.maxPrice)
    }

    // Rating filter
    if (filters.minRating != null) {
      countQuery = countQuery.gte("rating", filters.minRating)
    }

    // Availability filter
    if (filters.availability === "instock") {
      countQuery = countQuery.gt("stock", 0)
    }

    // Deals filter (match canonical deal_products semantics: compare-at OR explicit sale)
    if (filters.deals) {
      countQuery = countQuery.or("and(is_on_sale.eq.true,sale_percent.gt.0),list_price.not.is.null")
    }

    // Verified sellers (business verification)
    if (verifiedOnly) {
      countQuery = countQuery.eq("profiles.is_verified_business", true)
    }

    const normalizedCity = filters.city?.trim().toLowerCase()
    const city =
      normalizedCity && normalizedCity !== "undefined" && normalizedCity !== "null"
        ? normalizedCity
        : null

    if (filters.nearby === true) {
      countQuery = countQuery.ilike("seller_city", city ?? "sofia")
    } else if (city) {
      countQuery = countQuery.ilike("seller_city", city)
    }

    // Attribute filters
    if (filters.attributes) {
      for (const [rawAttrName, attrValue] of Object.entries(filters.attributes).slice(0, 25)) {
        if (!attrValue) continue

        const attrName = normalizeAttributeKey(rawAttrName) || rawAttrName

        if (Array.isArray(attrValue)) {
          const values = attrValue.filter((v): v is string => typeof v === "string" && v.length > 0)
          if (values.length === 1) {
            countQuery = countQuery.contains("attributes", { [attrName]: values[0] })
          } else if (values.length > 1) {
            countQuery = countQuery.in(`attributes->>${attrName}`, values)
          }
        } else if (typeof attrValue === "string" && attrValue.length > 0) {
          countQuery = countQuery.contains("attributes", { [attrName]: attrValue })
        }
      }
    }

    const { count, error } = await countQuery

    if (error) {
      if (request.signal.aborted) {
        return new NextResponse(null, { status: 499 })
      }

      const abortMessage = getAbortErrorMessage(error)
      if (abortMessage) {
        // Usually a Supabase fetch timeout or an aborted client request.
        return NextResponse.json({ error: "Count request timed out" }, { status: 504 })
      }

      logError("api_products_count_supabase_error", error, {
        route: "api/products/count",
      })
      return NextResponse.json({ error: "Failed to get count" }, { status: 500 })
    }

    return NextResponse.json({
      count: count ?? 0,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    if (request.signal.aborted) {
      return new NextResponse(null, { status: 499 })
    }

    const abortMessage = getAbortErrorMessage(err)
    if (abortMessage) {
      return NextResponse.json({ error: "Count request timed out" }, { status: 504 })
    }

    logError("api_products_count_handler_error", err, {
      route: "api/products/count",
    })
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
