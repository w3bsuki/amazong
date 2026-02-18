import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { BrowseModeSchema } from "./search-page-helpers"
import type { BrowseMode } from "./types"

interface SearchPageMetadataInput {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string; mode?: string }>
}

export async function generateSearchPageMetadata({
  params,
  searchParams,
}: SearchPageMetadataInput): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ""
  const category = resolvedSearchParams.category || ""
  const parsedMode = BrowseModeSchema.safeParse(resolvedSearchParams.mode)
  const mode: BrowseMode = parsedMode.success ? parsedMode.data : "listings"

  let title = "Search Results"
  if (mode === "sellers") {
    title = query ? `"${query}" - Seller Results` : "Browse Sellers"
  } else if (query) {
    title = `"${query}" - Search Results`
  } else if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} - Shop`
  }

  return {
    title,
    description:
      mode === "sellers"
        ? query
          ? `Browse top sellers for "${query}" on Treido.`
          : "Discover trusted sellers and browse their listings on Treido."
        : query
          ? `Find the best deals on "${query}" at Treido. Fast shipping and great prices.`
          : "Browse our wide selection of products. Find electronics, fashion, home goods and more.",
  }
}
