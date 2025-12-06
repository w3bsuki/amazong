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
  Truck,
  Flag,
  Desktop,
  Lightning,
  Plant,
  Cpu
} from "@phosphor-icons/react"

export type IconSize = 16 | 20 | 24

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
  }
  
  return iconMap[slug] || <Package {...iconProps} />
}

/**
 * Category icon map for subheader (size 16)
 */
export const subheaderIconMap: Record<string, React.ReactNode> = {
  "electronics": <Monitor size={16} weight="regular" />,
  "computers": <Cpu size={16} weight="regular" />,
  "fashion": <TShirt size={16} weight="regular" />,
  "home": <House size={16} weight="regular" />,
  "gaming": <GameController size={16} weight="regular" />,
  "sports": <Barbell size={16} weight="regular" />,
  "beauty": <Palette size={16} weight="regular" />,
  "toys": <Gift size={16} weight="regular" />,
  "books": <BookOpen size={16} weight="regular" />,
  "automotive": <Car size={16} weight="regular" />,
  "health-wellness": <Pill size={16} weight="regular" />,
  "cbd-wellness": <Leaf size={16} weight="regular" />,
  "baby-kids": <Baby size={16} weight="regular" />,
  "pets": <Dog size={16} weight="regular" />,
  "smart-home": <Lightbulb size={16} weight="regular" />,
  "grocery": <ShoppingCart size={16} weight="regular" />,
  "jewelry-watches": <Diamond size={16} weight="regular" />,
  "real-estate": <Buildings size={16} weight="regular" />,
  "tickets": <Ticket size={16} weight="regular" />,
  "gift-cards": <Gift size={16} weight="regular" />,
  "tools-home": <Wrench size={16} weight="regular" />,
  "musical-instruments": <MusicNotes size={16} weight="regular" />,
  "movies-music": <FilmStrip size={16} weight="regular" />,
  "handmade": <PaintBrush size={16} weight="regular" />,
  "industrial": <Flask size={16} weight="regular" />,
  "office-school": <GraduationCap size={16} weight="regular" />,
  "collectibles": <Diamond size={16} weight="regular" />,
  "garden-outdoor": <Plant size={16} weight="regular" />,
  "software": <Desktop size={16} weight="regular" />,
  "agriculture": <Leaf size={16} weight="regular" />,
  "e-mobility": <Lightning size={16} weight="regular" />,
  "services": <Storefront size={16} weight="regular" />,
  "wholesale": <Truck size={16} weight="regular" />,
  "bulgarian-traditional": <Flag size={16} weight="regular" />,
  "cameras": <Camera size={16} weight="regular" />,
}

/**
 * Category icon map for mega menu sidebar (size 20)
 */
export const megaMenuIconMap: Record<string, React.ReactNode> = {
  "electronics": <Monitor size={20} weight="regular" className="mega-menu-icon" />,
  "computers": <Laptop size={20} weight="regular" className="mega-menu-icon" />,
  "smart-home": <Lightbulb size={20} weight="regular" className="mega-menu-icon" />,
  "gaming": <GameController size={20} weight="regular" className="mega-menu-icon" />,
  "fashion": <TShirt size={20} weight="regular" className="mega-menu-icon" />,
  "home": <House size={20} weight="regular" className="mega-menu-icon" />,
  "home-kitchen": <ForkKnife size={20} weight="regular" className="mega-menu-icon" />,
  "sports": <Barbell size={20} weight="regular" className="mega-menu-icon" />,
  "sports-outdoors": <Barbell size={20} weight="regular" className="mega-menu-icon" />,
  "beauty": <PaintBrush size={20} weight="regular" className="mega-menu-icon" />,
  "toys": <Gift size={20} weight="regular" className="mega-menu-icon" />,
  "books": <BookOpen size={20} weight="regular" className="mega-menu-icon" />,
  "automotive": <Car size={20} weight="regular" className="mega-menu-icon" />,
  "health": <Heart size={20} weight="regular" className="mega-menu-icon" />,
  "baby": <Baby size={20} weight="regular" className="mega-menu-icon" />,
  "pets": <Dog size={20} weight="regular" className="mega-menu-icon" />,
  "pet-supplies": <Dog size={20} weight="regular" className="mega-menu-icon" />,
  "tools": <Wrench size={20} weight="regular" className="mega-menu-icon" />,
  "lighting": <Lightbulb size={20} weight="regular" className="mega-menu-icon" />,
  "phones": <DeviceMobile size={20} weight="regular" className="mega-menu-icon" />,
  "watches": <Watch size={20} weight="regular" className="mega-menu-icon" />,
  "audio": <Headphones size={20} weight="regular" className="mega-menu-icon" />,
  "cameras": <Camera size={20} weight="regular" className="mega-menu-icon" />,
  "tv": <Television size={20} weight="regular" className="mega-menu-icon" />,
  "music": <MusicNotes size={20} weight="regular" className="mega-menu-icon" />,
  "office": <Briefcase size={20} weight="regular" className="mega-menu-icon" />,
  "garden": <Leaf size={20} weight="regular" className="mega-menu-icon" />,
  "software-services": <Code size={20} weight="regular" className="mega-menu-icon" />,
  "grocery": <ShoppingCart size={20} weight="regular" className="mega-menu-icon" />,
  "jewelry-watches": <Diamond size={20} weight="regular" className="mega-menu-icon" />,
  "handmade": <Palette size={20} weight="regular" className="mega-menu-icon" />,
  "health-wellness": <Pill size={20} weight="regular" className="mega-menu-icon" />,
  "cbd-wellness": <Leaf size={20} weight="regular" className="mega-menu-icon" />,
  "office-school": <GraduationCap size={20} weight="regular" className="mega-menu-icon" />,
  "musical-instruments": <Guitar size={20} weight="regular" className="mega-menu-icon" />,
  "movies-music": <FilmStrip size={20} weight="regular" className="mega-menu-icon" />,
  "industrial-scientific": <Flask size={20} weight="regular" className="mega-menu-icon" />,
  "collectibles": <Trophy size={20} weight="regular" className="mega-menu-icon" />,
  "baby-kids": <Baby size={20} weight="regular" className="mega-menu-icon" />,
  "tools-home": <Hammer size={20} weight="regular" className="mega-menu-icon" />,
  "garden-outdoor": <Flower size={20} weight="regular" className="mega-menu-icon" />,
  "e-mobility": <Leaf size={20} weight="regular" className="mega-menu-icon" />,
  "services": <Briefcase size={20} weight="regular" className="mega-menu-icon" />,
  "bulgarian-traditional": <ForkKnife size={20} weight="regular" className="mega-menu-icon" />,
  "wholesale": <ShoppingBag size={20} weight="regular" className="mega-menu-icon" />,
  "software": <Code size={20} weight="regular" className="mega-menu-icon" />,
  "real-estate": <House size={20} weight="regular" className="mega-menu-icon" />,
  "hobbies": <Guitar size={20} weight="regular" className="mega-menu-icon" />,
}

/**
 * Get subheader icon (size 16)
 */
export function getSubheaderIcon(slug: string): React.ReactNode {
  return subheaderIconMap[slug] || <Package size={16} weight="regular" />
}

/**
 * Get mega menu icon (size 20 with mega-menu-icon class)
 */
export function getMegaMenuIcon(slug: string): React.ReactNode {
  return megaMenuIconMap[slug] || <ShoppingBag size={20} weight="regular" className="mega-menu-icon" />
}
