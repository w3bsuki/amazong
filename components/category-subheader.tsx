"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { 
  CaretDown,
  Monitor, 
  House, 
  GameController, 
  TShirt, 
  Baby, 
  Heart, 
  Car, 
  BookOpen, 
  Barbell, 
  Dog, 
  Lightbulb,
  ShoppingCart,
  Diamond,
  Palette,
  Gift,
  CaretRight,
  DotsThree
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import Image from "next/image"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon?: string | null
  image_url?: string | null
  children?: Category[]
}

// Map category slugs to Phosphor icons
const categoryIconMap: Record<string, React.ReactNode> = {
  "electronics": <Monitor size={16} weight="regular" />,
  "computers": <Monitor size={16} weight="regular" />,
  "fashion": <TShirt size={16} weight="regular" />,
  "home": <House size={16} weight="regular" />,
  "home-kitchen": <House size={16} weight="regular" />,
  "gaming": <GameController size={16} weight="regular" />,
  "sports": <Barbell size={16} weight="regular" />,
  "sports-outdoors": <Barbell size={16} weight="regular" />,
  "beauty": <Palette size={16} weight="regular" />,
  "toys": <Gift size={16} weight="regular" />,
  "books": <BookOpen size={16} weight="regular" />,
  "automotive": <Car size={16} weight="regular" />,
  "health": <Heart size={16} weight="regular" />,
  "baby": <Baby size={16} weight="regular" />,
  "baby-kids": <Baby size={16} weight="regular" />,
  "pets": <Dog size={16} weight="regular" />,
  "pet-supplies": <Dog size={16} weight="regular" />,
  "smart-home": <Lightbulb size={16} weight="regular" />,
  "grocery": <ShoppingCart size={16} weight="regular" />,
  "jewelry-watches": <Diamond size={16} weight="regular" />,
}

function getCategoryIcon(slug: string): React.ReactNode {
  return categoryIconMap[slug] || null
}

// Fallback product images for subcategories
const subcategoryImages: Record<string, string> = {
  "smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
  "laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80",
  "tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80",
  "headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  "cameras": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80",
  "tvs": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80",
  "consoles": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&q=80",
  "shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
  "women": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80",
  "men": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&q=80",
  "furniture": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80",
  "kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
  "skincare": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80",
  "makeup": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&q=80",
  "fitness": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80",
  "outdoor": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&q=80",
  "default": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80"
}

function getSubcategoryImage(slug: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl
  return subcategoryImages[slug] || subcategoryImages["default"]
}

// Maximum categories to show in the subheader - balanced for width
const MAX_VISIBLE_CATEGORIES = 11

// Cache categories globally to prevent refetching
let categoriesCache: Category[] | null = null
let categoriesFetching = false
let categoriesCallbacks: Array<(cats: Category[]) => void> = []

export function CategorySubheader() {
  const locale = useLocale()
  const [categories, setCategories] = useState<Category[]>(categoriesCache || [])
  const [isLoading, setIsLoading] = useState(!categoriesCache)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [headerHeight, setHeaderHeight] = useState(64)
  // Products fetching removed - using eBay-style text + banner layout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Measure header height for dropdown positioning
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        setHeaderHeight(header.offsetHeight)
      }
    }
    
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  // Fetch categories - with global caching
  useEffect(() => {
    // Use cached data if available
    if (categoriesCache) {
      setCategories(categoriesCache)
      setIsLoading(false)
      return
    }

    // If already fetching, wait for result
    if (categoriesFetching) {
      categoriesCallbacks.push((cats) => {
        setCategories(cats)
        setIsLoading(false)
      })
      return
    }

    // Fetch and cache
    categoriesFetching = true
    fetch("/api/categories?children=true")
      .then((res) => res.json())
      .then((data) => {
        const cats = data.categories || []
        categoriesCache = cats
        setCategories(cats)
        // Notify waiting callbacks
        categoriesCallbacks.forEach(cb => cb(cats))
        categoriesCallbacks = []
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err)
      })
      .finally(() => {
        categoriesFetching = false
        setIsLoading(false)
      })
  }, [])

  const getCategoryName = useCallback((cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }, [locale])

  const handleMouseEnter = useCallback((category: Category) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveCategory(category)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
    }, 150)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 h-10 px-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES)
  const moreCategories = categories.slice(MAX_VISIBLE_CATEGORIES)
  const showMoreButton = moreCategories.length > 0

  // Create a virtual "More" category for the mega menu
  const moreCategoryVirtual: Category = {
    id: "more-categories",
    name: "More Categories",
    name_bg: "Още категории",
    slug: "more",
    children: moreCategories
  }

  return (
    <>
      <div className="flex items-center w-full">
        {/* Category links */}
        <div className="flex items-center gap-0.5 flex-1">
          {visibleCategories.map((category) => {
            const hasChildren = category.children && category.children.length > 0
            const isActive = activeCategory?.id === category.id

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                    "text-foreground hover:text-brand hover:underline",
                    isActive && "text-brand"
                  )}
                >
                  <span>{getCategoryName(category)}</span>
                  {hasChildren && (
                    <CaretDown 
                      size={10} 
                      weight="fill" 
                      className={cn(
                        "transition-transform duration-200 opacity-60",
                        isActive && "rotate-180"
                      )} 
                    />
                  )}
                </Link>
              </div>
            )
          })}
        </div>

        {/* More Categories Button - pushed to the right */}
        {showMoreButton && (
          <div
            className="relative shrink-0"
            onMouseEnter={() => handleMouseEnter(moreCategoryVirtual)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                "flex items-center gap-1 px-2.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                "text-foreground hover:text-brand hover:underline",
                activeCategory?.id === "more-categories" && "text-brand"
              )}
            >
              <span>{locale === "bg" ? "Виж още" : "See more"}</span>
              <CaretDown 
                size={10} 
                weight="fill" 
                className={cn(
                  "transition-transform duration-200 opacity-60",
                  activeCategory?.id === "more-categories" && "rotate-180"
                )} 
              />
            </button>
          </div>
        )}
      </div>

      {/* Mega Menu Dropdown */}
      {activeCategory && activeCategory.children && activeCategory.children.length > 0 && (
        <>
          <div
            className={cn(
              "fixed left-0 right-0 z-50",
              "bg-background border-b border-border",
              "transition-all duration-150 ease-out origin-top",
              "opacity-100 scale-y-100 pointer-events-auto"
            )}
            style={{ top: `${headerHeight}px` }}
            onMouseEnter={() => {
              // Just clear the timeout to keep the menu open, don't re-fetch
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="container p-5 max-h-(--mega-menu-max-height) overflow-y-auto">
              {/* eBay-style Layout: Text Columns + Promotional Banner */}
              <div className="flex gap-6">
                {/* Left Side: Text Navigation (50%) */}
                <div className="flex-1 flex gap-8">
                  {/* Column 1: Most Popular Categories */}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
                      <span className="text-brand">
                        {activeCategory.id === "more-categories" 
                          ? <DotsThree size={18} weight="bold" />
                          : getCategoryIcon(activeCategory.slug)
                        }
                      </span>
                      {locale === "bg" ? "Популярни категории" : "Most popular"}
                    </h4>
                    <ul className="space-y-1">
                      {activeCategory.children.slice(0, 7).map((subcat) => (
                        <li key={subcat.id}>
                          <Link
                            href={activeCategory.id === "more-categories" 
                              ? `/categories/${subcat.slug}` 
                              : `/search?category=${subcat.slug}`
                            }
                            onClick={() => setActiveCategory(null)}
                            className="text-sm text-foreground hover:text-brand hover:underline transition-colors block py-0.5"
                          >
                            {getCategoryName(subcat)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2: More Categories */}
                  {activeCategory.children.length > 7 && (
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
                        {locale === "bg" ? "Още категории" : "More categories"}
                      </h4>
                      <ul className="space-y-1">
                        {activeCategory.children.slice(7, 14).map((subcat) => (
                          <li key={subcat.id}>
                            <Link
                              href={activeCategory.id === "more-categories" 
                                ? `/categories/${subcat.slug}` 
                                : `/search?category=${subcat.slug}`
                              }
                              onClick={() => setActiveCategory(null)}
                              className="text-sm text-foreground hover:text-brand hover:underline transition-colors block py-0.5"
                            >
                              {getCategoryName(subcat)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {/* View All Link */}
                      {activeCategory.children.length > 14 && (
                        <Link
                          href={activeCategory.id === "more-categories" ? "/categories" : `/categories/${activeCategory.slug}`}
                          onClick={() => setActiveCategory(null)}
                          className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
                        >
                          {locale === "bg" 
                            ? `Виж всички (${activeCategory.children.length})` 
                            : `View all (${activeCategory.children.length})`}
                          <CaretRight size={14} weight="bold" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side: Promotional Banner (50%) */}
                {activeCategory.id !== "more-categories" && (
                  <div className="flex-1 max-w-[50%]">
                    <Link
                      href={`/categories/${activeCategory.slug}`}
                      onClick={() => setActiveCategory(null)}
                      className="block relative h-full min-h-[200px] rounded-lg overflow-hidden group"
                    >
                      {/* Banner Image */}
                      <Image
                        src={getSubcategoryImage(activeCategory.slug, activeCategory.image_url)}
                        alt={getCategoryName(activeCategory)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                      {/* Banner Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <span className="inline-block px-2 py-0.5 mb-2 text-xs font-bold uppercase tracking-wide bg-brand rounded">
                          {getCategoryName(activeCategory)}
                        </span>
                        <h3 className="text-lg font-bold mb-1">
                          {locale === "bg" ? "Открийте най-доброто" : "Discover the best"}
                        </h3>
                        <p className="text-sm opacity-90 mb-2">
                          {locale === "bg" 
                            ? `Над ${activeCategory.children.length} подкатегории` 
                            : `Over ${activeCategory.children.length} subcategories`}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:gap-2 transition-all">
                          {locale === "bg" ? "Разгледай" : "Shop now"}
                          <CaretRight size={16} weight="bold" />
                        </span>
                      </div>
                    </Link>
                  </div>
                )}

                {/* More Categories: Show all categories in grid */}
                {activeCategory.id === "more-categories" && (
                  <div className="flex-1 max-w-[50%]">
                    <h4 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border">
                      {locale === "bg" ? "Всички категории" : "All categories"}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {activeCategory.children.slice(0, 6).map((subcat) => (
                        <Link
                          key={subcat.id}
                          href={`/categories/${subcat.slug}`}
                          onClick={() => setActiveCategory(null)}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted ring-1 ring-border/40 shrink-0">
                            <Image
                              src={getSubcategoryImage(subcat.slug, subcat.image_url)}
                              alt={getCategoryName(subcat)}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                            {getCategoryName(subcat)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-150"
            style={{ top: `${headerHeight}px` }}
            onClick={() => setActiveCategory(null)}
            aria-hidden="true"
          />
        </>
      )}
    </>
  )
}
