import { requireAuth } from "@/lib/auth/require-auth"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { z } from "zod"

export const OrderActionItemIdSchema = z.string().uuid()

type OrderActionContextError = "invalid_order_item_id" | "not_authenticated"

type OrderActionContext = Envelope<
  {
    orderItemId: string
    userId: string
    supabase: NonNullable<Awaited<ReturnType<typeof requireAuth>>>["supabase"]
  },
  { error: OrderActionContextError }
>

function fail(error: OrderActionContextError): OrderActionContext {
  return errorEnvelope({ error })
}

export async function getOrderActionContext(orderItemId: string): Promise<OrderActionContext> {
  const parsedOrderItemId = OrderActionItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) {
    return fail("invalid_order_item_id")
  }

  const auth = await requireAuth()
  if (!auth) {
    return fail("not_authenticated")
  }

  return successEnvelope({
    orderItemId: parsedOrderItemId.data,
    userId: auth.user.id,
    supabase: auth.supabase,
  })
}
