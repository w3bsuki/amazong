"use client"

import * as React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { List, CaretRight, CaretDown, ShoppingBag, Tag } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import Image from "next/image"
import { categoryBlurDataURL } from "@/lib/image-utils"
import { getCategoryIcon } from "@/config/category-icons"
import { getSubcategoryImage } from "@/config/subcategory-images"
import { useCategoriesCache, getCategoryName, type Category } from "@/hooks/use-categories-cache"

const MAX_VISIBLE_CATEGORIES = 25
const MAX_VISIBLE_SUBCATEGORIES = 16

export function MegaMenu() {
  const locale = useLocale()
  const { categories, isLoading } = useCategoriesCache({ depth: 2 })
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(118)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Measure only the main header row height (excluding subheader) 
  // so mega menu opens below main header and COVERS the subheader
  useEffect(() => {
    const updateHeaderHeight = () => {
      // Find the desktop header container (the div with "hidden md:block")
      // This is the main header row, not including the category subheader nav
      const desktopHeader = document.querySelector("header > div.hidden.md\\:block") as HTMLElement
      if (desktopHeader) {
        // Get the position from top of header to bottom of main header row
        const header = document.querySelector("header") as HTMLElement
        if (header) {
          const headerRect = header.getBoundingClientRect()
          const desktopHeaderRect = desktopHeader.getBoundingClientRect()
          // Height = bottom of desktop header row relative to top of viewport when header is at top
          setHeaderHeight(desktopHeaderRect.bottom - headerRect.top)
        }
      } else {
        // Fallback: assume ~64px for main header row only
        setHeaderHeight(64)
      }
    }
    updateHeaderHeight()
    window.addEventListener("resize", updateHeaderHeight)
    return () => window.removeEventListener("resize", updateHeaderHeight)
  }, [])

  // Set first category as active when data loads
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0])
    }
  }, [categories, activeCategory])

  const handleCategoryHover = useCallback((category: Category) => {
    setActiveCategory(category)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const getName = useCallback((cat: Category) => getCategoryName(cat, locale), [locale])
  const visibleCategories = showAllCategories ? categories : categories.slice(0, MAX_VISIBLE_CATEGORIES)
  const hasMoreCategories = categories.length > MAX_VISIBLE_CATEGORIES

  return (
    <>
      {/* Trigger Button */}
      <div
        ref={menuRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          variant="ghost"
          size="icon-xl"
          className={cn(
            "text-foreground hover:text-brand hover:bg-transparent",
            "border-0",
            "transition-colors duration-150",
            isOpen && "text-brand"
          )}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={locale === "bg" ? "Отвори меню с категории" : "Open categories menu"}
        >
          <List weight="bold" aria-hidden="true" />
        </Button>

        {/* Invisible bridge */}
        {isOpen && <div className="absolute left-0 right-0 h-3" style={{ top: "100%" }} aria-hidden="true" />}
      </div>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 transition-opacity duration-150",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${headerHeight}px` }}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Full-width Mega Menu Panel */}
      <div
        className={cn(
          "fixed left-0 right-0 z-40 bg-popover border-b border-border shadow-lg",
          "transition-opacity duration-150 ease-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${headerHeight}px` }}
        role="menu"
        aria-label={locale === "bg" ? "Категории" : "Categories"}
      >
        <div
          className="container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex overflow-hidden" style={{ maxHeight: "min(calc(100vh - 150px), 640px)" }}>
            {/* Categories Sidebar */}
            <nav
              className="w-64 border-r border-border py-2 shrink-0 overflow-y-auto overscroll-contain"
              aria-label={locale === "bg" ? "Категории" : "Categories"}
            >
              {isLoading ? (
                <LoadingState locale={locale} />
              ) : (
                <>
                  <ul role="menu" className="pb-2">
                    {visibleCategories.map((category) => (
                      <CategoryItem
                        key={category.id}
                        category={category}
                        isActive={activeCategory?.id === category.id}
                        getName={getName}
                        onHover={handleCategoryHover}
                        onClose={closeMenu}
                      />
                    ))}
                  </ul>

                  {!showAllCategories && hasMoreCategories && (
                    <button
                      onClick={() => setShowAllCategories(true)}
                      className="flex items-center gap-2 px-3 py-2.5 w-full text-sm text-brand hover:text-brand/80 hover:bg-accent/50 transition-colors"
                      aria-expanded={showAllCategories}
                    >
                      <CaretDown size={16} weight="regular" aria-hidden="true" />
                      <span>
                        {locale === "bg"
                          ? `Виж още ${categories.length - MAX_VISIBLE_CATEGORIES}`
                          : `View ${categories.length - MAX_VISIBLE_CATEGORIES} more`}
                      </span>
                    </button>
                  )}

                  <FooterLinks locale={locale} onClose={closeMenu} />
                </>
              )}
            </nav>

            {/* Subcategories Panel - Full width */}
            <div className="flex-1 p-5 bg-popover overflow-y-auto overscroll-contain">
              {activeCategory && (
                <SubcategoriesGrid
                  category={activeCategory}
                  getName={getName}
                  onClose={closeMenu}
                  locale={locale}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function LoadingState({ locale }: { locale: string }) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="size-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mx-auto" />
      <p className="mt-3 text-sm text-muted-foreground">
        {locale === "bg" ? "Зареждане..." : "Loading..."}
      </p>
    </div>
  )
}

interface CategoryItemProps {
  category: Category
  isActive: boolean
  getName: (cat: Category) => string
  onHover: (cat: Category) => void
  onClose: () => void
}

function CategoryItem({ category, isActive, getName, onHover, onClose }: CategoryItemProps) {
  const name = getName(category)
  const hasChildren = category.children && category.children.length > 0

  return (
    <li role="none">
      <Link
        href={`/categories/${category.slug}`}
        role="menuitem"
        title={name}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2.5 text-sm group transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          isActive
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
        onMouseEnter={() => onHover(category)}
        onClick={onClose}
        aria-current={isActive ? "true" : undefined}
      >
        <span
          className={cn(
            "shrink-0 transition-colors",
            isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
          )}
          aria-hidden="true"
        >
          {getCategoryIcon(category.slug)}
        </span>
        <span className="flex-1 truncate">{name}</span>
        {hasChildren && (
          <CaretRight
            size={16}
            weight="regular"
            className={cn("shrink-0 transition-transform", isActive && "translate-x-0.5 text-brand")}
            aria-hidden="true"
          />
        )}
      </Link>
    </li>
  )
}

function FooterLinks({ locale, onClose }: { locale: string; onClose: () => void }) {
  return (
    <div className="border-t border-border mt-2 pt-1">
      <Link
        href="/categories"
        onClick={onClose}
        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-brand hover:text-brand/80 hover:bg-accent/50 transition-colors"
      >
        <ShoppingBag size={20} weight="regular" aria-hidden="true" />
        <span>{locale === "bg" ? "Всички категории" : "See All Categories"}</span>
        <CaretRight size={16} weight="regular" className="ml-auto" aria-hidden="true" />
      </Link>
      <Link
        href="/deals"
        onClick={onClose}
        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-destructive hover:text-destructive/80 hover:bg-accent/50 transition-colors"
      >
        <Tag size={20} weight="fill" aria-hidden="true" />
        <span>{locale === "bg" ? "Промоции" : "Deals"}</span>
        <CaretRight size={16} weight="regular" className="ml-auto" aria-hidden="true" />
      </Link>
    </div>
  )
}

interface SubcategoriesGridProps {
  category: Category
  getName: (cat: Category) => string
  onClose: () => void
  locale: string
}

function SubcategoriesGrid({ category, getName, onClose, locale }: SubcategoriesGridProps) {
  const hasChildren = category.children && category.children.length > 0
  const visibleChildren = category.children?.slice(0, MAX_VISIBLE_SUBCATEGORIES) || []
  const hasMoreChildren = (category.children?.length || 0) > MAX_VISIBLE_SUBCATEGORIES

  if (!hasChildren) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ShoppingBag size={40} weight="regular" className="mb-3 opacity-30" aria-hidden="true" />
        <p className="text-sm">
          {locale === "bg" ? "Разгледай категорията за продукти" : "Browse category for products"}
        </p>
        <Link
          href={`/categories/${category.slug}`}
          onClick={onClose}
          className="mt-2 text-sm text-brand hover:text-brand/80"
        >
          {locale === "bg" ? "Отиди към категорията" : "Go to category"}
        </Link>
      </div>
    )
  }

  return (
    <>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        role="list"
        aria-label={getName(category)}
      >
        {visibleChildren.map((subcat) => (
          <Link
            key={subcat.id}
            href={`/search?category=${subcat.slug}`}
            onClick={onClose}
            className="group flex flex-col items-center gap-2"
            role="listitem"
          >
            {/* Circle Image */}
            <div className="w-full aspect-square rounded-full overflow-hidden bg-muted group-hover:bg-muted/80 transition-colors">
              <Image
                src={getSubcategoryImage(subcat.slug, subcat.image_url)}
                alt={getName(subcat)}
                width={200}
                height={200}
                className="w-full h-full object-cover"
                placeholder="blur"
                blurDataURL={categoryBlurDataURL()}
                loading="lazy"
              />
            </div>
            {/* Label */}
            <span className="text-sm text-center text-muted-foreground group-hover:text-foreground group-hover:underline font-normal line-clamp-2 leading-tight">
              {getName(subcat)}
            </span>
          </Link>
        ))}
      </div>

      {hasMoreChildren && (
        <div className="mt-4 pt-2 border-t border-border">
          <Link
            href={`/categories/${category.slug}`}
            onClick={onClose}
            className="inline-flex items-center gap-1 text-sm font-normal text-brand hover:text-brand/80"
          >
            {locale === "bg"
              ? `Виж всички ${category.children?.length}`
              : `View all ${category.children?.length}`}
            <CaretRight size={16} weight="regular" aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  )
}
