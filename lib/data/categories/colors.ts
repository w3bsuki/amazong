/**
 * Category Colors — Pure utility (no React dependency).
 *
 * Tone resolution and color scheme mappings for category UIs.
 * Can be imported from lib/, components/, and any route group.
 */

// ============================================================================
// Types
// ============================================================================

export type CategoryColorScheme = {
  bg: string // Background color class
  text: string // Icon/text color class
  ring: string // Active ring color class
  hoverRing: string // Hover ring color class
  indicator: string // Tab underline / active indicator background class
}

export type CategoryTone =
  | "all"
  | "tech"
  | "fashion"
  | "home"
  | "sports"
  | "gaming"
  | "beauty"
  | "family"
  | "media"
  | "business"
  | "lifestyle"
  | "auto"

// ============================================================================
// Tone resolution
// ============================================================================

const categoryToneRules: Array<{ tone: Exclude<CategoryTone, "all">; keys: string[] }> = [
  {
    tone: "tech",
    keys: [
      "electronic",
      "computer",
      "laptop",
      "phone",
      "tablet",
      "monitor",
      "desktop",
      "software",
      "smart-home",
      "camera",
      "audio",
      "tv",
    ],
  },
  {
    tone: "fashion",
    keys: ["fashion", "jewelry", "watch", "shoe", "sneaker", "dress", "shirt", "pant", "coat", "jacket", "bag", "accessor"],
  },
  {
    tone: "home",
    keys: ["home", "kitchen", "garden", "lighting", "tool", "furniture", "real-estate", "property"],
  },
  {
    tone: "sports",
    keys: ["sport", "outdoor", "fitness", "barbell", "bicycle", "football", "basketball", "tennis"],
  },
  {
    tone: "gaming",
    keys: ["gaming", "console", "playstation", "xbox", "nintendo"],
  },
  {
    tone: "beauty",
    keys: ["beauty", "health", "wellness", "cbd", "cosmetic", "makeup", "skincare"],
  },
  {
    tone: "family",
    keys: ["baby", "kid", "children", "pet", "toy", "parent"],
  },
  {
    tone: "media",
    keys: ["book", "music", "movie", "film", "instrument", "hobb", "collectible"],
  },
  {
    tone: "lifestyle",
    keys: ["grocery", "handmade", "gift", "ticket", "food", "coffee", "wine"],
  },
  {
    tone: "auto",
    keys: ["automotive", "vehicle", "car", "motor", "e-mobility", "scooter", "wholesale", "truck"],
  },
  {
    tone: "business",
    keys: ["office", "services", "industrial", "scientific", "graduation", "school", "business"],
  },
]

// ============================================================================
// Color definitions
// ============================================================================

const categoryColors = {
  all: {
    bg: "bg-surface-subtle",
    text: "text-foreground",
    ring: "ring-category-ring",
    hoverRing: "group-hover:ring-category-ring",
    indicator: "bg-primary",
  },
  tech: {
    bg: "bg-category-tech-bg",
    text: "text-category-tech-fg",
    ring: "ring-category-tech-ring",
    hoverRing: "group-hover:ring-category-tech-ring",
    indicator: "bg-category-tech-fg",
  },
  fashion: {
    bg: "bg-category-fashion-bg",
    text: "text-category-fashion-fg",
    ring: "ring-category-fashion-ring",
    hoverRing: "group-hover:ring-category-fashion-ring",
    indicator: "bg-category-fashion-fg",
  },
  home: {
    bg: "bg-category-home-bg",
    text: "text-category-home-fg",
    ring: "ring-category-home-ring",
    hoverRing: "group-hover:ring-category-home-ring",
    indicator: "bg-category-home-fg",
  },
  sports: {
    bg: "bg-category-sports-bg",
    text: "text-category-sports-fg",
    ring: "ring-category-sports-ring",
    hoverRing: "group-hover:ring-category-sports-ring",
    indicator: "bg-category-sports-fg",
  },
  gaming: {
    bg: "bg-category-gaming-bg",
    text: "text-category-gaming-fg",
    ring: "ring-category-gaming-ring",
    hoverRing: "group-hover:ring-category-gaming-ring",
    indicator: "bg-category-gaming-fg",
  },
  beauty: {
    bg: "bg-category-beauty-bg",
    text: "text-category-beauty-fg",
    ring: "ring-category-beauty-ring",
    hoverRing: "group-hover:ring-category-beauty-ring",
    indicator: "bg-category-beauty-fg",
  },
  family: {
    bg: "bg-category-family-bg",
    text: "text-category-family-fg",
    ring: "ring-category-family-ring",
    hoverRing: "group-hover:ring-category-family-ring",
    indicator: "bg-category-family-fg",
  },
  media: {
    bg: "bg-category-media-bg",
    text: "text-category-media-fg",
    ring: "ring-category-media-ring",
    hoverRing: "group-hover:ring-category-media-ring",
    indicator: "bg-category-media-fg",
  },
  business: {
    bg: "bg-category-business-bg",
    text: "text-category-business-fg",
    ring: "ring-category-business-ring",
    hoverRing: "group-hover:ring-category-business-ring",
    indicator: "bg-category-business-fg",
  },
  lifestyle: {
    bg: "bg-category-lifestyle-bg",
    text: "text-category-lifestyle-fg",
    ring: "ring-category-lifestyle-ring",
    hoverRing: "group-hover:ring-category-lifestyle-ring",
    indicator: "bg-category-lifestyle-fg",
  },
  auto: {
    bg: "bg-category-auto-bg",
    text: "text-category-auto-fg",
    ring: "ring-category-auto-ring",
    hoverRing: "group-hover:ring-category-auto-ring",
    indicator: "bg-category-auto-fg",
  },
} satisfies Record<CategoryTone, CategoryColorScheme>

// ============================================================================
// Exports
// ============================================================================

export function resolveCategoryTone(slug: string): CategoryTone {
  const slugKey = slug.toLowerCase()
  if (slugKey === "all" || slugKey === "categories") return "all"

  for (const rule of categoryToneRules) {
    if (rule.keys.some((key) => slugKey.includes(key))) {
      return rule.tone
    }
  }

  return "business"
}

/**
 * Get the color scheme for a category slug.
 */
export function getCategoryColor(slug: string): CategoryColorScheme {
  return categoryColors[resolveCategoryTone(slug)]
}

