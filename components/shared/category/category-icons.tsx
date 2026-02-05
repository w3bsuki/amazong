/**
 * Category Icons
 *
 * Shared icon mappings for category navigation components.
 * Extracted to avoid duplication across multiple category UIs.
 */

import * as React from "react"
import {
  Monitor,
  Laptop,
  House,
  ShoppingBag,
  GameController,
  TShirt,
  Baby,
  Heart,
  Wrench,
  Car,
  Gift,
  BookOpen,
  Barbell,
  Dog,
  Lightbulb,
  DeviceMobile,
  DeviceTablet,
  Watch,
  Headphones,
  Camera,
  Television,
  MusicNotes,
  Briefcase,
  ForkKnife,
  Leaf,
  Code,
  ShoppingCart,
  Diamond,
  Palette,
  Pill,
  GraduationCap,
  Guitar,
  FilmStrip,
  Flask,
  Trophy,
  Hammer,
  Flower,
  PaintBrush,
  Package,
  Buildings,
  Ticket,
  Storefront,
  Tag,
  Truck,
  Flag,
  DesktopTower,
  Lightning,
  Plant,
  Cpu,
  User,
  UserCircle,
  Users,
  GenderMale,
  GenderFemale,
  GenderIntersex,
  Sneaker,
  Dress,
  Hoodie,
  Pants,
  Boot,
  Handbag,
  Armchair,
  Bed,
  Bathtub,
  CookingPot,
  Knife,
  Lamp,
  CoatHanger,
  Bicycle,
  Basketball,
  Football,
  SoccerBall,
  TennisBall,
  Wine,
  CoffeeBean,
  Carrot,
  SquaresFour,
} from "@phosphor-icons/react/ssr"

type PhosphorIcon = typeof Monitor

// Component-level icon mapping used by card/circle UIs.
// Returns the icon component so callers can control size/weight/className.
const categoryIconComponents: Record<string, PhosphorIcon> = {
  // Navigation / Meta
  all: SquaresFour,
  categories: SquaresFour,

  // Electronics & Computers
  electronics: Monitor,
  computers: Laptop,
  laptop: Laptop,
  laptops: Laptop,
  notebook: Laptop,
  notebooks: Laptop,
  tablet: DeviceTablet,
  tablets: DeviceTablet,
  monitor: Monitor,
  monitors: Monitor,
  desktop: DesktopTower,
  desktops: DesktopTower,
  "desktop-computer": DesktopTower,
  "desktop-computers": DesktopTower,
  "desktop-pc": DesktopTower,
  "desktop-pcs": DesktopTower,
  pc: DesktopTower,
  pcs: DesktopTower,
  "smart-home": Lightbulb,
  phones: DeviceMobile,
  smartphone: DeviceMobile,
  smartphones: DeviceMobile,
  tv: Television,
  audio: Headphones,
  cameras: Camera,
  software: Code,
  "software-services": Code,

  // Fashion & Accessories
  fashion: TShirt,
  "jewelry-watches": Diamond,
  watches: Watch,
  // Fashion subcategories (gender) - match actual DB slugs
  "fashion-mens": GenderMale,
  "fashion-womens": GenderFemale,
  "fashion-kids": Baby,
  "fashion-unisex": Users,
  // Alternative slug patterns
  men: GenderMale,
  mens: GenderMale,
  "men-fashion": GenderMale,
  "mens-fashion": GenderMale,
  women: GenderFemale,
  womens: GenderFemale,
  "women-fashion": GenderFemale,
  "womens-fashion": GenderFemale,
  kids: Baby,
  children: Baby,
  "kids-fashion": Baby,
  "childrens-fashion": Baby,
  unisex: Users,
  "unisex-fashion": Users,
  // Fashion items
  shoes: Sneaker,
  sneakers: Sneaker,
  boots: Boot,
  dresses: Dress,
  shirts: TShirt,
  pants: Pants,
  coats: Hoodie,
  jackets: Hoodie,
  bags: Handbag,
  handbags: Handbag,
  accessories: CoatHanger,

  // Home & Living
  home: House,
  "home-kitchen": ForkKnife,
  garden: Leaf,
  "garden-outdoor": Flower,
  tools: Wrench,
  "tools-home": Hammer,
  lighting: Lightbulb,
  "real-estate": Buildings,

  // Sports & Gaming
  gaming: GameController,
  sports: Barbell,
  "sports-outdoors": Barbell,

  // Health & Beauty
  beauty: PaintBrush,
  health: Heart,
  "health-wellness": Pill,
  "cbd-wellness": Leaf,

  // Family & Pets
  baby: Baby,
  "baby-kids": Baby,
  pets: Dog,
  "pet-supplies": Dog,
  toys: Gift,

  // Media & Entertainment
  books: BookOpen,
  music: MusicNotes,
  "musical-instruments": Guitar,
  "movies-music": FilmStrip,

  // Business & Office
  office: Briefcase,
  "office-school": GraduationCap,
  "industrial-scientific": Flask,
  services: Briefcase,

  // Shopping & Deals
  grocery: ShoppingCart,
  handmade: Palette,
  collectibles: Trophy,
  "gift-cards": Gift,
  tickets: Ticket,

  // Automotive & Transport
  automotive: Car,
  "e-mobility": Lightning,
  wholesale: Truck,

  // Regional & Special
  "bulgarian-traditional": Flag,
  hobbies: Guitar,

  // Default fallback
  default: Package,
}

function getCategoryIconForSlug(slug: string): PhosphorIcon {
  const slugKey = slug.toLowerCase()
  const direct = categoryIconComponents[slugKey]
  if (direct) return direct

  let best: { key: string; icon: PhosphorIcon } | null = null
  for (const [key, icon] of Object.entries(categoryIconComponents)) {
    if (key === "default") continue
    if (slugKey.includes(key) || key.includes(slugKey)) {
      if (!best || key.length > best.key.length) best = { key, icon }
    }
  }

  return best?.icon ?? categoryIconComponents.default ?? Package
}

export type IconSize = 14 | 16 | 18 | 20 | 24 | 26 | 28 | 32 | 36 | 40

interface CategoryIconOptions {
  size?: IconSize
  className?: string
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
}

/**
 * Get the appropriate icon for a category slug
 */
export function getCategoryIcon(slug: string, options: CategoryIconOptions = {}): React.ReactNode {
  const { size = 20, className = "", weight = "bold" } = options

  const Icon = getCategoryIconForSlug(slug)
  return <Icon size={size} weight={weight} className={className} />
}

// ============================================================================
// CATEGORY COLORS - Semantic tokens
// ============================================================================

export type CategoryColorScheme = {
  bg: string // Background color class
  text: string // Icon/text color class
  ring: string // Active ring color class
}

const categoryColors = {
  // All categories use semantic neutral tokens; the visual distinction comes from icons, not colors.
  all: { bg: "bg-surface-subtle", text: "text-foreground", ring: "ring-ring" },
  default: { bg: "bg-surface-subtle", text: "text-foreground", ring: "ring-ring" },
} satisfies Record<"all" | "default", CategoryColorScheme>

/**
 * Get the color scheme for a category slug.
 */
export function getCategoryColor(slug: string): CategoryColorScheme {
  if (slug === "all") return categoryColors.all
  return categoryColors.default
}
