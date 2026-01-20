/**
 * Category type for CTA customization.
 * Affects button labels (Buy Now vs Contact Agent vs Test Drive).
 */
export type CategoryType = "default" | "automotive" | "real-estate"

/**
 * Get category type from category slugs.
 * Used to customize CTAs and UI elements per category.
 */
export function getCategoryType(
  categorySlug: string | null,
  parentSlug: string | null
): CategoryType {
  const slugs = [categorySlug, parentSlug].filter(Boolean) as string[]

  // Check for automotive-related categories
  if (
    slugs.some(
      (s) =>
        s.includes("auto") ||
        s.includes("car") ||
        s.includes("motor") ||
        s.includes("vehicle")
    )
  ) {
    return "automotive"
  }

  // Check for real estate
  if (
    slugs.some(
      (s) =>
        s.includes("real-estate") ||
        s.includes("property") ||
        s.includes("apartment") ||
        s.includes("house")
    )
  ) {
    return "real-estate"
  }

  return "default"
}
