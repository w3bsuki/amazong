import { NextResponse } from "next/server"

import { updateOrderItemStatus } from "@/app/actions/orders-status"
import { orderItemIdParamSchema } from "@/lib/validation/orders"
import type { ShippingCarrier } from "@/lib/order-status"

type SafeParseSuccess<T> = { success: true; data: T }
type SafeParseFailure = { success: false; error: unknown }
type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseFailure
type SafeParseSchema<T> = { safeParse: (data: unknown) => SafeParseResult<T> }

type TrackingPayload = {
  trackingNumber?: string | undefined
  shippingCarrier?: ShippingCarrier | undefined
}

export async function handleOrderItemTrackingPost(
  req: Request,
  params: Promise<{ id: string }>,
  payloadSchema: SafeParseSchema<TrackingPayload>,
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

  const bodyResult = payloadSchema.safeParse(parsedBody)
  if (!bodyResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const result = await updateOrderItemStatus(
    paramsResult.data.id,
    "shipped",
    bodyResult.data.trackingNumber,
    bodyResult.data.shippingCarrier,
  )

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Failed" }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
