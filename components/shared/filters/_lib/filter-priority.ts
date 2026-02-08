/**
 * Filter Priority Mapping
 *
 * Maps category roots to their priority filter attributes.
 * Used by desktop and shared filter surfaces for quick pills ordering.
 */

import type { CategoryAttribute } from "@/lib/data/categories"
import { getCategoryAttributeKey } from "@/lib/filters/category-attribute"

/** Priority filters for different category types */
export const FILTER_PRIORITY: Record<string, string[]> = {
    // Fashion: Size is most important, then brand/color
    fashion: ["size", "brand", "color", "condition"],
    clothing: ["size", "brand", "color", "condition"],
    shoes: ["size", "brand", "color", "condition"],
    accessories: ["brand", "color", "condition"],

    // Electronics: Brand and condition matter most
    electronics: ["brand", "condition", "price"],
    phones: ["brand", "condition", "price"],
    computers: ["brand", "condition", "price"],

    // Vehicles: Make/model are key
    automotive: ["make", "model", "price"],
    vehicles: ["make", "model", "price"],
    cars: ["make", "model", "price"],
    motorcycles: ["make", "model", "price"],

    // Home & Garden
    home: ["brand", "condition", "price"],
    garden: ["brand", "condition", "price"],
    furniture: ["condition", "price"],

    // Default fallback
    default: ["price", "category", "brand", "condition"],
}

/** Base filter types that are always available (non-attribute) */
export const BASE_FILTERS = ["price", "category"] as const

/** Default filters - guaranteed to exist */
const DEFAULT_FILTERS = FILTER_PRIORITY.default ?? ["price", "category", "brand", "condition"]

function uniqueKeys(values: string[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const value of values) {
    const key = value.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(value)
  }
  return out
}

function getHeroAttributeKeys(attributes: CategoryAttribute[]): string[] {
  return uniqueKeys(
    attributes
      .filter((attr) => attr.is_hero_spec && attr.is_filterable)
      .sort((a, b) => (a.hero_priority ?? 999) - (b.hero_priority ?? 999))
      .map((attr) => getCategoryAttributeKey(attr))
  )
}

/**
 * Get the priority filter pills for a given category slug.
 * Returns the relevant filters based on category type detection.
 */
export function getFilterPillsForCategory(
    categorySlug: string | null | undefined,
    attributes: CategoryAttribute[] = []
): string[] {
    const heroKeys = getHeroAttributeKeys(attributes)
    if (heroKeys.length > 0) {
        return uniqueKeys([...BASE_FILTERS, ...heroKeys])
    }

    if (!categorySlug) {
        return DEFAULT_FILTERS
    }

    const slug = categorySlug.toLowerCase()

    // Check for exact match first
    const exactMatch = FILTER_PRIORITY[slug]
    if (exactMatch) {
        return exactMatch
    }

    // Check if slug contains category type keywords
    for (const [key, filters] of Object.entries(FILTER_PRIORITY)) {
        if (key !== "default" && slug.includes(key)) {
            return filters
        }
    }

    return DEFAULT_FILTERS
}
