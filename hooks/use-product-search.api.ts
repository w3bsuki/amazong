import { ProductSearchResponseSchema, type SearchProduct } from "./use-product-search.shared"

export async function fetchSearchProducts(
  normalizedQuery: string,
  maxResults: number,
  signal: AbortSignal
): Promise<SearchProduct[]> {
  const res = await fetch(
    `/api/products/search?q=${encodeURIComponent(normalizedQuery)}&limit=${maxResults}`,
    { signal }
  )

  if (!res.ok) {
    return []
  }

  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  const validated = ProductSearchResponseSchema.safeParse(data)
  return validated.success ? validated.data.products : []
}
