"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { CaretDown, CaretRight, ArrowRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { getCategoryIcon } from "@/config/category-icons"
import { MEGA_MENU_CONFIG, MAX_MENU_ITEMS, MAX_VISIBLE_CATEGORIES } from "@/config/mega-menu-config"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon?: string | null
  image_url?: string | null
  children?: Category[]
}

// Cache categories globally
let categoriesCache: Category[] | null = null
let categoriesFetching = false
let categoriesCallbacks: Array<(cats: Category[]) => void> = []
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes TTL

export function CategorySubheader() {
  const locale = useLocale()
  const [categories, setCategories] = useState<Category[]>(categoriesCache || [])
  const [isLoading, setIsLoading] = useState(!categoriesCache)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [headerHeight, setHeaderHeight] = useState(64)
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

  // Fetch categories with depth=2 to get full hierarchy: L0 -> L1 -> L2
  useEffect(() => {
    const now = Date.now()
    const cacheExpired = now - cacheTimestamp > CACHE_TTL
    
    // Force fresh fetch - clear any stale cache
    if (cacheExpired || !categoriesCache || categoriesCache.length < 20) {
      categoriesCache = null
    }
    
    if (categoriesCache) {
      setCategories(categoriesCache)
      setIsLoading(false)
      return
    }

    if (categoriesFetching) {
      categoriesCallbacks.push((cats) => {
        setCategories(cats)
        setIsLoading(false)
      })
      return
    }

    categoriesFetching = true
    // depth=2 fetches L0 -> L1 -> L2 (needed for mega menu to show L2 children under L1 headers)
    fetch("/api/categories?children=true&depth=2", { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const cats = data.categories || []
        categoriesCache = cats
        cacheTimestamp = Date.now()
        setCategories(cats)
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

  // Calculate column layout for mega menu - eBay-style: 2 columns (25%) + banner CTA (50%)
  const megaMenuContent = useMemo(() => {
    if (!activeCategory?.children?.length) return null
    if (activeCategory.id === "more-categories") return null // Handle separately

    const children = activeCategory.children
    const menuConfig = MEGA_MENU_CONFIG[activeCategory.slug]
    
    if (menuConfig) {
      // eBay-style: 2 featured L1 columns (25% each) + banner CTA (50%)
      const featuredL1s = menuConfig.featured
        .map(slug => children.find(c => c.slug === slug))
        .filter((c): c is Category => c !== undefined)
      
      // Other L1 categories not in featured
      const otherL1s = children.filter(c => !menuConfig.featured.includes(c.slug))

      return { 
        type: 'ebay' as const, 
        featuredL1s,
        otherL1s,
        banner: menuConfig.banner,
        maxItems: menuConfig.maxItems || MAX_MENU_ITEMS,
        columns: menuConfig.columns || 2,
        showL1sDirectly: menuConfig.showL1sDirectly || false,
        columnHeaders: menuConfig.columnHeaders
      }
    } else {
      // Fallback: Simple 4-column layout with all L1 categories
      const itemsPerColumn = Math.ceil(children.length / 4)
      const columns: Category[][] = []
      
      for (let i = 0; i < children.length; i += itemsPerColumn) {
        columns.push(children.slice(i, i + itemsPerColumn))
      }

      return { type: 'simple' as const, columns }
    }
  }, [activeCategory])

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 h-10 px-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  // English has longer words, show fewer categories
  const maxVisible = locale === "bg" ? MAX_VISIBLE_CATEGORIES : MAX_VISIBLE_CATEGORIES - 1
  
  // Show first N categories in subheader row (already sorted by display_order from API)
  const visibleCategories = categories.slice(0, maxVisible)
  // Remaining categories go in the "Всички" dropdown
  const moreCategories = categories.slice(maxVisible)
  // Always show "Всички" button if there are categories beyond visible
  const showMoreButton = categories.length > maxVisible

  const moreCategoryVirtual: Category = {
    id: "more-categories",
    name: "View All",
    name_bg: "Всички",
    slug: "more",
    children: moreCategories // Categories not shown in main row
  }

  return (
    <>
      <div className="flex items-center w-full overflow-hidden">
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
          {visibleCategories.map((category) => {
            const hasChildren = category.children && category.children.length > 0
            const isActive = activeCategory?.id === category.id

            return (
              <div
                key={category.id}
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter(category)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className={cn(
                    "flex items-center gap-1 px-2 py-2.5 text-sm leading-tight transition-colors whitespace-nowrap",
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

        {showMoreButton && (
          <div
            className="relative shrink-0"
            onMouseEnter={() => handleMouseEnter(moreCategoryVirtual)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                "flex items-center gap-1 px-2.5 py-2.5 text-sm leading-tight transition-colors whitespace-nowrap",
                "text-foreground hover:text-brand hover:underline",
                activeCategory?.id === "more-categories" && "text-brand"
              )}
            >
              <span>{locale === "bg" ? "Всички" : "View All"}</span>
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
              "bg-background border-b border-border"
            )}
            style={{ top: `${headerHeight}px` }}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="container py-6 max-h-[70vh] overflow-y-auto">
              {/* Mega Menu Grid - eBay Style */}
              {megaMenuContent && (
                <>
                  {megaMenuContent.type === 'ebay' ? (
                    // eBay-style: category columns + banner CTA
                    <div className="flex gap-6 items-stretch">
                      {/* Left side - category columns (dynamic width based on column count) */}
                      <div className={cn(
                        "grid gap-6",
                        megaMenuContent.columns === 3 ? "w-3/5 grid-cols-3" : "w-1/2 grid-cols-2"
                      )}>
                        {megaMenuContent.showL1sDirectly ? (
                          // Show L1 categories directly - split into columns with custom headers
                          <>
                            {Array.from({ length: megaMenuContent.columns }, (_, colIndex) => {
                              const maxItems = megaMenuContent.maxItems || MAX_MENU_ITEMS
                              const columnL1s = megaMenuContent.featuredL1s.slice(
                                colIndex * maxItems, 
                                (colIndex + 1) * maxItems
                              )
                              const header = megaMenuContent.columnHeaders?.[colIndex]
                              
                              return (
                                <div key={colIndex} className="flex flex-col">
                                  {/* Column Header */}
                                  {header && (
                                    <span className="text-sm font-bold text-foreground mb-3">
                                      {locale === "bg" ? header.titleBg : header.title}
                                    </span>
                                  )}
                                  
                                  {/* L1 Categories as links */}
                                  <ul className="space-y-1.5 flex-1">
                                    {columnL1s.map((l1) => (
                                      <li key={l1.id}>
                                        <Link
                                          href={`/categories/${l1.slug}`}
                                          onClick={() => setActiveCategory(null)}
                                          className="text-sm text-muted-foreground hover:underline transition-colors block"
                                        >
                                          {getCategoryName(l1)}
                                        </Link>
                                      </li>
                                    ))}
                                    {/* Top Deals row */}
                                    <li>
                                      <Link
                                        href={`/categories/${activeCategory?.slug}?sort=deals`}
                                        onClick={() => setActiveCategory(null)}
                                        className="text-sm text-red-600 hover:underline transition-colors block font-medium"
                                      >
                                        {locale === "bg" ? "Топ оферти" : "Top Deals"}
                                      </Link>
                                    </li>
                                  </ul>
                                  
                                  {/* "See all" at bottom of first column only */}
                                  {colIndex === 0 && (
                                    <Link
                                      href={`/categories/${activeCategory?.slug}`}
                                      onClick={() => setActiveCategory(null)}
                                      className="text-sm text-brand hover:underline font-medium transition-colors inline-flex items-center gap-1 mt-3"
                                    >
                                      {locale === "bg" ? "Виж всички" : "See all"}
                                      <CaretRight size={12} weight="bold" />
                                    </Link>
                                  )}
                                </div>
                              )
                            })}
                          </>
                        ) : (
                          // Default: Featured L1 columns with their L2 children
                          megaMenuContent.featuredL1s.map((l1Category, index) => {
                            const maxItems = megaMenuContent.maxItems || MAX_MENU_ITEMS
                            return (
                            <div key={l1Category.id} className="flex flex-col">
                              {/* L1 Header */}
                              <Link
                                href={`/categories/${l1Category.slug}`}
                                onClick={() => setActiveCategory(null)}
                                className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:underline transition-colors mb-3 group"
                              >
                                {getCategoryName(l1Category)}
                                <CaretRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              
                              {/* L2 Children - limited to maxItems */}
                              {l1Category.children && l1Category.children.length > 0 ? (
                                <ul className="space-y-1.5 flex-1">
                                  {l1Category.children.slice(0, maxItems).map((l2) => (
                                    <li key={l2.id}>
                                      <Link
                                        href={`/categories/${l2.slug}`}
                                        onClick={() => setActiveCategory(null)}
                                        className="text-sm text-muted-foreground hover:underline transition-colors block"
                                      >
                                        {getCategoryName(l2)}
                                      </Link>
                                    </li>
                                  ))}
                                  {/* Top Deals row - fills 5th row space */}
                                  <li>
                                    <Link
                                      href={`/categories/${l1Category.slug}?sort=deals`}
                                      onClick={() => setActiveCategory(null)}
                                      className="text-sm text-red-600 hover:underline transition-colors block font-medium"
                                    >
                                      {locale === "bg" ? "Топ оферти" : "Top Deals"}
                                    </Link>
                                  </li>
                                </ul>
                              ) : (
                                // If no L2 children, show other L1s from this category
                                <ul className="space-y-1.5 flex-1">
                                  {megaMenuContent.otherL1s.slice(index * maxItems, (index + 1) * maxItems).map((otherL1) => (
                                    <li key={otherL1.id}>
                                      <Link
                                        href={`/categories/${otherL1.slug}`}
                                        onClick={() => setActiveCategory(null)}
                                        className="text-sm text-muted-foreground hover:underline transition-colors block"
                                      >
                                        {getCategoryName(otherL1)}
                                      </Link>
                                    </li>
                                  ))}
                                  {/* Top Deals row - fills 5th row space */}
                                  <li>
                                    <Link
                                      href={`/categories/${activeCategory?.slug}?sort=deals`}
                                      onClick={() => setActiveCategory(null)}
                                      className="text-sm text-red-600 hover:underline transition-colors block font-medium"
                                    >
                                      {locale === "bg" ? "Топ оферти" : "Top Deals"}
                                    </Link>
                                  </li>
                                </ul>
                              )}
                              {/* Always show "See all" at bottom */}
                              <Link
                                href={`/categories/${l1Category.slug}`}
                                onClick={() => setActiveCategory(null)}
                                className="text-sm text-brand hover:underline font-medium transition-colors inline-flex items-center gap-1 mt-3"
                              >
                                {locale === "bg" ? "Виж всички" : "See all"}
                                <CaretRight size={12} weight="bold" />
                              </Link>
                            </div>
                          )})
                        )}
                      </div>

                      {/* Right side - Banner CTA (dynamic width) */}
                      <Link
                        href={megaMenuContent.banner.href}
                        onClick={() => setActiveCategory(null)}
                        className={cn(
                          "relative rounded-xl overflow-hidden group",
                          megaMenuContent.columns === 3 ? "w-2/5" : "w-1/2"
                        )}
                      >
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${megaMenuContent.banner.image})` }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white">
                          <h3 className="text-2xl font-bold mb-2">
                            {locale === "bg" ? megaMenuContent.banner.titleBg : megaMenuContent.banner.title}
                          </h3>
                          <p className="text-white/80 text-sm mb-4 max-w-xs">
                            {locale === "bg" ? megaMenuContent.banner.subtitleBg : megaMenuContent.banner.subtitle}
                          </p>
                          <div className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium w-fit group-hover:bg-brand/90">
                            {locale === "bg" ? megaMenuContent.banner.ctaBg : megaMenuContent.banner.cta}
                            <ArrowRight size={16} weight="bold" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    // Simple fallback layout - grid of L1 categories
                    <div className={cn(
                      "grid gap-8",
                      megaMenuContent.columns.length === 1 && "grid-cols-1",
                      megaMenuContent.columns.length === 2 && "grid-cols-2",
                      megaMenuContent.columns.length === 3 && "grid-cols-3",
                      megaMenuContent.columns.length >= 4 && "grid-cols-4"
                    )}>
                      {megaMenuContent.columns.map((column, colIndex) => (
                        <div key={colIndex}>
                          <ul className="space-y-2">
                            {column.map((l1Category) => (
                              <li key={l1Category.id}>
                                <Link
                                  href={`/categories/${l1Category.slug}`}
                                  onClick={() => setActiveCategory(null)}
                                  className="flex items-center gap-2 text-sm text-foreground hover:text-brand transition-colors py-1 group"
                                >
                                  <span className="text-muted-foreground group-hover:text-brand transition-colors">
                                    {getCategoryIcon(l1Category.slug)}
                                  </span>
                                  {getCategoryName(l1Category)}
                                  {l1Category.children && l1Category.children.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      ({l1Category.children.length})
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* "More Categories" Grid */}
              {activeCategory.id === "more-categories" && (
                <div className="grid grid-cols-4 gap-4">
                  {activeCategory.children?.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setActiveCategory(null)}
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors group border border-transparent hover:border-border"
                    >
                      <span className="text-muted-foreground group-hover:text-brand transition-colors">
                        {getCategoryIcon(cat.slug)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors block truncate">
                          {getCategoryName(cat)}
                        </span>
                        {cat.children && cat.children.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {cat.children.length} {locale === "bg" ? "подкатегории" : "subcategories"}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
