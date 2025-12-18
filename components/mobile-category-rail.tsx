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

// Clean trust-blue token theming - no rainbow gradients
const tone = {
  surface: "bg-brand-muted",
  icon: "text-link",
  iconHover: "group-hover:text-brand",
  accent: "text-cta-trust-blue",
}

const categories = [
  { id: "1", name: "Electronics", name_bg: "Електроника", slug: "electronics", icon: Laptop },
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

// Mobile version - horizontal scroll rail
export function MobileCategoryRail({ locale }: MobileCategoryRailProps) {
  return (
    <div className="px-4">
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group snap-start shrink-0",
                "w-[156px]",
                "rounded-2xl border border-border bg-card overflow-hidden",
                "touch-action-manipulation",
                "active:bg-accent/40",
                "transition-all duration-200"
              )}
            >
              <div className={cn("h-12 px-3 flex items-center justify-between", tone.surface)}>
                <div
                  className={cn(
                    "size-8 rounded-xl",
                    "bg-background/80 border border-border/50",
                    "flex items-center justify-center"
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("size-4.5", tone.icon, tone.iconHover)} weight="fill" />
                </div>
                <span className={cn("text-2xs font-semibold", tone.accent)}>Featured</span>
              </div>

              <div className="px-3 py-3">
                <div className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-brand transition-colors">
                  {locale === "bg" ? cat.name_bg : cat.name}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-2xs text-muted-foreground">Shop now</span>
                  <ArrowRight className={cn("size-3.5", tone.icon, tone.iconHover)} weight="bold" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// Desktop version - horizontal scroll with chevron navigation
export function DesktopCategoryRail({ locale }: MobileCategoryRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
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
    const cardWidth = 172 // 156px card + 16px gap
    const scrollAmount = cardWidth * 3 // Scroll 3 cards at a time
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative group/rail">
      {/* Left Chevron - always visible when scrollable */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={cn(
          "absolute -left-5 top-1/2 -translate-y-1/2 z-10",
          "size-8 rounded-full bg-background border border-border",
          "flex items-center justify-center",
          "transition-colors hover:bg-accent",
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll left"
      >
        <CaretLeft className="size-3.5 text-foreground" weight="bold" />
      </button>

      {/* Right Chevron - always visible when scrollable */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={cn(
          "absolute -right-5 top-1/2 -translate-y-1/2 z-10",
          "size-8 rounded-full bg-background border border-border",
          "flex items-center justify-center",
          "transition-colors hover:bg-accent",
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll right"
      >
        <CaretRight className="size-3.5 text-foreground" weight="bold" />
      </button>

      {/* Scrollable Container - NO extra padding, aligns with container edges */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar gap-4 scroll-smooth"
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "group shrink-0",
                "w-[156px]",
                "rounded-2xl border border-border bg-card overflow-hidden",
                "hover:shadow-md hover:border-ring/30 transition-all duration-200"
              )}
            >
              <div className={cn("h-12 px-3 flex items-center justify-between", tone.surface)}>
                <div
                  className={cn(
                    "size-8 rounded-xl",
                    "bg-background/80 border border-border/50",
                    "flex items-center justify-center"
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn("size-4.5", tone.icon, tone.iconHover)} weight="fill" />
                </div>
                <span className={cn("text-2xs font-semibold", tone.accent)}>Featured</span>
              </div>

              <div className="px-3 py-3">
                <div className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-brand transition-colors">
                  {locale === "bg" ? cat.name_bg : cat.name}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-2xs text-muted-foreground">Shop now</span>
                  <ArrowRight className={cn("size-3.5", tone.icon, tone.iconHover)} weight="bold" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Fade edges to indicate scrollability */}
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-muted to-transparent pointer-events-none transition-opacity",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )} 
      />
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted to-transparent pointer-events-none transition-opacity",
          canScrollRight ? "opacity-100" : "opacity-0"
        )} 
      />
    </div>
  )
}
