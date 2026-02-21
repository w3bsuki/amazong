import { beforeEach, describe, expect, it, vi } from "vitest"

type SupabaseQueryResult<T> = Promise<{ data: T; error: null } | { data: null; error: unknown }>

type OrdersUpsertCall = { payload: unknown; options: unknown }

type SupabaseMock = {
  from: (table: string) => unknown
  __calls: {
    orders: { upsert: OrdersUpsertCall[] }
    order_items: { insert: unknown[] }
  }
}

let supabase: SupabaseMock
const createAdminClientMock = vi.fn(() => supabase)

function createSupabaseMock(): SupabaseMock {
  const calls = {
    orders: { upsert: [] as OrdersUpsertCall[] },
    order_items: { insert: [] as unknown[] },
  }

  let storedOrderItems: Array<{ order_id: string; product_id: string; seller_id: string }> = []

  const from = (table: string) => {
    if (table === "orders") {
      return {
        upsert: (payload: unknown, options: unknown) => {
          calls.orders.upsert.push({ payload, options })
          return {
            select: () => ({
              single: (async () => ({ data: { id: "order-1" }, error: null })) as SupabaseQueryResult<{ id: string }>,
            }),
          }
        },
      }
    }

    if (table === "order_items") {
      return {
        select: () => ({
          eq: (async (_col: string, orderId: string) => {
            const data = storedOrderItems
              .filter((item) => item.order_id === orderId)
              .map((item) => ({ product_id: item.product_id, seller_id: item.seller_id }))
            return { data, error: null }
          }) as SupabaseQueryResult<Array<{ product_id: string; seller_id: string }>>,
        }),
        insert: (payload: unknown) => {
          calls.order_items.insert.push(payload)
          // Capture inserted order items so the second webhook run sees them as existing.
          if (Array.isArray(payload)) {
            storedOrderItems = payload
              .map((row) => {
                if (
                  row &&
                  typeof row === "object" &&
                  "order_id" in row &&
                  "product_id" in row &&
                  "seller_id" in row
                ) {
                  return {
                    order_id: String((row as { order_id: unknown }).order_id),
                    product_id: String((row as { product_id: unknown }).product_id),
                    seller_id: String((row as { seller_id: unknown }).seller_id),
                  }
                }
                return null
              })
              .filter((row): row is NonNullable<typeof row> => Boolean(row))
          }
          return { error: null }
        },
      }
    }

    if (table === "products") {
      return {
        select: () => ({
          in: (async (_col: string, ids: string[]) => {
            return {
              data: ids.map((id) => ({ id, seller_id: "seller-1" })),
              error: null,
            }
          }) as SupabaseQueryResult<Array<{ id: string; seller_id: string }>>,
        }),
      }
    }

    return {
      select: () => ({
        eq: (async () => ({ data: [], error: null })) as SupabaseQueryResult<unknown[]>,
        in: (async () => ({ data: [], error: null })) as SupabaseQueryResult<unknown[]>,
      }),
      insert: () => ({ error: null }),
      upsert: () => ({
        select: () => ({
          single: (async () => ({ data: { id: "order-1" }, error: null })) as SupabaseQueryResult<{ id: string }>,
        }),
      }),
    }
  }

  return { from, __calls: calls }
}

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => createAdminClientMock(),
}))

vi.mock("@/lib/env", () => ({
  getStripeWebhookSecrets: () => ["whsec_test"],
}))

vi.mock("@/lib/order-conversations", () => ({
  ensureOrderConversations: vi.fn(),
}))

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
}))

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
    checkout: {
      sessions: {
        listLineItems: vi.fn(),
      },
    },
  },
}))

beforeEach(() => {
  supabase = createSupabaseMock()
  vi.clearAllMocks()
})

describe("app/api/checkout/webhook idempotency", () => {
  it("upserts by stripe_payment_intent_id and avoids duplicate order_items", async () => {
    const { stripe } = await import("@/lib/stripe")
    const { POST } = await import("@/app/api/checkout/webhook/route")

    const session = {
      id: "cs_test_1",
      mode: "payment",
      amount_total: 10_00,
      payment_intent: "pi_test_1",
      client_reference_id: "buyer-1",
      metadata: {
        items_json: JSON.stringify([
          {
            id: "11111111-1111-4111-8111-111111111111",
            qty: 1,
            price: 10,
          },
        ]),
      },
      customer_details: null,
    }

    ;(stripe.webhooks.constructEvent as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      type: "checkout.session.completed",
      data: { object: session },
    })

    ;(stripe.checkout.sessions.listLineItems as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [{ id: "li_1" }],
    })

    const req1 = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "raw-body",
    })

    const res1 = await POST(req1)
    expect(res1.status).toBe(200)
    await res1.json()

    const req2 = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "raw-body",
    })

    const res2 = await POST(req2)
    expect(res2.status).toBe(200)
    await res2.json()

    // Order creation is idempotent via upsert with onConflict=stripe_payment_intent_id.
    expect(supabase.__calls.orders.upsert).toHaveLength(2)
    expect(supabase.__calls.orders.upsert[0]?.options).toEqual({ onConflict: "stripe_payment_intent_id" })

    // Order items should only be inserted once; the retry should detect existing items.
    expect(supabase.__calls.order_items.insert).toHaveLength(1)
  })

  it("skips database work when webhook signature verification fails", async () => {
    const { stripe } = await import("@/lib/stripe")
    const { POST } = await import("@/app/api/checkout/webhook/route")

    ;(stripe.webhooks.constructEvent as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("invalid signature")
    })

    const req = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "raw-body",
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    await res.json()

    expect(createAdminClientMock).not.toHaveBeenCalled()
    expect(supabase.__calls.orders.upsert).toHaveLength(0)
  })
})
