/**
 * Filter Priority Mapping
 *
 * Maps category roots to their priority filter attributes.
 * Used by QuickFilterRow to display relevant quick pills.
 */

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
const DEFAULT_FILTERS = FILTER_PRIORITY.default!

/**
 * Get the priority filter pills for a given category slug.
 * Returns the relevant filters based on category type detection.
 */
export function getFilterPillsForCategory(
    categorySlug: string | null | undefined
): string[] {
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

/**
 * Check if a filter is a base filter (price, category) vs an attribute filter.
 */
export function isBaseFilter(filterKey: string): boolean {
    return BASE_FILTERS.includes(filterKey as (typeof BASE_FILTERS)[number])
}

