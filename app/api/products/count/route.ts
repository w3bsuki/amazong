import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { fetchProductsCount } from "@/lib/data/products/api-count"
import { getShippingFilter, parseShippingRegion } from "@/lib/shipping"
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

function mergeAbortSignals(a: AbortSignal | undefined, b: AbortSignal): AbortSignal {
  if (a?.aborted || b.aborted) return AbortSignal.abort()
  if (!a) return b

  const controller = new AbortController()
  const abort = () => controller.abort()
  a.addEventListener("abort", abort, { once: true })
  b.addEventListener("abort", abort, { once: true })
  return controller.signal
}

function createQuerySignal(timeoutMs: number, requestSignal?: AbortSignal): { signal: AbortSignal; clear: () => void } {
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs)

  return {
    signal: mergeAbortSignals(requestSignal, timeoutController.signal),
    clear: () => clearTimeout(timeoutId),
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

    const supabase = createStaticClient()
    const { signal: querySignal, clear: clearQueryTimeout } = createQuerySignal(2500, request.signal)

    // Shipping zone filter from cookie (shared helper; avoids invalid column names)
    const zone = parseShippingRegion(request.cookies.get("user-zone")?.value)
    const shippingFilter = getShippingFilter(zone)

    const countResult = await fetchProductsCount({
      supabase,
      categoryId: categoryId ?? null,
      query: query ?? null,
      filters,
      shippingFilter: shippingFilter ?? null,
      signal: querySignal,
    }).finally(clearQueryTimeout)

    if (!countResult.ok) {
      return buildCountQueryErrorResponse(countResult.error, request.signal)
    }

    return NextResponse.json({
      count: countResult.count,
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
