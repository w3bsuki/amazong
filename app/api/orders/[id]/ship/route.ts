import { shipOrderPayloadSchema } from "@/lib/validation/orders"
import { handleOrderItemTrackingPost } from "../_lib/order-item-tracking-post"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleOrderItemTrackingPost(req, params, shipOrderPayloadSchema)
}
