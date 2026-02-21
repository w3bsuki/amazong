import type { CategoryAttribute } from "@/lib/data/categories"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import {
  getCategoryAttributeKey,
  getCategoryAttributeLabel,
} from "@/lib/filters/category-attribute"
import type { PendingFilters } from "../shared/state/use-pending-filters"
import type {
  AttrFilterSection,
  BaseFilterSection,
  FilterHubSubcategory,
  FilterSection,
} from "./types"

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

export function buildFilterSections({
  locale,
  t,
  tHub,
  visibleAttributes,
  subcategories,
}: {
  locale: string
  t: TranslateFn
  tHub: TranslateFn
  visibleAttributes: CategoryAttribute[]
  subcategories: FilterHubSubcategory[]
}): FilterSection[] {
  const sections: BaseFilterSection[] = []

  if (subcategories.length > 0) {
    sections.push({ id: "category", label: tHub("category") })
  }

  sections.push(
    { id: "rating", label: t("customerReviews") },
    { id: "price", label: t("price") },
    { id: "location", label: t("location") },
    { id: "availability", label: t("availability") }
  )

  const attrSections: AttrFilterSection[] = visibleAttributes.map((attr) => ({
    id: `attr_${attr.id}`,
    label: getCategoryAttributeLabel(attr, locale),
    attribute: attr,
  }))

  return [...sections, ...attrSections]
}

export function getSectionSelectedSummary({
  section,
  pending,
  pendingCategorySlug,
  subcategories,
  locale,
  t,
  tHub,
  getPendingAttrValues,
}: {
  section: FilterSection
  pending: PendingFilters
  pendingCategorySlug: string | null
  subcategories: FilterHubSubcategory[]
  locale: string
  t: TranslateFn
  tHub: TranslateFn
  getPendingAttrValues: (attrName: string) => string[]
}): string | null {
  if (section.id === "category") {
    if (!pendingCategorySlug) return null
    const subcat = subcategories.find((item) => item.slug === pendingCategorySlug)
    if (!subcat) return null
    return locale === "bg" && subcat.name_bg ? subcat.name_bg : subcat.name
  }

  if (section.id === "rating") {
    return pending.minRating ? `${pending.minRating}+ ${t("stars")}` : null
  }

  if (section.id === "price") {
    if (pending.minPrice && pending.maxPrice) {
      return `$${pending.minPrice} - $${pending.maxPrice}`
    }
    if (pending.minPrice) return `$${pending.minPrice}+`
    if (pending.maxPrice) return `${t("under")} $${pending.maxPrice}`
    return null
  }

  if (section.id === "availability") {
    return pending.availability === "instock" ? t("inStock") : null
  }

  if (section.id === "location") {
    const parts: string[] = []
    if (pending.city) {
      const cityData = BULGARIAN_CITIES.find((city) => city.value === pending.city)
      if (cityData) {
        parts.push(locale === "bg" ? cityData.labelBg : cityData.label)
      }
    }
    if (pending.nearby === "true") {
      parts.push(t("nearMe"))
    }
    return parts.length > 0 ? parts.join(", ") : null
  }

  if ("attribute" in section && section.attribute) {
    const values = getPendingAttrValues(getCategoryAttributeKey(section.attribute))
    if (values.length === 0) return null
    if (values.length === 1) return values[0] ?? null
    return `${values.length} ${tHub("selected")}`
  }

  return null
}

export function buildFilterApplyResult({
  searchParams,
  pending,
  resolvedBasePath,
  pendingCategorySlug,
}: {
  searchParams: URLSearchParams
  pending: PendingFilters
  resolvedBasePath: string
  pendingCategorySlug: string | null
}) {
  const params = new URLSearchParams(searchParams.toString())

  params.delete("minPrice")
  params.delete("maxPrice")
  params.delete("minRating")
  params.delete("availability")
  params.delete("deals")
  params.delete("verified")
  params.delete("city")
  params.delete("nearby")
  params.delete("page")

  const attrKeysToDelete: string[] = []
  for (const key of params.keys()) {
    if (key.startsWith("attr_")) attrKeysToDelete.push(key)
  }
  for (const key of attrKeysToDelete) {
    params.delete(key)
  }

  if (pending.minPrice) params.set("minPrice", pending.minPrice)
  if (pending.maxPrice) params.set("maxPrice", pending.maxPrice)
  if (pending.minRating) params.set("minRating", pending.minRating)
  if (pending.availability) params.set("availability", pending.availability)
  if (pending.deals) params.set("deals", pending.deals)
  if (pending.verified) params.set("verified", pending.verified)
  if (pending.city) params.set("city", pending.city)
  if (pending.nearby) params.set("nearby", pending.nearby)

  for (const [attrName, values] of Object.entries(pending.attributes)) {
    for (const value of values) {
      if (value) params.append(`attr_${attrName}`, value)
    }
  }

  const isCategoriesSurface =
    resolvedBasePath === "/categories" || resolvedBasePath.startsWith("/categories/")

  if (isCategoriesSurface) {
    const finalPath = pendingCategorySlug ? `/categories/${pendingCategorySlug}` : resolvedBasePath
    return { finalPath, queryString: params.toString() }
  }

  if (pendingCategorySlug) {
    params.set("category", pendingCategorySlug)
  }

  return { finalPath: resolvedBasePath, queryString: params.toString() }
}
