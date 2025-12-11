import { NextRequest, NextResponse } from "next/server"
import { getStoreProducts } from "@/lib/data/store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  const { sellerId } = await params
  const searchParams = request.nextUrl.searchParams
  const offset = parseInt(searchParams.get("offset") || "0", 10)
  const limit = parseInt(searchParams.get("limit") || "12", 10)
  const orderBy = (searchParams.get("orderBy") as "created_at" | "price" | "rating") || "created_at"
  const ascending = searchParams.get("ascending") === "true"
  
  try {
    const data = await getStoreProducts(sellerId, { offset, limit, orderBy, ascending })
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching store products:", error)
    return NextResponse.json({ products: [], total: 0 }, { status: 500 })
  }
}
