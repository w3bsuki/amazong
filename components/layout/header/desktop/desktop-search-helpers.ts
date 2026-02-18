export function buildSearchHref(query: string): string {
  const trimmed = query.trim()
  if (!trimmed) return "/search"
  return `/search?q=${encodeURIComponent(trimmed)}`
}

export function buildProductUrl(product: {
  id: string
  slug?: string
  storeSlug?: string | null
}): string {
  if (!product.storeSlug) return "#"
  return `/${product.storeSlug}/${product.slug || product.id}`
}
