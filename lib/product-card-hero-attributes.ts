/**
 * Product Card Hero Attributes Configuration
 * 
 * Defines which attributes to display as the "smart badge" on product cards
 * based on L0 category. This provides contextual relevance:
 * - Cars show Make + Model (e.g., "BMW 320d")
 * - Phones show Brand + Storage (e.g., "iPhone · 128GB")
 * - Clothing shows Brand + Size (e.g., "Nike · L")
 * 
 * Fallback: L1 category name, then L0 category name
 */

export interface HeroAttributeConfig {
  /** L0 category slug (root category) */
  categoryRootSlug: string
  /** Attribute keys to display, in order of priority */
  attributeKeys: string[]
  /** How to join multiple attributes */
  separator: string
  /** Optional prefix (e.g., icon or label) */
  prefix?: string
  /** Max combined length before truncation */
  maxLength: number
}

/**
 * Hero attribute configurations by L0 category
 * Order matters - first matching config wins
 */
export const HERO_ATTRIBUTE_CONFIGS: HeroAttributeConfig[] = [
  // Vehicles: Make + Model (e.g., "BMW 320d", "Audi e-tron")
  {
    categoryRootSlug: "vehicles",
    attributeKeys: ["make", "brand", "model"],
    separator: " ",
    maxLength: 18,
  },
  // Phones/Tablets: Brand + Storage (e.g., "iPhone · 128GB")
  {
    categoryRootSlug: "electronics",
    attributeKeys: ["brand", "storage", "model"],
    separator: " · ",
    maxLength: 16,
  },
  // Fashion Clothing: Brand + Size (e.g., "Nike · L", "Zara · M")
  {
    categoryRootSlug: "fashion",
    attributeKeys: ["brand", "size"],
    separator: " · ",
    maxLength: 14,
  },
  // Real Estate: Type + Area (e.g., "Apartment · 75m²")
  {
    categoryRootSlug: "real-estate",
    attributeKeys: ["property_type", "area"],
    separator: " · ",
    maxLength: 18,
  },
  // Home & Garden: Material (e.g., "Wood", "Metal")
  {
    categoryRootSlug: "home-garden",
    attributeKeys: ["material", "brand"],
    separator: " · ",
    maxLength: 14,
  },
  // Sports: Brand + Size
  {
    categoryRootSlug: "sports",
    attributeKeys: ["brand", "size"],
    separator: " · ",
    maxLength: 14,
  },
  // Books & Media: Author or Format
  {
    categoryRootSlug: "books-media",
    attributeKeys: ["author", "format"],
    separator: " · ",
    maxLength: 16,
  },
  // Collectibles: Brand or Era
  {
    categoryRootSlug: "collectibles",
    attributeKeys: ["brand", "era", "year"],
    separator: " · ",
    maxLength: 14,
  },
]

const FALLBACK_MAX_LENGTH = 16

function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) return label
  return label.slice(0, Math.max(0, maxLength - 1)) + "…"
}

function formatAttributeValue(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === "number") return value.toString()
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed ? trimmed : null
  }
  return null
}

/**
 * Get hero attribute config for a category
 */
export function getHeroAttributeConfig(
  categoryRootSlug?: string | null
): HeroAttributeConfig | null {
  if (!categoryRootSlug) return null
  
  const slug = categoryRootSlug.toLowerCase()
  return HERO_ATTRIBUTE_CONFIGS.find(
    (config) => slug.startsWith(config.categoryRootSlug) || slug.includes(config.categoryRootSlug)
  ) ?? null
}

/**
 * Build the hero badge text from product attributes
 * 
 * @param categoryRootSlug - L0 category slug
 * @param attributes - Product attributes object
 * @param categoryPath - Category breadcrumb path
 * @param locale - Current locale
 * @returns Badge text or null
 */
export function buildHeroBadgeText(
  categoryRootSlug: string | undefined | null,
  attributes: Record<string, unknown> | null | undefined,
  categoryPath: Array<{ slug: string; name: string; nameBg?: string | null }> | null | undefined,
  locale: string = "en"
): string | null {
  const config = getHeroAttributeConfig(categoryRootSlug)
  
  // Try to build from attributes if config exists
  if (config && attributes && typeof attributes === "object") {
    const parts: string[] = []
    
    for (const key of config.attributeKeys) {
      const value = formatAttributeValue(attributes[key])
      if (value) parts.push(value)
      // Stop after we have 2 meaningful parts
      if (parts.length >= 2) break
    }
    
    if (parts.length > 0) {
      const text = parts.join(config.separator)
      return truncateLabel(text, config.maxLength)
    }
  }
  
  // Fallback: L1 category name (or L0 if no L1)
  if (categoryPath && categoryPath.length > 0) {
    // Prefer L1 (index 1) if available, else L0 (index 0)
    const node = categoryPath.length > 1 ? categoryPath[1] : categoryPath[0]
    if (node) {
      const name = locale === "bg" && node.nameBg ? node.nameBg : node.name
      // Clean up hidden markers
      const clean = name.replace(/^\s*\[HIDDEN\]\s*/i, "").trim()
      if (clean) {
        return truncateLabel(clean, FALLBACK_MAX_LENGTH)
      }
    }
  }
  
  return null
}

/**
 * Determine if we should show the hero badge based on available data
 */
export function shouldShowHeroBadge(
  categoryRootSlug: string | undefined | null,
  attributes: Record<string, unknown> | null | undefined,
  categoryPath: Array<{ slug: string; name: string; nameBg?: string | null }> | null | undefined
): boolean {
  return buildHeroBadgeText(categoryRootSlug, attributes, categoryPath) !== null
}
