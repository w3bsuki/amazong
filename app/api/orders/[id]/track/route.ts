import { NextResponse } from "next/server"
import { updateOrderItemStatus } from "@/app/actions/orders-status"
import { orderItemIdParamSchema, trackOrderPayloadSchema } from "@/lib/validation/orders"


export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paramsResult = orderItemIdParamSchema.safeParse(await params)
  if (!paramsResult.success) {
    return NextResponse.json({ error: "Invalid order item id" }, { status: 400 })
  }

  const rawBody = await req.text()
  let parsedBody: unknown = {}
  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }
  }

  const bodyResult = trackOrderPayloadSchema.safeParse(parsedBody)
  if (!bodyResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Tracking is meaningful once shipped; we use shipped status as the canonical state.
  const result = await updateOrderItemStatus(
    paramsResult.data.id,
    "shipped",
    bodyResult.data.trackingNumber,
    bodyResult.data.shippingCarrier
  )

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Failed" }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
