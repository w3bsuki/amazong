import { NextResponse } from "next/server"
import { getProductsByCategorySlug, toUI } from "@/lib/data/products"
import { cookies } from "next/headers"
import type { ShippingRegion } from "@/lib/shipping"

function noStoreJson(data: unknown, init?: ResponseInit) {
  const res = NextResponse.json(data, init)
  res.headers.set("Cache-Control", "private, no-store")
  res.headers.set("CDN-Cache-Control", "private, no-store")
  res.headers.set("Vercel-CDN-Cache-Control", "private, no-store")
  return res
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "18")
    
    const cookieStore = await cookies()
    const userZone = (cookieStore.get("user-zone")?.value || "WW") as ShippingRegion

    const products = await getProductsByCategorySlug(slug, limit, userZone)
    const uiProducts = products.map(toUI)

    return noStoreJson({ products: uiProducts })
  } catch (error) {
    console.error("Category products API error:", error)
    return noStoreJson({ error: "Internal Server Error" }, { status: 500 })
  }
}
