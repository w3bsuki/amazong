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
}

// Short mobile labels for English
const shortLabelsEn: Record<string, string> = {
  "Jewelry & Watches": "Jewelry",
  "Home & Kitchen": "Home",
  "Services & Events": "Services",
  "Electronics & Tech": "Electronics",
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
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2 px-3 py-1 scroll-pl-3"
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
                    "size-[66px]",
                    "bg-card ring-1 ring-border shadow-xs",
                    "transition-[transform,box-shadow,ring-color] duration-200 ease-out",
                    "group-hover:ring-ring/30",
                    "group-active:scale-[0.98]"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-full flex items-center justify-center",
                      "size-[58px]",
                      "bg-background ring-1 ring-border/60",
                      "transition-colors duration-200",
                      "group-hover:bg-accent/40 group-hover:ring-ring/30"
                    )}
                  >
                    {(() => {
                      const Icon = getCategoryIcon(category.slug)
                      return (
                        <Icon
                          className="size-7 text-link transition-colors duration-200"
                          weight="regular"
                        />
                      )
                    })()}
                  </div>
                </div>
                {/* Category name - Mobile (short labels) */}
                <span className="mt-1.5 text-foreground font-medium text-xs text-center max-w-[74px] leading-tight line-clamp-2 group-hover:text-link transition-colors duration-200">
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

        {/* ================================================================
            MOBILE TEST: Desktop-style cards for comparison
            - Remove this section after deciding which design is better
            ================================================================ */}
        <div className="mt-3 border-t border-dashed border-border/50">
          {/* Section Label for Cards */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {locale === "bg" ? "Карти x4 (по-малки)" : "Cards x4 (Smaller)"}
            </span>
            <Link 
              href="/categories" 
              className="text-[10px] font-medium text-link hover:text-link-hover hover:underline underline-offset-2 transition-colors"
            >
              {locale === "bg" ? "Виж всички" : "See all"}
            </Link>
          </div>
          
          {/* Mobile Cards - Smaller, showing ~4 */}
          <div
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2 px-3 pb-2 scroll-pl-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="list"
            aria-label={locale === "bg" ? "Категории (карти x4)" : "Categories (cards x4)"}
          >
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.slug)
              return (
                <Link
                  key={`card-${category.slug}`}
                  href={`/categories/${category.slug}`}
                  role="listitem"
                  className={cn(
                    "flex flex-col items-center justify-center shrink-0 snap-start",
                    "w-[88px] h-[84px] px-1.5 py-2",
                    "bg-card border border-border rounded-xl",
                    "active:bg-accent/50 active:border-ring/30",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "transition-all duration-150 ease-out",
                    "group cursor-pointer",
                    index === categories.length - 1 && "mr-3"
                  )}
                >
                  {/* Icon container - slightly smaller for mobile */}
                  <div
                    className={cn(
                      "size-10 rounded-lg flex items-center justify-center",
                      "bg-muted/50 group-active:bg-brand/10",
                      "transition-colors duration-150"
                    )}
                  >
                    <Icon
                      className="size-6 text-link group-active:text-brand transition-colors duration-150"
                      weight="regular"
                    />
                  </div>
                  {/* Category name - short labels for mobile */}
                  <span className="mt-1.5 text-foreground text-[11px] font-medium text-center leading-[14px] line-clamp-2 w-full px-0.5 group-active:text-brand transition-colors duration-150">
                    {getShortName(category)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ================================================================
            MOBILE TEST: Desktop cards showing ~3 (wider for more text)
            - Same desktop style but larger cards = more text space
            ================================================================ */}
        <div className="mt-3 border-t border-dashed border-border/50">
          {/* Section Label for Cards x3 */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {locale === "bg" ? "Карти x3 (по-големи)" : "Cards x3 (Larger)"}
            </span>
            <Link 
              href="/categories" 
              className="text-[10px] font-medium text-link hover:text-link-hover hover:underline underline-offset-2 transition-colors"
            >
              {locale === "bg" ? "Виж всички" : "See all"}
            </Link>
          </div>
          
          {/* Mobile Cards - Larger, showing ~3 */}
          <div
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2.5 px-3 pb-2 scroll-pl-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="list"
            aria-label={locale === "bg" ? "Категории (карти x3)" : "Categories (cards x3)"}
          >
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.slug)
              return (
                <Link
                  key={`card3-${category.slug}`}
                  href={`/categories/${category.slug}`}
                  role="listitem"
                  className={cn(
                    "flex flex-col items-center justify-center shrink-0 snap-start",
                    "w-[112px] h-[100px] px-2 py-2.5",
                    "bg-card border border-border rounded-xl",
                    "active:bg-accent/50 active:border-ring/30",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "transition-all duration-150 ease-out",
                    "group cursor-pointer",
                    index === categories.length - 1 && "mr-3"
                  )}
                >
                  {/* Icon container - larger for better proportion */}
                  <div
                    className={cn(
                      "size-11 rounded-lg flex items-center justify-center",
                      "bg-muted/50 group-active:bg-brand/10",
                      "transition-colors duration-150"
                    )}
                  >
                    <Icon
                      className="size-6 text-link group-active:text-brand transition-colors duration-150"
                      weight="regular"
                    />
                  </div>
                  {/* Category name - short labels for mobile */}
                  <span className="mt-2 text-foreground text-xs font-medium text-center leading-4 line-clamp-2 w-full px-1 group-active:text-brand transition-colors duration-150">
                    {getShortName(category)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ================================================================
            MOBILE TEST: Icon-only circles (no text)
            - Most compact option, but users may not know what category it is
            - Consider: tooltips on long-press? or rely on recognizable icons?
            ================================================================ */}
        <div className="mt-3 border-t border-dashed border-border/50">
          {/* Section Label for Icon-only */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {locale === "bg" ? "Само икони (без текст)" : "Icons Only (No Text)"}
            </span>
            <Link 
              href="/categories" 
              className="text-[10px] font-medium text-link hover:text-link-hover hover:underline underline-offset-2 transition-colors"
            >
              {locale === "bg" ? "Виж всички" : "See all"}
            </Link>
          </div>
          
          {/* Icon-only circles - super compact */}
          <div
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2.5 px-3 pb-2.5 scroll-pl-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="list"
            aria-label={locale === "bg" ? "Категории (икони)" : "Categories (icons)"}
          >
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.slug)
              return (
                <Link
                  key={`icon-${category.slug}`}
                  href={`/categories/${category.slug}`}
                  role="listitem"
                  aria-label={getCategoryName(category)}
                  title={getCategoryName(category)}
                  className={cn(
                    "shrink-0 snap-start",
                    "size-12 rounded-full flex items-center justify-center",
                    "bg-card border border-border",
                    "active:bg-accent/60 active:border-ring/40 active:scale-95",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "transition-all duration-150 ease-out",
                    "cursor-pointer",
                    index === categories.length - 1 && "mr-3"
                  )}
                >
                  <Icon
                    className="size-6 text-link transition-colors duration-150"
                    weight="regular"
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* ================================================================
            MOBILE TEST: Square icon cards with text OUTSIDE (below)
            - Card contains only the icon, text is below like circles
            - Best of both: modern card look + external text flexibility
            ================================================================ */}
        <div className="mt-3 border-t border-dashed border-border/50">
          {/* Section Label */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {locale === "bg" ? "Карти + текст отвън" : "Cards + Text Outside"}
            </span>
          </div>
          
          {/* Square cards with external text */}
          <div
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2.5 px-3 pb-2 scroll-pl-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="list"
          >
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.slug)
              return (
                <Link
                  key={`cardext-${category.slug}`}
                  href={`/categories/${category.slug}`}
                  role="listitem"
                  className={cn(
                    "flex flex-col items-center shrink-0 snap-start group",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg",
                    index === categories.length - 1 && "mr-3"
                  )}
                >
                  {/* Square card - icon only */}
                  <div
                    className={cn(
                      "size-14 rounded-xl flex items-center justify-center",
                      "bg-card border border-border",
                      "group-active:bg-accent/50 group-active:border-ring/30 group-active:scale-95",
                      "transition-all duration-150 ease-out"
                    )}
                  >
                    <Icon
                      className="size-7 text-link group-active:text-brand transition-colors duration-150"
                      weight="regular"
                    />
                  </div>
                  {/* Text below card - short labels for mobile */}
                  <span className="mt-1.5 text-foreground font-medium text-[11px] text-center max-w-[60px] leading-tight line-clamp-2 group-active:text-brand transition-colors duration-150">
                    {getShortName(category)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ================================================================
            MOBILE TEST: Colored cards (no icon) - Desktop card style
            - Blue background + white text inside
            - Same card dimensions as desktop, just colored
            ================================================================ */}
        <div className="mt-3 border-t border-dashed border-border/50">
          {/* Section Label */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {locale === "bg" ? "Цветни карти (без икони)" : "Colored Cards (No Icons)"}
            </span>
          </div>
          
          {/* Colored cards - desktop card style */}
          <div
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2 px-3 pb-2.5 scroll-pl-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            role="list"
          >
            {categories.map((category, index) => {
              return (
                <Link
                  key={`label-${category.slug}`}
                  href={`/categories/${category.slug}`}
                  role="listitem"
                  className={cn(
                    "flex items-center justify-center shrink-0 snap-start",
                    "w-[88px] h-[72px] px-2 py-2",
                    "bg-brand rounded-xl",
                    "active:bg-brand/80 active:scale-[0.97]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "transition-all duration-150 ease-out",
                    "cursor-pointer",
                    index === categories.length - 1 && "mr-3"
                  )}
                >
                  <span className="text-white text-xs font-semibold text-center leading-4 line-clamp-2">
                    {getShortName(category)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ================================================================
          DESKTOP: Rounded cards layout - Optimized for Bulgarian text
          - Wider cards (108px) to fit "Дом и кухня" properly
          - Taller cards (104px) for better proportion
          - Larger icons (size-12 container, size-7 icon)
          - Proper Tailwind v4 spacing tokens
          ================================================================ */}
      <div className="hidden md:block">
        {/* Header - Muted typography with proper vertical padding */}
        <div className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-muted-foreground tracking-wide">
              {locale === "bg" ? "Пазарувай по категория" : "Shop by Category"}
            </h2>
            <Link 
              href="/categories" 
              className="text-sm font-medium text-link hover:text-link-hover hover:underline underline-offset-2 transition-colors"
            >
              {locale === "bg" ? "Виж всички" : "See all"}
            </Link>
          </div>
          {/* Navigation buttons - properly spaced */}
          <div className="flex items-center gap-2" role="group" aria-label={locale === "bg" ? "Навигация" : "Navigation"}>
            <button
              onClick={() => scrollTo("left")}
              disabled={!canScrollLeft}
              className={cn(
                "size-9 flex items-center justify-center rounded-full",
                "border border-border bg-card text-foreground",
                "hover:bg-accent hover:border-ring/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:opacity-40 disabled:pointer-events-none",
                "transition-colors duration-150"
              )}
              aria-label={locale === "bg" ? "Превъртете наляво" : "Scroll left"}
            >
              <CaretLeft size={18} weight="regular" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              disabled={!canScrollRight}
              className={cn(
                "size-9 flex items-center justify-center rounded-full",
                "border border-border bg-card text-foreground",
                "hover:bg-accent hover:border-ring/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:opacity-40 disabled:pointer-events-none",
                "transition-colors duration-150"
              )}
              aria-label={locale === "bg" ? "Превъртете надясно" : "Scroll right"}
            >
              <CaretRight size={18} weight="regular" />
            </button>
          </div>
        </div>
        
        {/* Desktop: Rounded cards - wider for Bulgarian text */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-2.5 px-4 pb-3 scroll-pl-4"
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
                  "w-[108px] h-[104px] px-2 py-3",
                  "bg-card border border-border rounded-xl",
                  "hover:bg-accent/50 hover:border-ring/30 hover:shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "transition-all duration-200 ease-out",
                  "group cursor-pointer",
                  index === categories.length - 1 && "mr-4"
                )}
              >
                {/* Icon container - larger for better visual weight */}
                <div
                  className={cn(
                    "size-12 rounded-lg flex items-center justify-center",
                    "bg-muted/50 group-hover:bg-brand/10",
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
    </section>
  )
}
