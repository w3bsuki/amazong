import { beforeEach, describe, expect, it, vi } from "vitest"

type SupabaseQueryResult<T> = Promise<{ data: T; error: null } | { data: null; error: unknown }>

type SupabaseMock = {
  from: (table: string) => unknown
  __calls: {
    listing_boosts: { insert: unknown[] }
    products: { update: unknown[] }
  }
}

let supabase: SupabaseMock
const createAdminClientMock = vi.fn(() => supabase)

function createSupabaseMock(): SupabaseMock {
  const calls = {
    listing_boosts: { insert: [] as unknown[] },
    products: { update: [] as unknown[] },
  }

  let boostInsertCalls = 0

  const from = (table: string) => {
    if (table === "listing_boosts") {
      return {
        insert: (async (payload: unknown) => {
          calls.listing_boosts.insert.push(payload)
          boostInsertCalls += 1

          if (boostInsertCalls === 1) {
            return { error: null }
          }

          return { error: { code: "23505" } }
        }) as (payload: unknown) => SupabaseQueryResult<unknown>,
        select: () => ({
          eq: () => ({
            maybeSingle: (async () => ({
              data: { expires_at: "2000-01-01T00:00:00.000Z" },
              error: null,
            })) as SupabaseQueryResult<{ expires_at: string | null }>,
          }),
        }),
      }
    }

    if (table === "products") {
      return {
        update: (payload: unknown) => {
          calls.products.update.push(payload)
          return {
            eq: () => ({
              eq: (async () => ({ error: null })) as SupabaseQueryResult<unknown>,
            }),
          }
        },
      }
    }

    return {
      select: () => ({
        eq: (async () => ({ data: [], error: null })) as SupabaseQueryResult<unknown[]>,
      }),
      insert: (async () => ({ error: null })) as SupabaseQueryResult<unknown>,
      update: () => ({
        eq: () => ({
          eq: (async () => ({ error: null })) as SupabaseQueryResult<unknown>,
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

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
}))

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}))

beforeEach(() => {
  supabase = createSupabaseMock()
  vi.clearAllMocks()
})

describe("app/api/payments/webhook idempotency", () => {
  it("does not extend boost duration on replay", async () => {
    const { stripe } = await import("@/lib/stripe")
    const { POST } = await import("@/app/api/payments/webhook/route")

    const session = {
      id: "cs_boost_1",
      mode: "payment",
      amount_total: 10_00,
      currency: "eur",
      metadata: {
        type: "listing_boost",
        product_id: "11111111-1111-4111-8111-111111111111",
        profile_id: "seller-1",
        duration_days: "7",
      },
    }

    ;(stripe.webhooks.constructEvent as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      type: "checkout.session.completed",
      created: 1700000000,
      data: { object: session },
    })

    const makeReq = () =>
      new Request("http://localhost/api/payments/webhook", {
        method: "POST",
        headers: { "stripe-signature": "sig" },
        body: "raw-body",
      })

    const res1 = await POST(makeReq())
    expect(res1.status).toBe(200)
    await res1.json()

    const res2 = await POST(makeReq())
    expect(res2.status).toBe(200)
    await res2.json()

    expect(supabase.__calls.listing_boosts.insert).toHaveLength(2)
    expect(supabase.__calls.products.update).toHaveLength(2)

    const secondUpdate = supabase.__calls.products.update[1]
    expect(secondUpdate).toMatchObject({
      boost_expires_at: "2000-01-01T00:00:00.000Z",
    })
  })

  it("skips database work when webhook signature verification fails", async () => {
    const { stripe } = await import("@/lib/stripe")
    const { POST } = await import("@/app/api/payments/webhook/route")

    ;(stripe.webhooks.constructEvent as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("invalid signature")
    })

    const req = new Request("http://localhost/api/payments/webhook", {
      method: "POST",
      headers: { "stripe-signature": "sig" },
      body: "raw-body",
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    await res.json()

    expect(createAdminClientMock).not.toHaveBeenCalled()
    expect(supabase.__calls.listing_boosts.insert).toHaveLength(0)
  })
})
