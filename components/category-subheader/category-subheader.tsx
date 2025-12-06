/**
 * CategorySubheader Component
 * 
 * Main component for the category navigation subheader with mega menu dropdowns.
 * Refactored following shadcn/ui best practices - slim main component using
 * extracted subcomponents for better maintainability.
 * 
 * @see MegaMenuPanel - Dropdown panel with category columns and banner
 * @see MoreCategoriesGrid - Grid for overflow categories
 */

"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"

import { MegaMenuPanel } from "./mega-menu-panel"
import { MoreCategoriesGrid } from "./more-categories-grid"
import { useCategoriesCache, getCategoryName, type Category } from "@/hooks/use-categories-cache"
import { MAX_VISIBLE_CATEGORIES } from "@/config/mega-menu-config"

export function CategorySubheader() {
  const locale = useLocale()
  const { categories, isLoading } = useCategoriesCache({ depth: 2 })
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

  // Mouse handlers with delay for smooth UX
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Close handler for navigation
  const handleNavigate = useCallback(() => {
    setActiveCategory(null)
  }, [])

  // Loading skeleton
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
  const visibleCategories = categories.slice(0, maxVisible)
  const moreCategories = categories.slice(maxVisible)
  const showMoreButton = categories.length > maxVisible

  // Virtual category for "View All" dropdown
  const moreCategoryVirtual: Category = {
    id: "more-categories",
    name: "View All",
    name_bg: "Всички",
    slug: "more",
    children: moreCategories
  }

  return (
    <>
      {/* Category Links Row */}
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
                    "flex items-center gap-1 px-2 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                    "text-foreground hover:text-brand hover:underline",
                    isActive && "text-brand"
                  )}
                >
                  <span>{getCategoryName(category, locale)}</span>
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

        {/* "View All" Button */}
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
            className="fixed left-0 right-0 z-50 bg-background border-b border-border"
            style={{ top: `${headerHeight}px` }}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="container py-6 max-h-[70vh] overflow-y-auto">
              {/* Regular category mega menu */}
              {activeCategory.id !== "more-categories" && (
                <MegaMenuPanel 
                  activeCategory={activeCategory}
                  locale={locale}
                  onNavigate={handleNavigate}
                />
              )}

              {/* "More Categories" Grid */}
              {activeCategory.id === "more-categories" && (
                <MoreCategoriesGrid 
                  categories={activeCategory.children}
                  locale={locale}
                  onNavigate={handleNavigate}
                />
              )}
            </div>
          </div>

          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-150"
            style={{ top: `${headerHeight}px` }}
            onClick={handleNavigate}
            aria-hidden="true"
          />
        </>
      )}
    </>
  )
}
