import { beforeAll, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/stripe", () => ({ stripe: {} }))
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }))

let calculateTransactionFees: typeof import("@/lib/stripe-connect").calculateTransactionFees

beforeAll(async () => {
  ;({ calculateTransactionFees } = await import("@/lib/stripe-connect"))
})

describe("lib/stripe-connect.calculateTransactionFees", () => {
  it("computes buyer protection fee + totals for personal tier (0% seller fee)", () => {
    const fees = {
      sellerFeePercent: 0,
      buyerProtectionPercent: 3,
      buyerProtectionFixed: 0.5,
      buyerProtectionCap: 10,
    }

    expect(calculateTransactionFees(100, fees)).toEqual({
      sellerFee: 0,
      buyerProtectionFee: 3.5,
      sellerReceives: 100,
      buyerPays: 103.5,
      platformRevenue: 3.5,
    })
  })

  it("computes fees for business tier (non-zero seller fee)", () => {
    const fees = {
      sellerFeePercent: 1.5,
      buyerProtectionPercent: 2,
      buyerProtectionFixed: 0.3,
      buyerProtectionCap: 5,
    }

    expect(calculateTransactionFees(50, fees)).toEqual({
      sellerFee: 0.75,
      buyerProtectionFee: 1.3,
      sellerReceives: 49.25,
      buyerPays: 51.3,
      platformRevenue: 2.05,
    })
  })

  it("caps buyer protection fee at buyerProtectionCap", () => {
    const fees = {
      sellerFeePercent: 0,
      buyerProtectionPercent: 4,
      buyerProtectionFixed: 1,
      buyerProtectionCap: 5,
    }

    expect(calculateTransactionFees(200, fees)).toEqual({
      sellerFee: 0,
      buyerProtectionFee: 5,
      sellerReceives: 200,
      buyerPays: 205,
      platformRevenue: 5,
    })
  })

  it("rounds to 2 decimals consistently", () => {
    const fees = {
      sellerFeePercent: 0.5,
      buyerProtectionPercent: 3,
      buyerProtectionFixed: 0.3,
      buyerProtectionCap: 10,
    }

    expect(calculateTransactionFees(0.99, fees)).toEqual({
      sellerFee: 0,
      buyerProtectionFee: 0.33,
      sellerReceives: 0.99,
      buyerPays: 1.32,
      platformRevenue: 0.33,
    })
  })
})

