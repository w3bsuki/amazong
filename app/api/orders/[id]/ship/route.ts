import { NextResponse } from "next/server"
import { updateOrderItemStatus } from "@/app/actions/orders"
import type { ShippingCarrier } from "@/lib/order-status"


export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: { trackingNumber?: string; shippingCarrier?: ShippingCarrier } = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const result = await updateOrderItemStatus(
    id,
    "shipped",
    body.trackingNumber,
    body.shippingCarrier
  )

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Failed" }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
