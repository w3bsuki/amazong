import { requireAuth } from "@/lib/auth/require-auth"
import { z } from "zod"

export const OrderActionItemIdSchema = z.string().uuid()

type OrderActionContext =
  | {
      success: true
      orderItemId: string
      userId: string
      supabase: NonNullable<Awaited<ReturnType<typeof requireAuth>>>["supabase"]
    }
  | {
      success: false
      error: "invalid_order_item_id" | "not_authenticated"
    }

export async function getOrderActionContext(orderItemId: string): Promise<OrderActionContext> {
  const parsedOrderItemId = OrderActionItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) {
    return { success: false, error: "invalid_order_item_id" }
  }

  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "not_authenticated" }
  }

  return {
    success: true,
    orderItemId: parsedOrderItemId.data,
    userId: auth.user.id,
    supabase: auth.supabase,
  }
}
