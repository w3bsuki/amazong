/**
 * Category-Aware Badge Specs (Client-Safe)
 * 
 * Provides client-side badge utilities for determining which
 * attributes to show as badges on product cards.
 * 
 * For server-side cached functions, import from './category-badge-specs.server'
 * 
 * Examples:
 * - Fashion: condition + brand
 * - Electronics: condition + storage
 * - Vehicles: mileage + year (NOT condition)
 * - E-Bikes: range + motor power
 */

type BadgeItem = { key: string; label: string; value: string }

/**
 * Format condition string for display.
 * Converts "used-excellent" to "Used - Excellent" etc.
 */
function formatCondition(condition: string): string {
  return condition
    .replaceAll("-", " - ")
    .replaceAll("_", " ")
    .replaceAll(/\b\w/g, (c) => c.toUpperCase())
    .replace(" - ", "-") // Collapse double dash
    .replace("  ", " ") // Collapse double space
}

function isAutomotiveCategory(slug: string, rootSlug: string | null): boolean {
  return slug.includes("vehicle") || slug.includes("automotive") || 
         slug.includes("car") || rootSlug === "automotive"
}

function isEmobilityCategory(slug: string): boolean {
  return slug.includes("e-bike") || slug.includes("e-scooter") || 
         slug.includes("electric")
}

function isElectronicsCategory(slug: string, rootSlug: string | null): boolean {
  return slug.includes("electronic") || rootSlug === "electronics"
}

function isGamingCategory(slug: string, rootSlug: string | null): boolean {
  return slug.includes("gaming") || rootSlug === "gaming"
}

function isFashionCategory(slug: string, rootSlug: string | null): boolean {
  return slug.includes("fashion") || slug.includes("clothing") || 
         rootSlug === "fashion"
}

function buildAutomotiveBadges(attrs: Record<string, unknown>): BadgeItem[] {
  const badges: BadgeItem[] = []
  const mileage = attrs.mileage || attrs.mileage_km
  if (mileage) badges.push({ key: "mileage", label: "Mileage", value: `${mileage} km` })
  const year = attrs.year
  if (year) badges.push({ key: "year", label: "Year", value: String(year) })
  return badges.slice(0, 2)
}

function buildEmobilityBadges(attrs: Record<string, unknown>, slug: string): BadgeItem[] {
  const badges: BadgeItem[] = []
  const range = attrs.range
  if (range) badges.push({ key: "range", label: "Range", value: String(range) })
  const power = attrs.motor_power || attrs.max_speed
  if (power) {
    const label = slug.includes("scooter") ? "Speed" : "Power"
    badges.push({ key: "power", label, value: String(power) })
  }
  return badges.slice(0, 2)
}

function buildElectronicsBadges(attrs: Record<string, unknown>, condition: string | null): BadgeItem[] {
  const badges: BadgeItem[] = []
  if (condition) badges.push({ key: "condition", label: "Condition", value: formatCondition(condition) })
  const storage = attrs.storage_capacity || attrs.storage
  if (storage) badges.push({ key: "storage", label: "Storage", value: String(storage) })
  return badges.slice(0, 2)
}

function buildGamingBadges(attrs: Record<string, unknown>, condition: string | null): BadgeItem[] {
  const badges: BadgeItem[] = []
  const platform = attrs.platform
  if (platform) badges.push({ key: "platform", label: "Platform", value: String(platform) })
  if (condition) badges.push({ key: "condition", label: "Condition", value: formatCondition(condition) })
  return badges.slice(0, 2)
}

function buildFashionBadges(attrs: Record<string, unknown>, condition: string | null): BadgeItem[] {
  const badges: BadgeItem[] = []
  if (condition) badges.push({ key: "condition", label: "Condition", value: formatCondition(condition) })
  const brand = attrs.brand
  if (brand) badges.push({ key: "brand", label: "Brand", value: String(brand) })
  return badges.slice(0, 2)
}

/**
 * Client-side fallback: Compute badge specs from product data.
 * Uses L0 category slug to determine what to show.
 * 
 * This is a simplified version for client-side rendering when
 * the full RPC isn't available (e.g., product cards in feeds).
 */
export function computeBadgeSpecsClient(params: {
  categorySlug: string | null
  rootCategorySlug: string | null
  condition: string | null
  attributes: Record<string, unknown>
}): BadgeItem[] {
  const { categorySlug, rootCategorySlug, condition, attributes } = params
  const slug = categorySlug || rootCategorySlug || ""

  if (isAutomotiveCategory(slug, rootCategorySlug)) {
    return buildAutomotiveBadges(attributes)
  }
  if (isEmobilityCategory(slug)) {
    return buildEmobilityBadges(attributes, slug)
  }
  if (isElectronicsCategory(slug, rootCategorySlug)) {
    return buildElectronicsBadges(attributes, condition)
  }
  if (isGamingCategory(slug, rootCategorySlug)) {
    return buildGamingBadges(attributes, condition)
  }
  if (isFashionCategory(slug, rootCategorySlug)) {
    return buildFashionBadges(attributes, condition)
  }

  // Default: Just show condition if available
  if (condition) {
    return [{ key: "condition", label: "Condition", value: formatCondition(condition) }]
  }
  return []
}

/**
 * Determine if condition badge should be shown for a category.
 * Returns false for categories where condition is irrelevant (e.g., vehicles).
 */
export function shouldShowConditionBadge(
  categorySlug: string | null,
  rootCategorySlug: string | null
): boolean {
  const slug = categorySlug || rootCategorySlug || ""
  
  // Categories where condition is NOT relevant
  const noConditionCategories = [
    "automotive",
    "vehicles",
    "car",
    "motorcycle",
    "real-estate",
    "property",
    "services",
    "jobs",
    "e-mobility",
  ]
  
  return !noConditionCategories.some((cat) => 
    slug.includes(cat) || rootCategorySlug?.includes(cat)
  )
}
