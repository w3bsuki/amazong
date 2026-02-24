import { describe, expect, it } from "vitest"
import { resolveLeafCategoryForListing } from "@/lib/sell/resolve-leaf-category"

type TestCategory = {
  id: string
  name: string
  slug: string
  parent_id: string | null
  display_order: number
}

function createSupabaseMock(categories: TestCategory[]) {
  return {
    from(table: string) {
      if (table !== "categories") {
        throw new Error(`Unexpected table: ${table}`)
      }

      let rows = [...categories]

      const builder = {
        select() {
          return builder
        },
        eq(field: keyof TestCategory, value: string | null) {
          rows = rows.filter((row) => row[field] === value)
          return builder
        },
        lt(field: keyof TestCategory, value: number) {
          rows = rows.filter((row) => {
            const current = row[field]
            return typeof current === "number" && current < value
          })
          return builder
        },
        order(field: keyof TestCategory, opts?: { ascending?: boolean }) {
          const ascending = opts?.ascending ?? true
          rows = [...rows].sort((a, b) => {
            const av = a[field]
            const bv = b[field]
            if (typeof av !== "number" || typeof bv !== "number") return 0
            return ascending ? av - bv : bv - av
          })
          return Promise.resolve({ data: rows, error: null })
        },
        maybeSingle() {
          return Promise.resolve({ data: rows[0] ?? null, error: null })
        },
      }

      return builder
    },
  }
}

describe("resolveLeafCategoryForListing", () => {
  const categories: TestCategory[] = [
    { id: "fashion", name: "Fashion", slug: "fashion", parent_id: null, display_order: 1 },
    { id: "mens", name: "Mens Fashion", slug: "fashion-mens", parent_id: "fashion", display_order: 1 },
    { id: "womens", name: "Womens Fashion", slug: "fashion-womens", parent_id: "fashion", display_order: 2 },
    { id: "mens-shirts", name: "T-Shirts", slug: "mens-tshirts", parent_id: "mens", display_order: 1 },
    { id: "mens-pants", name: "Pants", slug: "mens-pants", parent_id: "mens", display_order: 2 },
    { id: "womens-dresses", name: "Dresses", slug: "womens-dresses", parent_id: "womens", display_order: 1 },
  ]

  it("returns selected category when already a leaf", async () => {
    const supabase = createSupabaseMock(categories)

    const result = await resolveLeafCategoryForListing({
      // Resolver only needs a tiny subset of client methods, so this test uses a mock.
      supabase: supabase as never,
      selectedCategoryId: "mens-shirts",
      context: { title: "Basic cotton t-shirt" },
    })

    expect(result).toEqual({
      ok: true,
      categoryId: "mens-shirts",
      wasAutoResolved: false,
    })
  })

  it("auto-resolves non-leaf to best matching leaf", async () => {
    const supabase = createSupabaseMock(categories)

    const result = await resolveLeafCategoryForListing({
      supabase: supabase as never,
      selectedCategoryId: "fashion",
      context: {
        title: "Nike mens t-shirt",
        description: "short sleeve cotton tshirt",
      },
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.categoryId).toBe("mens-shirts")
    expect(result.wasAutoResolved).toBe(true)
  })

  it("rejects when category is non-leaf and context is too vague", async () => {
    const supabase = createSupabaseMock(categories)

    const result = await resolveLeafCategoryForListing({
      supabase: supabase as never,
      selectedCategoryId: "fashion",
      context: { title: "item", description: "" },
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toBe("LEAF_CATEGORY_REQUIRED")
  })

  it("returns CATEGORY_NOT_FOUND for invalid category id", async () => {
    const supabase = createSupabaseMock(categories)

    const result = await resolveLeafCategoryForListing({
      supabase: supabase as never,
      selectedCategoryId: "missing",
      context: { title: "whatever" },
    })

    expect(result).toEqual({
      ok: false,
      error: "CATEGORY_NOT_FOUND",
      message: "Selected category does not exist",
    })
  })
})
