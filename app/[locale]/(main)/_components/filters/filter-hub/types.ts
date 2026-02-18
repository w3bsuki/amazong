import type { ReadonlyURLSearchParams } from "next/navigation"

import type { CategoryAttribute } from "@/lib/data/categories"

/** Subcategory for L2+ drill-down in Filter Hub */
export interface FilterHubSubcategory {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon?: string | null
}

/** Mode: "full" = normal list view, "single" = one section only (for quick pills) */
export type FilterHubMode = "full" | "single"

/** Section identifiers for initialSection prop */
export type FilterHubSection =
  | "category"
  | "rating"
  | "price"
  | "location"
  | "availability"
  | `attr_${string}`

export interface FilterHubProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
  resultsCount?: number
  categorySlug?: string | undefined
  categoryId?: string | undefined
  searchQuery?: string | undefined
  attributes?: CategoryAttribute[]
  basePath?: string | undefined
  subcategories?: FilterHubSubcategory[]
  categoryName?: string
  appliedSearchParams?: URLSearchParams | ReadonlyURLSearchParams | undefined
  onApply?: (next: {
    queryString: string
    finalPath: string
    pendingCategorySlug?: string | null
  }) => void
  mode?: FilterHubMode
  initialSection?: FilterHubSection | null
}

export type BaseFilterSection = {
  id: string
  label: string
  attribute?: undefined
}

export type AttrFilterSection = {
  id: string
  label: string
  attribute: CategoryAttribute
}

export type FilterSection = BaseFilterSection | AttrFilterSection
