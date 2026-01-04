import { getProductsByCategorySlug, toUI } from "@/lib/data/products"
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"
import { cookies } from "next/headers"
import { parseShippingRegion, type ShippingRegion } from "@/lib/shipping"

const CACHEABLE_ZONE_VALUES = new Set(["BG", "UK", "EU", "US", "WW", "GB"])

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const requestedLimit = Number.parseInt(searchParams.get("limit") || "18", 10)
    const limit = Math.min(24, Math.max(1, Number.isFinite(requestedLimit) ? requestedLimit : 18))

    const zoneParamRaw = searchParams.get("zone")
    const zoneParam = zoneParamRaw ? zoneParamRaw.toUpperCase() : null

    let userZone: ShippingRegion = "WW"
    let cacheable = false

    if (zoneParam) {
      if (!CACHEABLE_ZONE_VALUES.has(zoneParam)) {
        return noStoreJson({ error: "Invalid zone" }, { status: 400 })
      }

      userZone = parseShippingRegion(zoneParam)
      cacheable = true
    } else {
      const cookieStore = await cookies()
      userZone = parseShippingRegion(cookieStore.get("user-zone")?.value)
    }

    const products = await getProductsByCategorySlug(slug, limit, userZone)
    const uiProducts = products.map(toUI)

    return cacheable
      ? cachedJsonResponse({ products: uiProducts }, "products")
      : noStoreJson({ products: uiProducts })
  } catch (error) {
    console.error("Category products API error:", error)
    return noStoreJson({ error: "Internal Server Error" }, { status: 500 })
  }
}
