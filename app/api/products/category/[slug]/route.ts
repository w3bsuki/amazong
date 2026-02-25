import { getProductsByCategorySlug, toUI } from "@/lib/data/products"
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"
import type { NextRequest } from "next/server"
import { parseShippingRegion, type ShippingRegion } from "@/lib/shipping"
import { z } from "zod"

import { logger } from "@/lib/logger"
const CACHEABLE_ZONE_VALUES = new Set(["BG", "UK", "EU", "US", "WW", "GB"])

const ZoneParamSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
  z.enum(["BG", "UK", "EU", "US", "WW", "GB"]),
)

const CategoryProductsQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(24).optional(),
    zone: ZoneParamSchema.optional(),
  })
  .strict()

const CategorySlugSchema = z.string().trim().min(1).max(64)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params
    const slugResult = CategorySlugSchema.safeParse(rawSlug)
    if (!slugResult.success) {
      return noStoreJson({ error: "Invalid category slug" }, { status: 400 })
    }

    const slug = slugResult.data
    const { searchParams } = new URL(request.url)

    const parsedQuery = CategoryProductsQuerySchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
      zone: searchParams.get("zone") ?? undefined,
    })

    if (!parsedQuery.success) {
      return noStoreJson({ error: "Invalid query" }, { status: 400 })
    }

    const limit = parsedQuery.data.limit ?? 18
    const zoneParam = parsedQuery.data.zone ?? null

    let userZone: ShippingRegion = "WW"
    let cacheable = false

    if (zoneParam) {
      if (!CACHEABLE_ZONE_VALUES.has(zoneParam)) {
        return noStoreJson({ error: "Invalid zone" }, { status: 400 })
      }

      userZone = parseShippingRegion(zoneParam)
      cacheable = true
    } else {
      userZone = parseShippingRegion(request.cookies.get("user-zone")?.value)
    }

    const products = await getProductsByCategorySlug(slug, limit, userZone)
    const uiProducts = products.map(toUI)

    return cacheable
      ? cachedJsonResponse({ products: uiProducts }, "products")
      : noStoreJson({ products: uiProducts })
  } catch (error) {
    logger.error("Category products API error:", error)
    return noStoreJson({ error: "Internal Server Error" }, { status: 500 })
  }
}
