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

// Short mobile labels for Bulgarian - fits better in circles/cards
const shortLabelsBg: Record<string, string> = {
  "Бижута и часовници": "Бижута",
  "Дом и кухня": "За дома",
  "Услуги и събития": "Услуги",
  "Електроника и техника": "Техника",
  "Електроника": "Техника",
  "Компютри и лаптопи": "Компютри",
  "Авто и мото": "Авто",
  "Спорт и фитнес": "Спорт",
  "Книги и медия": "Книги",
  "Красота и здраве": "Красота",
  "Бебета и деца": "Деца",
  "Домашни любимци": "Любимци",
  "Храни и напитки": "Храни",
  "Градина и двор": "Градина",
  "Инструменти и ремонт": "Ремонт",
  "Офис и канцелария": "Офис",
  "Колекции и хоби": "Хоби",
  "Електромобилност": "Е-мобилност",
  "Колекционерски": "Колекции",
  "Музикални инструменти": "Инструменти",
  "Индустриално": "Индустрия",
  "Ръчна изработка": "Ръчна",
  "Търговия на едро": "На едро",
}

// Short mobile labels for English
const shortLabelsEn: Record<string, string> = {
  "Jewelry & Watches": "Jewelry",
  "Home & Kitchen": "Home",
  "Services & Events": "Services",
  "Electronics & Tech": "Electronics",
  "Electronics": "Tech",
  "Computers & Laptops": "Computers",
  "Auto & Moto": "Auto",
  "Sports & Fitness": "Sports",
  "Books & Media": "Books",
  "Beauty & Health": "Beauty",
  "Baby & Kids": "Kids",
  "Pets & Animals": "Pets",
  "Food & Drinks": "Food",
  "Garden & Outdoor": "Garden",
  "Tools & Home Improvement": "Tools",
  "Office & Stationery": "Office",
  "Collectibles & Hobbies": "Hobbies",
  "Collectibles & Art": "Collectibles",
  "Musical Instruments": "Instruments",
  "Industrial & Scientific": "Industrial",
  "Handmade & Crafts": "Handmade",
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
      .catch(() => {
        // Avoid console.error noise; circles can render without categories.
      })
  }, [])

  // Full name (for desktop/tooltips)
  const getCategoryName = (cat: Category) => {
    return locale === 'bg' && cat.name_bg ? cat.name_bg : cat.name
  }

  // Short name (for mobile)
  const getShortName = (cat: Category) => {
    const fullName = getCategoryName(cat)
    const shortLabels = locale === 'bg' ? shortLabelsBg : shortLabelsEn
    return shortLabels[fullName] || fullName
  }

  return (
    <section 
      aria-label={locale === "bg" ? "Категории" : "Categories"}
      className="relative w-full overflow-hidden bg-background pt-2 pb-0.5 md:py-0"
    >
      {/* ================================================================
          MOBILE: Original circles layout
          ================================================================ */}
      <div className="md:hidden">
        {/* Section Label for Circles */}
        <div className="flex items-center justify-between px-3 pt-1 pb-1.5">
          <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
            {locale === "bg" ? "Кръгове (Текущ дизайн)" : "Circles (Current Design)"}
          </span>
        </div>
        
        {/* Scrollable Container - Mobile circles */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2 px-3 py-1.5 scroll-pl-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          role="list"
        >
          {categories.map((category, index) => {
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                role="listitem"
                className={cn(
                  "flex flex-col items-center shrink-0 group snap-start",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg",
                  index === categories.length - 1 && "mr-3"
                )}
              >
                {/* Circle - Mobile */}
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center",
                    "size-[58px]",
                    "bg-card ring-1 ring-border shadow-xs",
                    "transition-all duration-150 ease-out",
                    "group-hover:ring-ring/30",
                    "group-active:scale-[0.98]"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-full flex items-center justify-center",
                      "size-[50px]",
                      "bg-background ring-1 ring-border/60",
                      "transition-colors duration-150",
                      "group-hover:bg-accent/40 group-hover:ring-ring/30"
                    )}
                  >
                    {(() => {
                      const Icon = getCategoryIcon(category.slug)
                      return (
                        <Icon
                          className="size-7 text-link transition-colors duration-150"
                          weight="regular"
                        />
                      )
                    })()}
                  </div>
                </div>
                {/* Category name - Mobile (short labels) */}
                <span className="mt-1.5 text-foreground font-medium text-[11px] text-center max-w-[78px] leading-[1.1] line-clamp-2 group-hover:text-link transition-colors duration-150 break-words">
                  {getShortName(category)}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Mobile scroll indicator - subtle fade */}
        <div 
          className={cn(
            "absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-background to-transparent pointer-events-none transition-opacity",
            !canScrollRight && "opacity-0"
          )} 
        />
      </div>

      {/* ================================================================
          DESKTOP: Rounded cards layout - Optimized for Bulgarian text
          - Wrapped in a section container to match landing page patterns
          - Header with chevrons and "See all" link
          ================================================================ */}
      <div className="hidden md:block">
        <div className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
          {/* Header - Matching landing page section pattern */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border/40 bg-muted/5">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-tight">
                  {locale === "bg" ? "Пазарувай по категория" : "Shop by Category"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/categories"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                {locale === "bg" ? "Виж всички" : "See all"}
                <CaretRight size={12} weight="bold" />
              </Link>

              {/* Navigation Buttons - Moved to Header */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollTo("left")}
                  disabled={!canScrollLeft}
                  className={cn(
                    "size-8 rounded-full border border-border flex items-center justify-center transition-all",
                    "hover:bg-muted active:scale-95",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                  aria-label={locale === "bg" ? "Превъртете наляво" : "Scroll left"}
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <button
                  onClick={() => scrollTo("right")}
                  disabled={!canScrollRight}
                  className={cn(
                    "size-8 rounded-full border border-border flex items-center justify-center transition-all",
                    "hover:bg-muted active:scale-95",
                    "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                  aria-label={locale === "bg" ? "Превъртете надясно" : "Scroll right"}
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Desktop: Rounded cards - wider for Bulgarian text */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2.5 px-5 py-5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="list"
            aria-label={locale === "bg" ? "Списък с категории" : "Category list"}
          >
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.slug)
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  role="listitem"
                  className={cn(
                    "flex flex-col items-center justify-center shrink-0 snap-start",
                    "w-[112px] h-[108px] px-2 py-3",
                    "bg-card border border-border rounded-xl",
                    "hover:bg-accent/5 hover:border-border/80",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "group cursor-pointer",
                    index === categories.length - 1 && "mr-4"
                  )}
                >
                  {/* Icon container - larger for better visual weight */}
                  <div
                    className={cn(
                      "size-12 rounded-lg flex items-center justify-center",
                      "bg-muted/30 border border-border/40 shadow-xs group-hover:bg-brand/5",
                      "transition-colors duration-200"
                    )}
                  >
                    <Icon
                      className="size-7 text-link group-hover:text-brand transition-colors duration-200"
                      weight="regular"
                    />
                  </div>
                  {/* Category name - proper line height for 2-line text */}
                  <span className="mt-2 text-foreground text-xs font-medium text-center leading-4 line-clamp-2 w-full px-1 group-hover:text-brand transition-colors duration-200">
                    {getCategoryName(category)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
