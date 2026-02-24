import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
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

interface CountQueryBuilder {
  or(filter: string): CountQueryBuilder
  filter(column: string, operator: string, value: string): CountQueryBuilder
  gte(column: string, value: number): CountQueryBuilder
  lte(column: string, value: number): CountQueryBuilder
  gt(column: string, value: number): CountQueryBuilder
  eq(column: string, value: boolean): CountQueryBuilder
  ilike(column: string, value: string): CountQueryBuilder
  contains(column: string, value: Record<string, string>): CountQueryBuilder
  in(column: string, values: string[]): CountQueryBuilder
  abortSignal(signal: AbortSignal): Promise<{ count: number | null; error: unknown }>
  then<TResult1 = { count: number | null; error: unknown }, TResult2 = never>(
    onfulfilled?: ((value: { count: number | null; error: unknown }) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>
}

type CountFilters = z.infer<typeof CountRequestSchema>["filters"]

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

function createQuerySignal(timeoutMs: number, requestSignal?: AbortSignal): { signal: AbortSignal | undefined; clear: () => void } {
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs)

  return {
    signal: mergeAbortSignals(requestSignal, timeoutController.signal),
    clear: () => clearTimeout(timeoutId),
  }
}

function buildBaseCountQuery(
  supabase: ReturnType<typeof createStaticClient>,
  verifiedOnly: boolean
): CountQueryBuilder {
  let countQuery = supabase
    .from("products")
    .select(
      verifiedOnly
        ? "id, profiles!products_seller_id_fkey(is_verified_business)"
        : "id",
      { count: "planned", head: true }
    ) as unknown as CountQueryBuilder

  // Public browsing surfaces must not show non-active listings.
  // Temporary legacy allowance: status can be NULL for older rows.
  countQuery = countQuery.or("status.eq.active,status.is.null")
  return countQuery
}

function applyCategorySearchAndShippingFilters(params: {
  countQuery: CountQueryBuilder
  categoryId: string | null | undefined
  query: string | null | undefined
  shippingFilter: string | null
}): CountQueryBuilder {
  let { countQuery } = params
  const { categoryId, query, shippingFilter } = params

  // Category filter via category_ancestors (GIN index)
  if (categoryId) {
    countQuery = countQuery.filter("category_ancestors", "cs", `{${categoryId}}`)
  }

  // Search query filter
  if (query && query.trim()) {
    const searchTerm = `%${query.trim()}%`
    countQuery = countQuery.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
  }

  if (shippingFilter) {
    countQuery = countQuery.or(shippingFilter)
  }

  return countQuery
}

function applyNumericAndToggleFilters(
  countQuery: CountQueryBuilder,
  filters: CountFilters,
  verifiedOnly: boolean
): CountQueryBuilder {
  let query = countQuery

  // Price filters
  if (filters?.minPrice != null) {
    query = query.gte("price", filters.minPrice)
  }
  if (filters?.maxPrice != null) {
    query = query.lte("price", filters.maxPrice)
  }

  // Rating filter
  if (filters?.minRating != null) {
    query = query.gte("rating", filters.minRating)
  }

  // Availability filter
  if (filters?.availability === "instock") {
    query = query.gt("stock", 0)
  }

  // Deals filter (match canonical deal_products semantics: compare-at OR explicit sale)
  if (filters?.deals) {
    query = query.or("and(is_on_sale.eq.true,sale_percent.gt.0),list_price.not.is.null")
  }

  // Verified sellers (business verification)
  if (verifiedOnly) {
    query = query.eq("profiles.is_verified_business", true)
  }

  return query
}

function resolveNormalizedCity(city: string | null | undefined): string | null {
  const normalizedCity = city?.trim().toLowerCase()
  if (!normalizedCity || normalizedCity === "undefined" || normalizedCity === "null") {
    return null
  }
  return normalizedCity
}

function applyCityFilter(countQuery: CountQueryBuilder, filters: CountFilters): CountQueryBuilder {
  let query = countQuery
  const city = resolveNormalizedCity(filters?.city ?? null)

  if (filters?.nearby === true) {
    query = query.ilike("seller_city", city ?? "sofia")
  } else if (city) {
    query = query.ilike("seller_city", city)
  }

  return query
}

function applyAttributeFilters(countQuery: CountQueryBuilder, filters: CountFilters): CountQueryBuilder {
  let query = countQuery
  if (!filters?.attributes) return query

  for (const [rawAttrName, attrValue] of Object.entries(filters.attributes).slice(0, 25)) {
    if (!attrValue) continue

    const attrName = normalizeAttributeKey(rawAttrName) || rawAttrName

    if (Array.isArray(attrValue)) {
      const values = attrValue.filter((v): v is string => typeof v === "string" && v.length > 0)
      if (values.length === 1) {
        const [firstValue] = values
        if (firstValue !== undefined) {
          query = query.contains("attributes", { [attrName]: firstValue })
        }
      } else if (values.length > 1) {
        query = query.in(`attributes->>${attrName}`, values)
      }
    } else if (typeof attrValue === "string" && attrValue.length > 0) {
      query = query.contains("attributes", { [attrName]: attrValue })
    }
  }

  return query
}

async function executeCountQuery(params: {
  countQuery: CountQueryBuilder
  querySignal: AbortSignal | undefined
  clearQueryTimeout: () => void
}): Promise<{ count: number | null; error: unknown }> {
  const { countQuery, querySignal, clearQueryTimeout } = params

  try {
    if (querySignal) {
      return await countQuery.abortSignal(querySignal)
    }
    return await countQuery
  } finally {
    clearQueryTimeout()
  }
}

function buildCountQueryErrorResponse(error: unknown, requestSignal: AbortSignal): NextResponse<{ error: string } | null> {
  if (requestSignal.aborted) {
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

export async function POST(request: NextRequest): Promise<NextResponse<CountResponse | { error: string } | null>> {
  try {
    const parseResult = CountRequestSchema.safeParse(await request.json())
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const body = parseResult.data
    const { categoryId, query, filters = {} } = body
    const verifiedOnly = filters.verified === true

    const supabase = createStaticClient()
    const { signal: querySignal, clear: clearQueryTimeout } = createQuerySignal(2500, request.signal)

    // Shipping zone filter from cookie (shared helper; avoids invalid column names)
    const zone = parseShippingRegion(request.cookies.get("user-zone")?.value)
    const shippingFilter = getShippingFilter(zone)
    let countQuery = buildBaseCountQuery(supabase, verifiedOnly)
    countQuery = applyCategorySearchAndShippingFilters({
      countQuery,
      categoryId,
      query,
      shippingFilter,
    })
    countQuery = applyNumericAndToggleFilters(countQuery, filters, verifiedOnly)
    countQuery = applyCityFilter(countQuery, filters)
    countQuery = applyAttributeFilters(countQuery, filters)

    const { count, error } = await executeCountQuery({
      countQuery,
      querySignal,
      clearQueryTimeout,
    })

    if (error) {
      return buildCountQueryErrorResponse(error, request.signal)
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
