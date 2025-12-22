"use client"

import { useRef, useState, useEffect, useCallback } from "react"
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

// Tone for desktop cards (kept for DesktopCategoryRail)
const tone = {
  surface: "bg-brand-muted/50",
  icon: "text-link",
  iconHover: "group-hover:text-brand",
  accent: "text-cta-trust-blue",
}

const categories = [
  { id: "1", name: "Electronics", name_bg: "Техника", slug: "electronics", icon: Laptop },
  { id: "2", name: "Fashion", name_bg: "Мода", slug: "fashion", icon: Dress },
  { id: "3", name: "Home", name_bg: "Дом", slug: "home", icon: Armchair },
  { id: "4", name: "Beauty", name_bg: "Красота", slug: "beauty", icon: Sparkle },
  { id: "5", name: "Gaming", name_bg: "Гейминг", slug: "gaming", icon: GameController },
  { id: "6", name: "Sports", name_bg: "Спорт", slug: "sports", icon: Barbell },
  { id: "7", name: "Kids", name_bg: "Деца", slug: "baby", icon: Baby },
  { id: "8", name: "Auto", name_bg: "Авто", slug: "automotive", icon: Car },
  { id: "9", name: "Books", name_bg: "Книги", slug: "books", icon: BookOpen },
  { id: "10", name: "More", name_bg: "Още", slug: "more", icon: ShoppingBag },
]

interface MobileCategoryRailProps {
  locale: string
}

// Mobile version - Double-ring circles (premium look)
export function MobileCategoryRail({ locale }: MobileCategoryRailProps) {
  const sectionLabel = locale === "bg" ? "Категории" : "Categories"

  return (
    <nav 
      aria-label={sectionLabel}
      className="py-0.5"
    >
      <div 
        className="flex overflow-x-auto no-scrollbar gap-2 px-3 py-1 snap-x snap-mandatory scroll-pl-3"
        role="list"
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          const categoryName = locale === "bg" ? cat.name_bg : cat.name
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              aria-label={categoryName}
              className={cn(
                "group snap-start shrink-0",
                "flex flex-col items-center",
                "touch-action-manipulation",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg",
              )}
              role="listitem"
            >
              {/* Outer ring */}
              <div
                className={cn(
                  "rounded-full flex items-center justify-center",
                  "size-[66px]",
                  "bg-card ring-1 ring-border shadow-xs",
                  "transition-all duration-150 ease-out",
                  "group-hover:ring-ring/30",
                  "group-active:scale-[0.98]"
                )}
              >
                {/* Inner circle */}
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center",
                    "size-[58px]",
                    "bg-background ring-1 ring-border/60",
                    "transition-colors duration-150",
                    "group-hover:bg-accent/40 group-hover:ring-ring/30"
                  )}
                >
                  <Icon 
                    className="size-7 text-link transition-colors duration-150" 
                    weight="regular" 
                    aria-hidden="true" 
                  />
                </div>
              </div>
              {/* Label */}
              <span className="mt-1.5 text-foreground font-medium text-[11px] text-center max-w-[78px] leading-[1.1] line-clamp-2 group-hover:text-link transition-colors duration-150 break-words">
                {categoryName}
              </span>
            </Link>
          )
        })}
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
          {categories.map((cat) => {
            const Icon = cat.icon
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
                <div className={cn("h-14 px-3 flex items-center justify-between", tone.surface)}>
                  <div
                    className={cn(
                      "size-9 rounded-lg",
                      "bg-background border border-border/40",
                      "flex items-center justify-center shadow-xs"
                    )}
                    aria-hidden="true"
                  >
                    <Icon className={cn("size-5", tone.icon, tone.iconHover)} weight="fill" />
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", tone.accent)}>
                    {featuredLabel}
                  </span>
                </div>

                <div className="px-3 py-3.5">
                  <div className="text-[15px] font-semibold text-foreground leading-tight line-clamp-1 group-hover:text-brand">
                    {locale === "bg" ? cat.name_bg : cat.name}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{shopNowLabel}</span>
                    <ArrowRight className={cn("size-3.5", tone.icon, tone.iconHover)} weight="bold" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
