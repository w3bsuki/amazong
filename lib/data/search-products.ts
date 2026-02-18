import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"

type FilterQueryLike = {
  gte: (column: string, value: number) => FilterQueryLike
  lte: (column: string, value: number) => FilterQueryLike
  contains: (
    column: string,
    value: string | readonly unknown[] | Record<string, unknown>
  ) => FilterQueryLike
  gt: (column: string, value: unknown) => FilterQueryLike
  in: (column: string, values: readonly string[]) => FilterQueryLike
}

type SortQueryLike = {
  order: (column: string, options: { ascending: boolean; nullsFirst?: boolean }) => SortQueryLike
}

interface SharedProductFilters {
  minPrice?: string | undefined
  maxPrice?: string | undefined
  tag?: string | undefined
  minRating?: string | undefined
  availability?: string | undefined
  sort?: string | undefined
  attributes?: Record<string, string | string[]> | undefined
}

export function applySharedProductFilters<T>(query: T, filters: SharedProductFilters): T {
  let next = query as unknown as FilterQueryLike

  if (filters.minPrice) next = next.gte("price", Number(filters.minPrice))
  if (filters.maxPrice) next = next.lte("price", Number(filters.maxPrice))
  if (filters.tag) next = next.contains("tags", [filters.tag])
  if (filters.minRating) next = next.gte("rating", Number(filters.minRating))
  if (filters.availability === "instock") next = next.gt("stock", 0)

  if (filters.attributes) {
    for (const [rawAttrName, attrValue] of Object.entries(filters.attributes)) {
      if (!attrValue) continue

      const attrName = normalizeAttributeKey(rawAttrName) || rawAttrName

      if (Array.isArray(attrValue)) {
        const values = attrValue.filter((value): value is string => typeof value === "string" && value.length > 0)
        if (values.length === 1) {
          next = next.contains("attributes", { [attrName]: values[0] })
        } else if (values.length > 1) {
          next = next.in(`attributes->>${attrName}`, values)
        }
      } else if (typeof attrValue === "string" && attrValue.length > 0) {
        next = next.contains("attributes", { [attrName]: attrValue })
      }
    }
  }

  return next as unknown as T
}

export function applySharedProductSort<T>(query: T, sort: string | undefined): T {
  const next = query as unknown as SortQueryLike

  switch (sort) {
    case "newest":
      return next.order("created_at", { ascending: false }) as T
    case "price-asc":
      return next.order("price", { ascending: true }) as T
    case "price-desc":
      return next.order("price", { ascending: false }) as T
    case "rating":
      return next.order("rating", { ascending: false, nullsFirst: false }) as T
    default:
      return next.order("rating", { ascending: false, nullsFirst: false }) as T
  }
}
