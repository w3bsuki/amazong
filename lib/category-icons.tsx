/**
 * Category Icons
 * 
 * Shared icon mappings for category navigation components.
 * Extracted from category-subheader.tsx and mega-menu.tsx to avoid duplication.
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
  Desktop,
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
  SquaresFour
} from "@phosphor-icons/react/ssr"

type PhosphorIcon = typeof Monitor

// Component-level icon mapping used by card/circle UIs.
// Returns the icon component so callers can control size/weight/className.
const categoryIconComponents: Record<string, PhosphorIcon> = {
  // Electronics & Computers
  electronics: Monitor,
  computers: Laptop,
  "smart-home": Lightbulb,
  phones: DeviceMobile,
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
  const direct = categoryIconComponents[slug]
  if (direct) return direct

  const slugLower = slug.toLowerCase()
  for (const [key, icon] of Object.entries(categoryIconComponents)) {
    if (key === "default") continue
    if (slugLower.includes(key) || key.includes(slugLower)) return icon
  }

  return categoryIconComponents.default ?? Package
}

export type IconSize = 16 | 20 | 24 | 26 | 28 | 32

interface CategoryIconOptions {
  size?: IconSize
  className?: string
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
}

/**
 * Get the appropriate icon for a category slug
 * @param slug - The category slug
 * @param options - Icon rendering options
 */
export function getCategoryIcon(
  slug: string,
  options: CategoryIconOptions = {}
): React.ReactNode {
  const { size = 20, className = "", weight = "regular" } = options

  const iconProps = { size, weight, className }

  const iconMap: Record<string, React.ReactNode> = {
    // Electronics & Computers
    "electronics": <Monitor {...iconProps} />,
    "computers": <Laptop {...iconProps} />,
    "smart-home": <Lightbulb {...iconProps} />,
    "phones": <DeviceMobile {...iconProps} />,
    "tv": <Television {...iconProps} />,
    "audio": <Headphones {...iconProps} />,
    "cameras": <Camera {...iconProps} />,
    "software": <Code {...iconProps} />,
    "software-services": <Code {...iconProps} />,

    // Fashion & Accessories
    "fashion": <TShirt {...iconProps} />,
    "jewelry-watches": <Diamond {...iconProps} />,
    "watches": <Watch {...iconProps} />,
    // Fashion subcategories (gender) - match actual DB slugs
    "fashion-mens": <GenderMale {...iconProps} />,
    "fashion-womens": <GenderFemale {...iconProps} />,
    "fashion-kids": <Baby {...iconProps} />,
    "fashion-unisex": <Users {...iconProps} />,
    // Alternative slug patterns
    "men": <GenderMale {...iconProps} />,
    "mens": <GenderMale {...iconProps} />,
    "men-fashion": <GenderMale {...iconProps} />,
    "mens-fashion": <GenderMale {...iconProps} />,
    "women": <GenderFemale {...iconProps} />,
    "womens": <GenderFemale {...iconProps} />,
    "women-fashion": <GenderFemale {...iconProps} />,
    "womens-fashion": <GenderFemale {...iconProps} />,
    "kids": <Baby {...iconProps} />,
    "children": <Baby {...iconProps} />,
    "kids-fashion": <Baby {...iconProps} />,
    "childrens-fashion": <Baby {...iconProps} />,
    "unisex": <Users {...iconProps} />,
    "unisex-fashion": <Users {...iconProps} />,
    // Fashion items
    "shoes": <Sneaker {...iconProps} />,
    "sneakers": <Sneaker {...iconProps} />,
    "boots": <Boot {...iconProps} />,
    "dresses": <Dress {...iconProps} />,
    "shirts": <TShirt {...iconProps} />,
    "pants": <Pants {...iconProps} />,
    "coats": <Hoodie {...iconProps} />,
    "jackets": <Hoodie {...iconProps} />,
    "bags": <Handbag {...iconProps} />,
    "handbags": <Handbag {...iconProps} />,
    "accessories": <CoatHanger {...iconProps} />,

    // Home & Living
    "home": <House {...iconProps} />,
    "home-kitchen": <ForkKnife {...iconProps} />,
    "garden": <Leaf {...iconProps} />,
    "garden-outdoor": <Flower {...iconProps} />,
    "tools": <Wrench {...iconProps} />,
    "tools-home": <Hammer {...iconProps} />,
    "lighting": <Lightbulb {...iconProps} />,
    "real-estate": <Buildings {...iconProps} />,

    // Sports & Gaming
    "gaming": <GameController {...iconProps} />,
    "sports": <Barbell {...iconProps} />,
    "sports-outdoors": <Barbell {...iconProps} />,

    // Health & Beauty
    "beauty": <PaintBrush {...iconProps} />,
    "health": <Heart {...iconProps} />,
    "health-wellness": <Pill {...iconProps} />,
    "cbd-wellness": <Leaf {...iconProps} />,

    // Family & Pets
    "baby": <Baby {...iconProps} />,
    "baby-kids": <Baby {...iconProps} />,
    "pets": <Dog {...iconProps} />,
    "pet-supplies": <Dog {...iconProps} />,
    "toys": <Gift {...iconProps} />,

    // Media & Entertainment
    "books": <BookOpen {...iconProps} />,
    "music": <MusicNotes {...iconProps} />,
    "musical-instruments": <Guitar {...iconProps} />,
    "movies-music": <FilmStrip {...iconProps} />,

    // Business & Office
    "office": <Briefcase {...iconProps} />,
    "office-school": <GraduationCap {...iconProps} />,
    "industrial-scientific": <Flask {...iconProps} />,
    "services": <Briefcase {...iconProps} />,

    // Shopping & Deals
    "deals": <Tag {...iconProps} />,
    "grocery": <ShoppingCart {...iconProps} />,
    "handmade": <Palette {...iconProps} />,
    "collectibles": <Trophy {...iconProps} />,
    "gift-cards": <Gift {...iconProps} />,
    "tickets": <Ticket {...iconProps} />,

    // Automotive & Transport
    "automotive": <Car {...iconProps} />,
    "e-mobility": <Lightning {...iconProps} />,
    "wholesale": <Truck {...iconProps} />,

    // Regional & Special
    "bulgarian-traditional": <Flag {...iconProps} />,
    "hobbies": <Guitar {...iconProps} />,

    // Navigation
    "all": <SquaresFour {...iconProps} />,
  }

  return iconMap[slug] || <Package {...iconProps} />
}

// ============================================================================
// CONSOLIDATED ICON HELPERS
// ============================================================================
// NOTE: megaMenuIconMap and subheaderIconMap were removed in Sprint 4.
// Use getCategoryIcon(slug, { size: 16 }) for subheader icons
// Use getCategoryIcon(slug, { size: 20, className: "mega-menu-icon" }) for mega menu icons
// The getCategoryIcon function above handles all icon lookups with a unified API.

// ============================================================================
// CATEGORY COLORS (OLX-style vibrant backgrounds)
// ============================================================================
// These colors are used for category circles to make them visually distinct.
// Each category gets a unique pastel/vibrant background color.

export type CategoryColorScheme = {
  bg: string      // Background color class
  text: string    // Icon/text color class  
  ring: string    // Active ring color class
}

const categoryColors: Record<string, CategoryColorScheme> = {
  // Electronics - Blue/Cyan
  electronics: { bg: "bg-sky-100", text: "text-sky-600", ring: "ring-sky-500" },
  computers: { bg: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-500" },
  phones: { bg: "bg-cyan-100", text: "text-cyan-600", ring: "ring-cyan-500" },
  software: { bg: "bg-indigo-100", text: "text-indigo-600", ring: "ring-indigo-500" },
  
  // Fashion - Pink/Purple
  fashion: { bg: "bg-pink-100", text: "text-pink-600", ring: "ring-pink-500" },
  "jewelry-watches": { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-500" },
  
  // Home - Teal/Green  
  home: { bg: "bg-teal-100", text: "text-teal-600", ring: "ring-teal-500" },
  garden: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-500" },
  "real-estate": { bg: "bg-slate-100", text: "text-slate-600", ring: "ring-slate-500" },
  
  // Health/Beauty - Rose/Fuchsia
  beauty: { bg: "bg-fuchsia-100", text: "text-fuchsia-600", ring: "ring-fuchsia-500" },
  health: { bg: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-500" },
  
  // Sports/Gaming - Orange/Red
  sports: { bg: "bg-orange-100", text: "text-orange-600", ring: "ring-orange-500" },
  gaming: { bg: "bg-violet-100", text: "text-violet-600", ring: "ring-violet-500" },
  
  // Baby/Pets - Soft colors
  baby: { bg: "bg-pink-50", text: "text-pink-500", ring: "ring-pink-400" },
  pets: { bg: "bg-amber-50", text: "text-amber-500", ring: "ring-amber-400" },
  
  // Automotive - Gray/Steel
  automotive: { bg: "bg-zinc-100", text: "text-zinc-600", ring: "ring-zinc-500" },
  "e-mobility": { bg: "bg-lime-100", text: "text-lime-600", ring: "ring-lime-500" },
  
  // Food/Grocery - Green/Yellow
  grocery: { bg: "bg-green-100", text: "text-green-600", ring: "ring-green-500" },
  
  // Books/Media - Warm colors
  books: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-500" },
  music: { bg: "bg-purple-100", text: "text-purple-600", ring: "ring-purple-500" },
  
  // Services/Business - Professional colors
  services: { bg: "bg-blue-50", text: "text-blue-500", ring: "ring-blue-400" },
  office: { bg: "bg-gray-100", text: "text-gray-600", ring: "ring-gray-500" },
  wholesale: { bg: "bg-stone-100", text: "text-stone-600", ring: "ring-stone-500" },
  
  // Special
  "bulgarian-traditional": { bg: "bg-red-100", text: "text-red-600", ring: "ring-red-500" },
  hobbies: { bg: "bg-yellow-100", text: "text-yellow-600", ring: "ring-yellow-500" },
  collectibles: { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-500" },
  
  // All/Default
  all: { bg: "bg-muted", text: "text-muted-foreground", ring: "ring-primary" },
  default: { bg: "bg-muted/50", text: "text-muted-foreground", ring: "ring-border" },
}

/**
 * Get the color scheme for a category slug
 * @param slug - The category slug
 * @returns CategoryColorScheme with bg, text, and ring classes
 */
export function getCategoryColor(slug: string): CategoryColorScheme {
  // Direct match
  if (categoryColors[slug]) return categoryColors[slug]
  
  // Fuzzy match - check if slug contains a known key
  const slugLower = slug.toLowerCase()
  for (const [key, colors] of Object.entries(categoryColors)) {
    if (key === "default" || key === "all") continue
    if (slugLower.includes(key) || key.includes(slugLower)) return colors
  }
  
  return categoryColors.default!
}


