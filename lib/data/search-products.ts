import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"

type FilterQueryLike<T> = {
  gte: (column: string, value: number) => T
  lte: (column: string, value: number) => T
  contains: (
    column: string,
    value: string | readonly unknown[] | Record<string, unknown>
  ) => T
  gt: (column: string, value: unknown) => T
  in: (column: string, values: string[]) => T
}

type SortQueryLike<T> = {
  order: (column: string, options: { ascending: boolean; nullsFirst?: boolean }) => T
}

export interface SharedProductFilters {
  minPrice?: string | undefined
  maxPrice?: string | undefined
  tag?: string | undefined
  minRating?: string | undefined
  availability?: string | undefined
  sort?: string | undefined
  attributes?: Record<string, string | string[]> | undefined
}

export function applySharedProductFilters<T extends FilterQueryLike<T>>(query: T, filters: SharedProductFilters): T {
  let next = query

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

  return next
}

export function applySharedProductSort<T extends SortQueryLike<T>>(query: T, sort: string | undefined): T {
  const next = query

  switch (sort) {
    case "newest":
      return next.order("created_at", { ascending: false })
    case "price-asc":
      return next.order("price", { ascending: true })
    case "price-desc":
      return next.order("price", { ascending: false })
    case "rating":
      return next.order("rating", { ascending: false, nullsFirst: false })
    default:
      return next.order("rating", { ascending: false, nullsFirst: false })
  }
}
