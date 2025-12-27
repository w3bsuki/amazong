"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  ShoppingBag,
  CaretLeft,
  CaretRight,
  ArrowRight,
} from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useCategoriesCache, getCategoryName } from "@/hooks/use-categories-cache"

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

interface DesktopFeaturedCategoryRailProps {
  locale: string
}

/**
 * DesktopFeaturedCategoryRail
 * Card-style featured categories rail with image header + "Featured" badge.
 */
export function DesktopFeaturedCategoryRail({ locale }: DesktopFeaturedCategoryRailProps) {
  const featuredLabel = locale === "bg" ? "Избрано" : "Featured"
  const shopNowLabel = locale === "bg" ? "Разгледай" : "Shop now"
  const sectionTitle = locale === "bg" ? "Топ категории" : "Top categories"
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
    const cardWidth = 180 // ~164px card + gap
    const scrollAmount = cardWidth * 3
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border/40 bg-muted/5">
        <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-tight">{sectionTitle}</h2>

        <div className="flex items-center gap-4">
          <Link
            href="/categories"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            {seeAllLabel}
            <CaretRight size={12} weight="bold" />
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "size-8 rounded-full border border-border flex items-center justify-center transition-colors",
                "hover:bg-muted",
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
                "size-8 rounded-full border border-border flex items-center justify-center transition-colors",
                "hover:bg-muted",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar gap-4 scroll-smooth px-5 py-5">
          {isLoading && fetchedCategories.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-[164px] h-[140px] rounded-xl bg-muted shrink-0" />
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
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm",
                          tone.accent
                        )}
                      >
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
