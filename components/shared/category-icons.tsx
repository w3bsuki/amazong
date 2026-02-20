/**
 * Category Icons — React icon rendering for category slugs.
 *
 * Color/tone utilities live in `lib/category-colors.ts` (pure, no React).
 * This file provides the React-based `getCategoryIcon()` renderer
 * that maps slugs to Lucide icons.
 *
 * Importable from any route group or component directory.
 */

import * as React from "react"
import {
  Baby,
  Dumbbell as Barbell,
  BookOpen,
  Footprints as Boot,
  Briefcase,
  Building2 as Buildings,
  Camera,
  Car,
  Shirt as CoatHanger,
  Code,
  Computer as DesktopTower,
  Smartphone as DeviceMobile,
  Tablet as DeviceTablet,
  Diamond,
  Dog,
  Shirt as Dress,
  Film as FilmStrip,
  Flag,
  FlaskConical as Flask,
  Flower,
  Utensils as ForkKnife,
  Gamepad2 as GameController,
  Venus as GenderFemale,
  Mars as GenderMale,
  Gift,
  GraduationCap,
  Guitar,
  Hammer,
  Handbag,
  Headphones,
  Heart,
  Shirt as Hoodie,
  House,
  Laptop,
  Leaf,
  Lightbulb,
  Zap as Lightning,
  Monitor,
  Music as MusicNotes,
  Package,
  Brush as PaintBrush,
  Palette,
  Shirt as Pants,
  Pill,
  ShoppingCart,
  Shirt as Sneaker,
  LayoutGrid as SquaresFour,
  Tv as Television,
  Ticket,
  Trophy,
  Truck,
  Shirt as TShirt,
  Users,
  Watch,
  Wrench,
} from "lucide-react"

type LucideIcon = typeof Monitor

// ---------------------------------------------------------------------------
// Slug → icon mapping
// ---------------------------------------------------------------------------

const categoryIconComponents: Record<string, LucideIcon> = {
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
  "fashion-mens": GenderMale,
  "fashion-womens": GenderFemale,
  "fashion-kids": Baby,
  "fashion-unisex": Users,
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

// ---------------------------------------------------------------------------
// Slug → icon resolver (fuzzy match)
// ---------------------------------------------------------------------------

function getCategoryIconForSlug(slug: string): LucideIcon {
  const slugKey = slug.toLowerCase()
  const direct = categoryIconComponents[slugKey]
  if (direct) return direct

  let best: { key: string; icon: LucideIcon } | null = null
  for (const [key, icon] of Object.entries(categoryIconComponents)) {
    if (key === "default") continue
    if (
      (slugKey.includes(key) || key.includes(slugKey)) &&
      (!best || key.length > best.key.length)
    ) {
      best = { key, icon }
    }
  }

  return best?.icon ?? categoryIconComponents.default ?? Package
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type IconSize = 14 | 16 | 18 | 20 | 24 | 26 | 28 | 32 | 36 | 40

interface CategoryIconOptions {
  size?: IconSize
  className?: string
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
}

/**
 * Get the appropriate Lucide icon element for a category slug.
 */
export function getCategoryIcon(
  slug: string,
  options: CategoryIconOptions = {},
): React.ReactNode {
  const { size = 20, className = "" } = options
  const Icon = getCategoryIconForSlug(slug)
  return <Icon size={size} className={className} />
}
