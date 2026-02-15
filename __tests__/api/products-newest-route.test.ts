import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const createStaticClientMock = vi.fn()
const normalizeProductRowMock = vi.fn((row: unknown) => row)
const toUiMock = vi.fn((row: Record<string, unknown>) => ({
  id: String(row.id ?? "p1"),
  title: String(row.title ?? "Product"),
  price: Number(row.price ?? 100),
  image: "/placeholder.svg",
  rating: 4.5,
  reviews: 10,
}))

vi.mock("@/lib/supabase/server", () => ({
  createStaticClient: createStaticClientMock,
}))

vi.mock("@/lib/data/products", () => ({
  normalizeProductRow: normalizeProductRowMock,
  toUI: toUiMock,
}))

type ProductQueryCalls = {
  or: string[]
  filter: Array<[string, string, string]>
  range: Array<[number, number]>
}

function createSupabaseMock(options?: { categoryId?: string; totalCount?: number }) {
  const categoryId = options?.categoryId ?? "cat-fashion-id"
  const totalCount = options?.totalCount ?? 30

  const productCalls: ProductQueryCalls = {
    or: [],
    filter: [],
    range: [],
  }

  const productRows = [{ id: "p-1", title: "Item", price: 99 }]

  const productsQuery = {
    select: vi.fn(() => productsQuery),
    filter: vi.fn((column: string, operator: string, value: string) => {
      productCalls.filter.push([column, operator, value])
      return productsQuery
    }),
    or: vi.fn((expression: string) => {
      productCalls.or.push(expression)
      return productsQuery
    }),
    eq: vi.fn(() => productsQuery),
    gt: vi.fn(() => productsQuery),
    gte: vi.fn(() => productsQuery),
    lte: vi.fn(() => productsQuery),
    ilike: vi.fn(() => productsQuery),
    contains: vi.fn(() => productsQuery),
    in: vi.fn(() => productsQuery),
    order: vi.fn(() => productsQuery),
    range: vi.fn(async (from: number, to: number) => {
      productCalls.range.push([from, to])
      return { data: productRows, error: null, count: totalCount }
    }),
  }

  const categoriesQuery = {
    select: vi.fn(() => categoriesQuery),
    eq: vi.fn(() => categoriesQuery),
    limit: vi.fn(() => categoriesQuery),
    maybeSingle: vi.fn(async () => ({ data: { id: categoryId }, error: null })),
  }

  const supabase = {
    from: vi.fn((table: string) => {
      if (table === "products") return productsQuery
      if (table === "categories") return categoriesQuery
      throw new Error(`Unexpected table: ${table}`)
    }),
  }

  return { supabase, productCalls }
}

let GET: typeof import("@/app/api/products/newest/route").GET

beforeAll(async () => {
  ;({ GET } = await import("@/app/api/products/newest/route"))
})

beforeEach(() => {
  createStaticClientMock.mockReset()
  normalizeProductRowMock.mockClear()
  toUiMock.mockClear()
})

describe("GET /api/products/newest deals filters", () => {
  it("applies deals filter for non-category queries", async () => {
    const { supabase, productCalls } = createSupabaseMock()
    createStaticClientMock.mockReturnValue(supabase)

    const request = new NextRequest("https://treido.test/api/products/newest?deals=true&page=1&limit=24")
    const response = await GET(request)
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(payload.products)).toBe(true)
    expect(payload.products).toHaveLength(1)
    expect(productCalls.or).toContain("and(is_on_sale.eq.true,sale_percent.gt.0),list_price.not.is.null")
    expect(productCalls.range).toEqual([[0, 23]])
  })

  it("combines deals with category context and pagination", async () => {
    const { supabase, productCalls } = createSupabaseMock({ categoryId: "cat-123", totalCount: 50 })
    createStaticClientMock.mockReturnValue(supabase)

    const request = new NextRequest(
      "https://treido.test/api/products/newest?category=fashion&deals=true&page=2&limit=10"
    )
    const response = await GET(request)
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.products).toHaveLength(1)
    expect(productCalls.filter).toContainEqual(["category_ancestors", "cs", "{cat-123}"])
    expect(productCalls.or).toContain("and(is_on_sale.eq.true,sale_percent.gt.0),list_price.not.is.null")
    expect(productCalls.range).toEqual([[10, 19]])
  })
})
