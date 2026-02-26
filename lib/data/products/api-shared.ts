import "server-only"

import { normalizeProductRow, toUI } from "@/lib/data/products"

export function buildUiProductPage(params: {
  data: unknown[] | null
  count: number | null
  offset: number
}): { products: ReturnType<typeof toUI>[]; totalCount: number; hasMore: boolean } {
  const { data, count, offset } = params

  const rows: unknown[] = Array.isArray(data) ? data : []

  const products = rows
    .filter((row) => {
      if (!row || typeof row !== "object") return false
      const r = row as Record<string, unknown>
      return typeof r.id === "string" && typeof r.title === "string" && typeof r.price === "number"
    })
    .map((row) => toUI(normalizeProductRow(row as Parameters<typeof normalizeProductRow>[0])))

  const totalCount = count ?? 0
  const hasMore = offset + products.length < totalCount

  return { products, totalCount, hasMore }
}

