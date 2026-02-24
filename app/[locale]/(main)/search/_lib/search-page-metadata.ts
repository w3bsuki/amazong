import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BrowseModeSchema } from "./search-page-helpers"
import type { BrowseMode } from "./types"

interface SearchPageMetadataInput {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string; mode?: string }>
}

function toCategoryLabel(category: string): string {
  return category
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

export async function generateSearchPageMetadata({
  params,
  searchParams,
}: SearchPageMetadataInput): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "SearchFilters" })
  const resolvedSearchParams = await searchParams
  const query = (resolvedSearchParams.q || "").trim()
  const category = (resolvedSearchParams.category || "").trim()
  const parsedMode = BrowseModeSchema.safeParse(resolvedSearchParams.mode)
  const mode: BrowseMode = parsedMode.success ? parsedMode.data : "listings"

  let title = t("searchResults")
  let description = t("browseAllProducts")

  if (mode === "sellers") {
    const sellersLabel = t("sellersMode")
    title = query ? `${t("resultsFor")} "${query}" · ${sellersLabel}` : sellersLabel
    description = query
      ? `${sellersLabel} — ${t("resultsFor")} "${query}".`
      : `${sellersLabel} — ${t("browseAllProducts")}.`
  } else if (query) {
    title = `${t("resultsFor")} "${query}"`
    description = `${t("searchResults")} — ${t("resultsFor")} "${query}".`
  } else if (category) {
    const categoryLabel = toCategoryLabel(category)
    title = `${categoryLabel} · ${t("searchResults")}`
    description = `${t("searchResults")} · ${categoryLabel}.`
  }

  return { title, description }
}
