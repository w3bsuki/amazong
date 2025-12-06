"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { List, CaretRight, CaretDown, ShoppingBag, Tag } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import Image from "next/image"
import { categoryBlurDataURL } from "@/lib/image-utils"
import { getCategoryIcon } from "@/config/category-icons"
import { getSubcategoryImage } from "@/config/subcategory-images"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon?: string | null
  image_url?: string | null
  children?: Category[]
}

// Maximum visible categories before showing "View more"
const MAX_VISIBLE_CATEGORIES = 25

// Cache categories globally to prevent refetching
let categoriesCache: Category[] | null = null
let categoriesFetching = false
let categoriesCallbacks: Array<(cats: Category[]) => void> = []

export function MegaMenu() {
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>(categoriesCache || [])
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(!categoriesCache)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(118) // Default fallback
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Measure header height dynamically for proper positioning
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

  // Fetch categories with children - with global caching
  useEffect(() => {
    // Use cached data if available
    if (categoriesCache) {
      setCategories(categoriesCache)
      if (categoriesCache.length > 0) {
        setActiveCategory(categoriesCache[0])
      }
      setIsLoading(false)
      return
    }

    // If already fetching, wait for result
    if (categoriesFetching) {
      categoriesCallbacks.push((cats) => {
        setCategories(cats)
        if (cats.length > 0) setActiveCategory(cats[0])
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
        if (cats.length > 0) {
          setActiveCategory(cats[0])
        }
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

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }, [])

  const handleCategoryHover = useCallback((category: Category) => {
    setActiveCategory(category)
  }, [])

  // Helper to close menu
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Main wrapper for hover state management */}
      <div 
        className="relative"
        ref={menuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trigger Button - uses negative margin to align icon with content edge, no hover bg to avoid overflow */}
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 mega-menu-text font-normal px-3 py-2.5 h-10 -ml-3",
            "text-header-text hover:text-brand hover:bg-transparent",
            "rounded-sm",
            isOpen && "text-brand"
          )}
        >
          <List size={18} weight="bold" />
          <span>{locale === "bg" ? "Всички категории" : "All categories"}</span>
        </Button>

        {/* Invisible bridge to prevent gap when moving to menu */}
        {isOpen && (
          <div 
            className="absolute left-0 right-0 h-3" 
            style={{ top: '100%' }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Backdrop - closes menu on click */}
      <div 
        className={cn(
          "fixed inset-0 z-30 transition-opacity duration-150",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${headerHeight}px` }}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mega Menu Panel - Full width like category-subheader */}
      <div
        className={cn(
          "fixed left-0 right-0 z-40",
          "bg-background border-b border-border",
          "transition-opacity duration-150 ease-out",
          isOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${headerHeight}px` }}
      >
        {/* Container wrapper for content alignment - mouse events here for container-width detection */}
        <div 
          className="container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Menu content box */}
          <div 
            className="flex overflow-hidden"
            style={{ maxHeight: 'min(calc(100vh - 150px), 640px)' }}
          >
          {/* Left Sidebar - Clean Categories List with scroll */}
          <div className="w-64 border-r border-border py-2 shrink-0 overflow-y-auto overscroll-contain">
              {isLoading ? (
                <div className="px-4 py-12 text-center">
                  <div className="size-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mx-auto" />
                  <p className="mt-3 mega-menu-text text-muted-foreground">
                    {locale === "bg" ? "Зареждане..." : "Loading..."}
                  </p>
                </div>
              ) : (
                <nav className="pb-2">
                  {/* Show categories with dynamic limit */}
                  {(showAllCategories ? categories : categories.slice(0, MAX_VISIBLE_CATEGORIES)).map((category) => {
                    const categoryName = getCategoryName(category)
                    return (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        title={categoryName} // Tooltip for truncated text
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 mega-menu-text group",
                          "transition-colors duration-100",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          activeCategory?.id === category.id
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                        onMouseEnter={() => handleCategoryHover(category)}
                        onClick={closeMenu}
                      >
                        <span className={cn(
                          "shrink-0 transition-colors duration-100",
                          activeCategory?.id === category.id 
                            ? "text-brand" 
                            : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {getCategoryIcon(category.slug)}
                        </span>
                        <span className="flex-1 truncate">{categoryName}</span>
                        {category.children && category.children.length > 0 && (
                          <CaretRight size={16} weight="regular" className={cn(
                            "shrink-0 transition-transform duration-100",
                            activeCategory?.id === category.id && "translate-x-0.5 text-brand"
                          )} />
                        )}
                      </Link>
                    )
                  })}
                  
                  {/* View More button if there are more categories */}
                  {!showAllCategories && categories.length > MAX_VISIBLE_CATEGORIES && (
                    <button
                      onClick={() => setShowAllCategories(true)}
                      className="flex items-center gap-2 px-3 py-2.5 w-full mega-menu-text text-brand hover:text-brand/80 hover:bg-accent/50 transition-colors duration-100"
                    >
                      <CaretDown size={16} weight="regular" />
                      <span>
                        {locale === "bg" 
                          ? `Виж още ${categories.length - MAX_VISIBLE_CATEGORIES}` 
                          : `View ${categories.length - MAX_VISIBLE_CATEGORIES} more`}
                      </span>
                    </button>
                  )}
                  
                  {/* See All Categories Link */}
                  <div className="border-t border-border mt-2 pt-1">
                    <Link
                      href="/categories"
                      onClick={closeMenu}
                      className="flex items-center gap-2.5 px-3 py-2 mega-menu-text font-medium text-brand hover:text-brand/80 hover:bg-accent/50 transition-colors duration-100"
                    >
                      <ShoppingBag size={20} weight="regular" />
                      <span>{locale === "bg" ? "Всички категории" : "See All Categories"}</span>
                      <CaretRight size={16} weight="regular" className="ml-auto" />
                    </Link>
                    <Link
                      href="/deals"
                      onClick={closeMenu}
                      className="flex items-center gap-2.5 px-3 py-2 mega-menu-text font-medium text-red-500 hover:text-red-600 hover:bg-accent/50 transition-colors duration-100"
                    >
                      <Tag size={20} weight="fill" />
                      <span>{locale === "bg" ? "Промоции" : "Deals"}</span>
                      <CaretRight size={16} weight="regular" className="ml-auto" />
                    </Link>
                  </div>
                </nav>
              )}
            </div>

            {/* Right Panel - Subcategories */}
            <div className="flex-1 p-5 bg-background overflow-y-auto overscroll-contain">
              {activeCategory && (
                <div>
                  {/* Subcategory Cards Grid - Clean, no animations */}
                  {activeCategory.children && activeCategory.children.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {activeCategory.children.slice(0, 16).map((subcat) => (
                        <Link
                          key={subcat.id}
                          href={`/search?category=${subcat.slug}`}
                          onClick={closeMenu}
                          className="group flex flex-col items-center gap-2"
                        >
                          {/* Circle Image - Clean, slight opacity change on hover */}
                          <div className="w-full aspect-square rounded-full overflow-hidden bg-muted group-hover:bg-muted/80">
                            <Image
                              src={getSubcategoryImage(subcat.slug, subcat.image_url)}
                              alt={getCategoryName(subcat)}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                              placeholder="blur"
                              blurDataURL={categoryBlurDataURL()}
                              loading="lazy"
                            />
                          </div>
                          {/* Label - Underline on hover */}
                          <span className="text-sm text-center text-muted-foreground group-hover:text-foreground group-hover:underline font-normal line-clamp-2 leading-tight">
                            {getCategoryName(subcat)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <ShoppingBag size={40} weight="regular" className="mb-3 opacity-30" />
                      <p className="mega-menu-text">
                        {locale === "bg" 
                          ? "Разгледай категорията за продукти" 
                          : "Browse category for products"}
                      </p>
                      <Link
                        href={`/categories/${activeCategory.slug}`}
                        onClick={closeMenu}
                        className="mt-2 mega-menu-text text-brand hover:text-brand/80"
                      >
                        {locale === "bg" ? "Отиди към категорията" : "Go to category"}
                      </Link>
                    </div>
                  )}

                  {/* Show more link if more than 16 subcategories */}
                  {activeCategory.children && activeCategory.children.length > 16 && (
                    <div className="mt-4 pt-2 border-t border-border">
                      <Link
                        href={`/categories/${activeCategory.slug}`}
                        onClick={closeMenu}
                        className="inline-flex items-center gap-1 mega-menu-text font-normal text-brand hover:text-brand/80"
                      >
                        {locale === "bg" 
                          ? `Виж всички ${activeCategory.children.length}` 
                          : `View all ${activeCategory.children.length}`}
                        <CaretRight size={16} weight="regular" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
