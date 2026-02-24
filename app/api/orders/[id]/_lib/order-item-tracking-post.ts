import { noStoreJson } from "@/lib/api/response-helpers"

import { updateOrderItemStatus } from "../../../../actions/orders-status"
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
  try {
    const paramsResult = orderItemIdParamSchema.safeParse(await params)
    if (!paramsResult.success) {
      return noStoreJson({ error: "Invalid order item id" }, { status: 400 })
    }

    const rawBody = await req.text()
    let parsedBody: unknown = {}
    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody)
      } catch {
        return noStoreJson({ error: "Invalid JSON" }, { status: 400 })
      }
    }

    const bodyResult = payloadSchema.safeParse(parsedBody)
    if (!bodyResult.success) {
      return noStoreJson({ error: "Invalid request" }, { status: 400 })
    }

    const result = await updateOrderItemStatus(
      paramsResult.data.id,
      "shipped",
      bodyResult.data.trackingNumber,
      bodyResult.data.shippingCarrier,
    )

    if (!result.success) {
      const errorMessage = result.error || "Failed"
      const status =
        errorMessage === "Not authenticated"
          ? 401
          : errorMessage === "Order item not found"
            ? 404
            : errorMessage === "Invalid input"
              ? 400
              : 500

      return noStoreJson({ error: errorMessage }, { status })
    }

    return noStoreJson({ ok: true })
  } catch (error) {
    console.error("[order-item-tracking-post] Unexpected error:", error)
    return noStoreJson({ error: "Internal server error" }, { status: 500 })
  }
}
