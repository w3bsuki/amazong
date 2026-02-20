import { trackOrderPayloadSchema } from "@/lib/validation/orders"
import { handleOrderItemTrackingPost } from "../_lib/order-item-tracking-post"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Tracking is meaningful once shipped; we use shipped status as the canonical state.
  return handleOrderItemTrackingPost(req, params, trackOrderPayloadSchema)
}
