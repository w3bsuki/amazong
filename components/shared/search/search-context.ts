export interface SearchLaunchContext {
  categorySlug?: string | null
  source?: "contextual-header" | "global-header" | "overlay"
}

const SEARCH_PATH = "/search"
const CATEGORY_PARAM = "category"
const QUERY_PARAM = "q"

export function buildSearchHref({
  query,
  context,
}: {
  query?: string | null
  context?: SearchLaunchContext
} = {}): string {
  const params = new URLSearchParams()
  const trimmedQuery = query?.trim()

  if (trimmedQuery) {
    params.set(QUERY_PARAM, trimmedQuery)
  }

  const categorySlug = context?.categorySlug?.trim()
  if (categorySlug) {
    params.set(CATEGORY_PARAM, categorySlug)
  }

  const queryString = params.toString()
  return queryString ? `${SEARCH_PATH}?${queryString}` : SEARCH_PATH
}
