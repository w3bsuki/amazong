"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { 
  Laptop,
  Dress,
  Armchair,
  Sparkle,
  GameController,
  Barbell,
  Baby,
  Car,
  BookOpen,
  ShoppingBag,
  CaretLeft,
  CaretRight,
  ArrowRight,
} from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useCategoriesCache, getCategoryName } from "@/hooks/use-categories-cache"

// Tone for desktop cards (kept for DesktopCategoryRail)
const tone = {
  surface: "bg-brand-muted/50",
  icon: "text-link",
  iconHover: "group-hover:text-brand",
  accent: "text-cta-trust-blue",
}

// Fallback categories if fetch fails
const fallbackCategories = [
  { id: "1", name: "Electronics", name_bg: "Техника", slug: "electronics", image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop" },
  { id: "2", name: "Fashion", name_bg: "Мода", slug: "fashion", image_url: "https://images.unsplash.com/photo-1445205170230-053b830c6039?q=80&w=500&auto=format&fit=crop" },
  { id: "3", name: "Home", name_bg: "Дом", slug: "home", image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500&auto=format&fit=crop" },
  { id: "4", name: "Beauty", name_bg: "Красота", slug: "beauty", image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop" },
  { id: "5", name: "Gaming", name_bg: "Гейминг", slug: "gaming", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop" },
] as any[]

interface MobileCategoryRailProps {
  locale: string
}

// Mobile version - Rounded rectangles with images (Premium look like reference)
export function MobileCategoryRail({ locale }: MobileCategoryRailProps) {
  const sectionLabel = locale === "bg" ? "Категории" : "Categories"
  const { categories: fetchedCategories, isLoading } = useCategoriesCache()
  
  const displayCategories = fetchedCategories.length > 0 
    ? fetchedCategories.slice(0, 10) 
    : fallbackCategories

  return (
    <nav 
      aria-label={sectionLabel}
      className="py-0.5"
    >
      <div 
        className="flex overflow-x-auto no-scrollbar gap-2.5 px-3 py-0.5 snap-x snap-mandatory scroll-pl-3"
        role="list"
      >
        {isLoading && fetchedCategories.length === 0 ? (
          // Skeleton state
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="size-[72px] rounded-2xl bg-muted animate-pulse" />
              <div className="h-2.5 w-10 bg-muted animate-pulse rounded" />
            </div>
          ))
        ) : (
          displayCategories.map((cat) => {
            const categoryName = getCategoryName(cat, locale)
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                aria-label={categoryName}
                className={cn(
                  "group snap-start shrink-0",
                  "flex flex-col items-center",
                  "touch-action-manipulation",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl",
                )}
                role="listitem"
              >
                {/* Image Container - Rounded Rectangle */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl",
                    "size-[72px]",
                    "bg-muted ring-1 ring-border/40",
                    "transition-all duration-200 ease-out",
                    "group-hover:ring-ring/30",
                    "group-active:scale-[0.96]"
                  )}
                >
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={categoryName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="72px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-brand-muted/30">
                      <ShoppingBag className="size-7 text-brand/40" weight="duotone" />
                    </div>
                  )}
                  {/* Subtle overlay for text readability if needed, but here we have labels below */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                {/* Label */}
                <span className="mt-1.5 text-foreground font-semibold text-2xs text-center max-w-[72px] leading-tight line-clamp-1 group-hover:text-cta-trust-blue transition-colors duration-150">
                  {categoryName}
                </span>
              </Link>
            )
          })
        )}
      </div>
    </nav>
  )
}

// Desktop version - horizontal scroll with chevron navigation
export function DesktopCategoryRail({ locale }: MobileCategoryRailProps) {
  const featuredLabel = locale === "bg" ? "Избрано" : "Featured"
  const shopNowLabel = locale === "bg" ? "Разгледай" : "Shop now"
  const sectionTitle = locale === "bg" ? "Топ Категории" : "Top Categories"
  const seeAllLabel = locale === "bg" ? "Виж всички" : "See all"

  const { categories: fetchedCategories, isLoading } = useCategoriesCache()
  const displayCategories = fetchedCategories.length > 0 ? fetchedCategories : fallbackCategories

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = 180 // 164px card + 16px gap
    const scrollAmount = cardWidth * 3 // Scroll 3 cards at a time
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      {/* Header - Matching landing page section pattern */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border/40 bg-muted/5">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-tight">{sectionTitle}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/categories"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {seeAllLabel}
            <CaretRight size={12} weight="bold" />
          </Link>

          {/* Navigation Buttons - Moved to Header */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "size-8 rounded-full border border-border flex items-center justify-center transition-all",
                "hover:bg-muted active:scale-95",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
              aria-label="Scroll left"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "size-8 rounded-full border border-border flex items-center justify-center transition-all",
                "hover:bg-muted active:scale-95",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Rail Content */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar gap-4 scroll-smooth px-5 py-5"
        >
          {isLoading && fetchedCategories.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-[164px] h-[140px] rounded-xl bg-muted animate-pulse shrink-0" />
            ))
          ) : (
            displayCategories.map((cat) => {
              const categoryName = getCategoryName(cat, locale)
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className={cn(
                    "group shrink-0",
                    "w-[164px]",
                    "rounded-xl border border-border bg-card overflow-hidden",
                    "hover:border-border/80 hover:bg-accent/5"
                  )}
                >
                  <div className={cn("h-14 relative overflow-hidden", tone.surface)}>
                    {cat.image_url ? (
                      <Image 
                        src={cat.image_url} 
                        alt={categoryName} 
                        fill 
                        className="object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                        sizes="164px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className={cn("size-6", tone.icon)} weight="fill" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm", tone.accent)}>
                        {featuredLabel}
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-3.5">
                    <div className="text-[15px] font-semibold text-foreground leading-tight line-clamp-1 group-hover:text-brand">
                      {categoryName}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{shopNowLabel}</span>
                      <ArrowRight className={cn("size-3.5", tone.icon, tone.iconHover)} weight="bold" />
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
