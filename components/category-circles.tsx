"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { 
  CaretLeft, 
  CaretRight,
  // Electronics & Tech
  Laptop,
  Desktop,
  Headphones,
  DeviceMobile,
  Television,
  // Home & Living
  Armchair,
  Lamp,
  CookingPot,
  Bathtub,
  // Fashion & Apparel
  Dress,
  TShirt,
  Sneaker,
  Handbag,
  Watch,
  // Beauty & Personal Care
  Sparkle,
  Drop,
  // Baby & Kids
  Baby,
  BabyCarriage,
  PuzzlePiece,
  // Automotive
  Car,
  Engine,
  GasPump,
  // Sports & Fitness
  Barbell,
  Bicycle,
  PersonSimpleRun,
  // Pets
  Dog,
  Cat,
  Fish,
  PawPrint,
  // Books & Media
  BookOpen,
  Newspaper,
  FilmSlate,
  MusicNotes,
  Microphone,
  // Gaming
  GameController,
  // Food & Grocery
  ShoppingCart,
  Hamburger,
  Coffee,
  Wine,
  // Home Improvement
  Wrench,
  Hammer,
  PaintBrush,
  // Other categories
  Buildings,
  Code,
  Trophy,
  Diamond,
  Package,
  Gift,
  Briefcase,
  GraduationCap,
  Lightning,
  Handshake,
  Flag,
  Heart,
  FirstAidKit,
  Pill,
  ShoppingBag,
  type Icon as PhosphorIcon
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url?: string | null
}

// Map category slugs to specific e-commerce Phosphor icons
const categoryIcons: Record<string, PhosphorIcon> = {
  // Electronics & Technology
  "electronics": DeviceMobile,
  "computers": Desktop,
  "laptops": Laptop,
  "phones": DeviceMobile,
  "tv": Television,
  "audio": Headphones,
  
  // Home & Living
  "home": CookingPot,
  "furniture": Armchair,
  "kitchen": CookingPot,
  "lighting": Lamp,
  "bathroom": Bathtub,
  "decor": Lamp,
  
  // Fashion & Apparel  
  "fashion": Dress,
  "clothing": TShirt,
  "women": Dress,
  "men": TShirt,
  "shoes": Sneaker,
  "bags": Handbag,
  "accessories": Watch,
  
  // Beauty & Health
  "beauty": Sparkle,
  "cosmetics": Sparkle,
  "skincare": Drop,
  "health": FirstAidKit,
  "wellness": Heart,
  "pharmacy": Pill,
  
  // Baby & Kids
  "baby": Baby,
  "kids": BabyCarriage,
  "children": BabyCarriage,
  "toys": PuzzlePiece,
  
  // Automotive
  "automotive": Car,
  "car": Car,
  "auto-parts": Engine,
  "fuel": GasPump,
  
  // Sports & Outdoors
  "sports": Barbell,
  "fitness": Barbell,
  "outdoor": PersonSimpleRun,
  "cycling": Bicycle,
  
  // Pets & Animals
  "pets": PawPrint,
  "zoo": PawPrint,
  "dogs": Dog,
  "cats": Cat,
  "aquarium": Fish,
  
  // Books & Media
  "books": BookOpen,
  "magazines": Newspaper,
  "movies": FilmSlate,
  "music": MusicNotes,
  "podcasts": Microphone,
  
  // Gaming
  "gaming": GameController,
  "games": GameController,
  "video-games": GameController,
  
  // Food & Grocery
  "grocery": ShoppingCart,
  "food": Coffee,
  "drinks": Wine,
  "restaurants": Hamburger,
  
  // Home Improvement
  "tools": Hammer,
  "hardware": Wrench,
  "paint": PaintBrush,
  
  // Jewelry & Watches
  "jewelry": Diamond,
  "watches": Watch,
  "diamonds": Diamond,
  
  // Business & Services
  "real-estate": Buildings,
  "property": Buildings,
  "software": Code,
  "services": Handshake,
  "jobs": Briefcase,
  "work": Briefcase,
  
  // Other
  "collectibles": Trophy,
  "wholesale": Package,
  "gifts": Gift,
  "hobbies": Trophy,
  "education": GraduationCap,
  "ev": Lightning,
  "e-mobility": Lightning,
  "electric": Lightning,
  "bulgarian": Flag,
  "local": Flag,
  "traditional": Flag,
  
  // Default fallback
  "default": ShoppingBag
}

const getCategoryIcon = (slug: string): PhosphorIcon => {
  // Try exact match first
  if (categoryIcons[slug]) return categoryIcons[slug]
  
  // Try partial match for compound slugs
  const slugLower = slug.toLowerCase()
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (slugLower.includes(key) || key.includes(slugLower)) {
      return icon
    }
  }
  
  return categoryIcons["default"]
}

interface CategoryCirclesProps {
  locale?: string
}

export function CategoryCircles({ locale = "en" }: CategoryCirclesProps) {
  const { scrollRef, canScrollLeft, canScrollRight, scrollTo } = useHorizontalScroll()
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories from Supabase
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [])

  const getCategoryName = (cat: Category) => {
    return locale === 'bg' && cat.name_bg ? cat.name_bg : cat.name
  }

  return (
    <div className="relative w-full overflow-hidden bg-background pt-2 pb-0.5 md:py-4">
      {/* Header - Desktop only, consistent with other sections */}
      <div className="hidden md:flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground md:text-base">
            {locale === "bg" ? "Пазарувай по категория" : "Shop by Category"}
          </h2>
          <Link 
            href="/categories" 
            className="text-xs text-link hover:underline md:text-sm"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollTo("left")}
            className={cn(
              "size-7 flex items-center justify-center rounded-full border border-border bg-background hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              !canScrollLeft && "opacity-40 pointer-events-none"
            )}
            aria-label="Scroll left"
          >
            <CaretLeft size={14} weight="regular" className="text-foreground" />
          </button>
          <button
            onClick={() => scrollTo("right")}
            className={cn(
              "size-7 flex items-center justify-center rounded-full border border-border bg-background hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              !canScrollRight && "opacity-40 pointer-events-none"
            )}
            aria-label="Scroll right"
          >
            <CaretRight size={14} weight="regular" className="text-foreground" />
          </button>
        </div>
      </div>
      
      {/* Scrollable Container - Compact on mobile, larger on desktop */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2 px-3 py-1 scroll-pl-3 md:gap-6 md:px-4 md:scroll-pl-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category, index) => {
          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={cn(
                "flex flex-col items-center shrink-0 group snap-start focus-visible:outline-none",
                index === categories.length - 1 && "mr-3 md:mr-4"
              )}
            >
              {/* Circle - Slightly larger on mobile for better text fit */}
              <div
                className={cn(
                  "rounded-full flex items-center justify-center",
                  "size-[66px] md:size-28",
                  "bg-card ring-1 ring-border shadow-xs",
                  "transition-[transform,box-shadow,ring-color] duration-200 ease-out",
                  "group-hover:ring-ring/30 md:group-hover:shadow-sm",
                  "group-active:scale-[0.98]"
                )}
              >
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center",
                    "size-[58px] md:size-25",
                    "bg-background ring-1 ring-border/60",
                    "transition-colors duration-200",
                    "group-hover:bg-accent/40 group-hover:ring-ring/30"
                  )}
                >
                  {(() => {
                    const Icon = getCategoryIcon(category.slug)
                    return (
                      <Icon
                        className="size-7 md:size-12 text-link transition-colors duration-200"
                        weight="regular"
                      />
                    )
                  })()}
                </div>
              </div>
              {/* Category name below circle - wider for longer Bulgarian names */}
              <span className="mt-1.5 md:mt-2.5 text-foreground font-medium text-[11px] md:text-base text-center max-w-[74px] md:max-w-28 leading-tight line-clamp-2 group-hover:text-link transition-colors duration-200">
                {getCategoryName(category)}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Mobile scroll indicator - subtle fade */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-background to-transparent pointer-events-none md:hidden transition-opacity",
          !canScrollRight && "opacity-0"
        )} 
      />
    </div>
  )
}
