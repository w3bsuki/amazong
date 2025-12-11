import { NextRequest, NextResponse } from "next/server"
import { getSellerFeedback } from "@/lib/data/store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> }
) {
  const { sellerId } = await params
  const searchParams = request.nextUrl.searchParams
  const offset = parseInt(searchParams.get("offset") || "0", 10)
  const limit = parseInt(searchParams.get("limit") || "10", 10)
  
  try {
    const data = await getSellerFeedback(sellerId, { offset, limit })
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching seller feedback:", error)
    return NextResponse.json({ feedback: [], total: 0 }, { status: 500 })
  }
}
