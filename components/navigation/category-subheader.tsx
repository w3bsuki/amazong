"use client"

import * as React from "react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { CaretDown, CaretRight, ArrowRight, List, ShoppingBag, Tag } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import Image from "next/image"
import { categoryBlurDataURL } from "@/lib/image-utils"
import { getCategoryIcon } from "@/lib/category-icons"
import { getSubcategoryImage } from "@/config/subcategory-images"
import { MEGA_MENU_CONFIG, MAX_MENU_ITEMS, PRIORITY_VISIBLE_CATEGORIES, HIDDEN_FROM_SUBHEADER } from "@/config/mega-menu-config"
import { useCategoriesCache, getCategoryName, type Category } from "@/hooks/use-categories-cache"

const MAX_VISIBLE_SUBCATEGORIES = 16

// Custom hook for header height measurement
function useHeaderHeight(): number {
  const [headerHeight, setHeaderHeight] = React.useState(64)
  
  React.useEffect(() => {
    const updateHeight = () => {
      const header = document.querySelector("header")
      if (header) setHeaderHeight(header.offsetHeight)
    }
    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])
  
  return headerHeight
}

export function CategorySubheader() {
  const locale = useLocale()
  const { categories, isLoading } = useCategoriesCache({ depth: 2 })
  const headerHeight = useHeaderHeight()
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false)
  const [fullMenuActiveCategory, setFullMenuActiveCategory] = useState<Category | null>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fullMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getName = useCallback((cat: Category) => getCategoryName(cat, locale), [locale])

  // Set first category as active in full menu when data loads
  useEffect(() => {
    const firstCategory = categories.at(0)
    if (firstCategory && !fullMenuActiveCategory) {
      setFullMenuActiveCategory(firstCategory)
    }
  }, [categories, fullMenuActiveCategory])

  const handleMouseEnter = useCallback((category: Category) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveCategory(category)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveCategory(null), 150)
  }, [])

  const closeMenu = useCallback(() => setActiveCategory(null), [])

  // Full mega menu handlers
  const handleFullMenuMouseEnter = useCallback(() => {
    if (fullMenuTimeoutRef.current) clearTimeout(fullMenuTimeoutRef.current)
    setIsFullMenuOpen(true)
  }, [])

  const handleFullMenuMouseLeave = useCallback(() => {
    fullMenuTimeoutRef.current = setTimeout(() => setIsFullMenuOpen(false), 150)
  }, [])

  const closeFullMenu = useCallback(() => {
    setIsFullMenuOpen(false)
  }, [])

  const handleCategoryHover = useCallback((category: Category) => {
    setFullMenuActiveCategory(category)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (fullMenuTimeoutRef.current) clearTimeout(fullMenuTimeoutRef.current)
    }
  }, [])

  // Visible subheader row (desktop): scrollable list.
  // Anything in HIDDEN_FROM_SUBHEADER is accessible via the "All Categories" mega menu.
  const hiddenSet = new Set(HIDDEN_FROM_SUBHEADER)
  const filteredForVisible = categories.filter((cat) => !hiddenSet.has(cat.slug))
  const prioritySet = new Set(PRIORITY_VISIBLE_CATEGORIES)
  const priorityCats = filteredForVisible.filter((cat) => prioritySet.has(cat.slug))
  const nonPriorityCats = filteredForVisible.filter((cat) => !prioritySet.has(cat.slug))
  const visibleCategories = [...priorityCats, ...nonPriorityCats]

  // For full mega menu - limit visible categories
  const MAX_FULL_MENU_CATEGORIES = 25
  const fullMenuVisibleCategories = showAllCategories ? categories : categories.slice(0, MAX_FULL_MENU_CATEGORIES)
  const hasMoreCategories = categories.length > MAX_FULL_MENU_CATEGORIES

  if (isLoading) {
    return <CategorySubheaderSkeleton />
  }

  return (
    <>
      <div className="flex w-full items-center gap-0">
        {/* All Categories Button - Triggers Full Mega Menu */}
        <div
          onMouseEnter={handleFullMenuMouseEnter}
          onMouseLeave={handleFullMenuMouseLeave}
          className="shrink-0 -ml-2"
        >
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-1.5 h-10 px-2 text-sm font-medium rounded-sm",
              "bg-transparent hover:bg-header-hover",
              "text-header-text hover:text-header-text",
              isFullMenuOpen && "bg-header-hover"
            )}
            aria-expanded={isFullMenuOpen}
            aria-haspopup="menu"
          >
            <List weight="bold" size={16} aria-hidden="true" />
            <span className="hidden xl:inline">{locale === "bg" ? "Всички категории" : "All Categories"}</span>
            <span className="xl:hidden">{locale === "bg" ? "Меню" : "Menu"}</span>
            <CaretDown
              size={10}
              weight="fill"
              className={cn("opacity-60", isFullMenuOpen && "rotate-180")}
              aria-hidden="true"
            />
          </Button>
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-header-border/60 mx-1 shrink-0" aria-hidden="true" />

        {/* Category items - horizontally scrollable on desktop. */}
        <div
          className="flex items-center flex-1 min-w-0 overflow-x-auto no-scrollbar"
          role="navigation"
          aria-label={locale === "bg" ? "Категории" : "Categories"}
        >
          {visibleCategories.map((category) => (
            <CategoryNavItem
              key={category.id}
              category={category}
              isActive={activeCategory?.id === category.id}
              getName={getName}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
      </div>

      {/* Individual Category Dropdown Panel */}
      {activeCategory && activeCategory.children && activeCategory.children.length > 0 && (
        <MegaMenuPanel
          activeCategory={activeCategory}
          headerHeight={headerHeight}
          getName={getName}
          onClose={closeMenu}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
          }}
          onMouseLeave={handleMouseLeave}
          locale={locale}
        />
      )}

      {/* Full Mega Menu with Sidebar (All Categories) */}
      <FullMegaMenu
        isOpen={isFullMenuOpen}
        headerHeight={headerHeight}
        categories={fullMenuVisibleCategories}
        activeCategory={fullMenuActiveCategory}
        showAllCategories={showAllCategories}
        hasMoreCategories={hasMoreCategories}
        totalCategories={categories.length}
        getName={getName}
        locale={locale}
        onCategoryHover={handleCategoryHover}
        onShowAllCategories={() => setShowAllCategories(true)}
        onClose={closeFullMenu}
        onMouseEnter={handleFullMenuMouseEnter}
        onMouseLeave={handleFullMenuMouseLeave}
      />
    </>
  )
}

// Skeleton loading state
function CategorySubheaderSkeleton() {
  return (
    <div className="flex items-center gap-2 h-10" role="status" aria-label="Loading categories">
      <div className="h-4 w-24 bg-muted rounded" />
      <div className="h-5 w-px bg-border" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-4 w-16 bg-muted rounded" />
      ))}
    </div>
  )
}

// Full Mega Menu with Sidebar (triggered by "All Categories" button)
interface FullMegaMenuProps {
  isOpen: boolean
  headerHeight: number
  categories: Category[]
  activeCategory: Category | null
  showAllCategories: boolean
  hasMoreCategories: boolean
  totalCategories: number
  getName: (cat: Category) => string
  locale: string
  onCategoryHover: (cat: Category) => void
  onShowAllCategories: () => void
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function FullMegaMenu({
  isOpen,
  headerHeight,
  categories,
  activeCategory,
  showAllCategories,
  hasMoreCategories,
  totalCategories,
  getName,
  locale,
  onCategoryHover,
  onShowAllCategories,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: FullMegaMenuProps) {
  const MAX_FULL_MENU_CATEGORIES = 25

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${headerHeight}px` }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Full-width Mega Menu Panel */}
      <div
        className={cn(
          "fixed left-0 right-0 z-40",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: `${headerHeight}px` }}
        role="menu"
        aria-label={locale === "bg" ? "Категории" : "Categories"}
      >
        <div
          className="container bg-popover border-b border-border"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="flex overflow-hidden" style={{ maxHeight: "min(calc(100vh - 150px), 640px)" }}>
            {/* Categories Sidebar */}
            <nav
              className="w-64 border-r border-border py-2 shrink-0 overflow-y-auto overscroll-contain"
              aria-label={locale === "bg" ? "Категории" : "Categories"}
            >
              <ul role="menu" className="pb-2">
                {categories.map((category) => (
                  <FullMenuCategoryItem
                    key={category.id}
                    category={category}
                    isActive={activeCategory?.id === category.id}
                    getName={getName}
                    onHover={onCategoryHover}
                    onClose={onClose}
                  />
                ))}
              </ul>

              {!showAllCategories && hasMoreCategories && (
                <button
                  onClick={onShowAllCategories}
                  className="flex items-center gap-2 px-3 py-2.5 w-full text-sm text-brand hover:bg-accent/50"
                  aria-expanded={showAllCategories}
                >
                  <CaretDown size={16} weight="regular" aria-hidden="true" />
                  <span>
                    {locale === "bg"
                      ? `Виж още ${totalCategories - MAX_FULL_MENU_CATEGORIES}`
                      : `View ${totalCategories - MAX_FULL_MENU_CATEGORIES} more`}
                  </span>
                </button>
              )}

              {/* Footer Links */}
              <div className="border-t border-border mt-2 pt-1">
                <Link
                  href="/categories"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-brand hover:bg-accent/50"
                >
                  <ShoppingBag size={20} weight="regular" aria-hidden="true" />
                  <span>{locale === "bg" ? "Всички категории" : "See All Categories"}</span>
                  <CaretRight size={16} weight="regular" className="ml-auto" aria-hidden="true" />
                </Link>
                <Link
                  href="/deals"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-destructive hover:bg-accent/50"
                >
                  <Tag size={20} weight="fill" aria-hidden="true" />
                  <span>{locale === "bg" ? "Промоции" : "Deals"}</span>
                  <CaretRight size={16} weight="regular" className="ml-auto" aria-hidden="true" />
                </Link>
              </div>
            </nav>

            {/* Subcategories Panel - Full width */}
            <div className="flex-1 p-4 bg-popover overflow-y-auto overscroll-contain">
              {activeCategory && (
                <FullMenuSubcategoriesGrid
                  category={activeCategory}
                  getName={getName}
                  onClose={onClose}
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

// Category item for full menu sidebar
interface FullMenuCategoryItemProps {
  category: Category
  isActive: boolean
  getName: (cat: Category) => string
  onHover: (cat: Category) => void
  onClose: () => void
}

function FullMenuCategoryItem({ category, isActive, getName, onHover, onClose }: FullMenuCategoryItemProps) {
  const name = getName(category)
  const hasChildren = category.children && category.children.length > 0

  return (
    <li role="none">
      <Link
        href={`/categories/${category.slug}`}
        role="menuitem"
        title={name}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2.5 text-sm group",
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
            "shrink-0",
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
            className={cn("shrink-0", isActive && "translate-x-0.5 text-brand")}
            aria-hidden="true"
          />
        )}
      </Link>
    </li>
  )
}

// Subcategories grid for full mega menu
interface FullMenuSubcategoriesGridProps {
  category: Category
  getName: (cat: Category) => string
  onClose: () => void
  locale: string
}

function FullMenuSubcategoriesGrid({ category, getName, onClose, locale }: FullMenuSubcategoriesGridProps) {
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
          className="mt-2 text-sm text-brand"
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
            <div className="w-full aspect-square rounded-full overflow-hidden bg-muted group-hover:bg-muted/80">
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
            className="inline-flex items-center gap-1 text-sm font-normal text-brand"
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

// Individual category navigation item
interface CategoryNavItemProps {
  category: Category
  isActive: boolean
  getName: (cat: Category) => string
  onMouseEnter: (cat: Category) => void
  onMouseLeave: () => void
}

function CategoryNavItem({ category, isActive, getName, onMouseEnter, onMouseLeave }: CategoryNavItemProps) {
  const hasChildren = category.children && category.children.length > 0

  return (
    <div
      onMouseEnter={() => onMouseEnter(category)}
      onMouseLeave={onMouseLeave}
      className="shrink-0"
    >
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "flex items-center gap-1.5 rounded-sm px-3 min-h-10 whitespace-nowrap",
          "text-sm font-medium",
          "text-header-text hover:text-header-text hover:bg-header-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-header-text/70",
          isActive && "bg-header-hover"
        )}
        aria-expanded={hasChildren ? isActive : undefined}
        aria-haspopup={hasChildren ? "menu" : undefined}
      >
        <span>{getName(category)}</span>
        {hasChildren && (
          <CaretDown
            size={10}
            weight="fill"
            className={cn("opacity-60", isActive && "rotate-180")}
            aria-hidden="true"
          />
        )}
      </Link>
    </div>
  )
}

// Mega menu panel component
interface MegaMenuPanelProps {
  activeCategory: Category
  headerHeight: number
  getName: (cat: Category) => string
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  locale: string
}

function MegaMenuPanel({
  activeCategory,
  headerHeight,
  getName,
  onClose,
  onMouseEnter,
  onMouseLeave,
  locale,
}: MegaMenuPanelProps) {
  const megaMenuContent = useMegaMenuContent(activeCategory, getName, locale)

  return (
    <>
      <div
        className="fixed left-0 right-0 z-50"
        style={{ top: `${headerHeight}px` }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role="menu"
        aria-label={getName(activeCategory)}
      >
        <div className="container bg-popover border-b border-border py-6 max-h-[70vh] overflow-y-auto">
          {activeCategory.id === "more-categories" ? (
            <MoreCategoriesGrid
              categories={activeCategory.children || []}
              getName={getName}
              onClose={onClose}
              locale={locale}
            />
          ) : megaMenuContent ? (
            megaMenuContent.type === "ebay" ? (
              <EbayStyleMenu content={megaMenuContent} getName={getName} onClose={onClose} locale={locale} activeCategory={activeCategory} />
            ) : (
              <SimpleGridMenu content={megaMenuContent} getName={getName} onClose={onClose} />
            )
          ) : null}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 z-40"
        style={{ top: `${headerHeight}px` }}
        onClick={onClose}
        aria-hidden="true"
      />
    </>
  )
}

// Hook to compute mega menu content
function useMegaMenuContent(activeCategory: Category, _getName?: (cat: Category) => string, _locale?: string) {
  return useMemo(() => {
    if (!activeCategory?.children?.length) return null
    if (activeCategory.id === "more-categories") return null

    const children = activeCategory.children
    const menuConfig = MEGA_MENU_CONFIG[activeCategory.slug]

    if (menuConfig) {
      const featuredL1s = menuConfig.featured
        .map((slug) => children.find((c) => c.slug === slug))
        .filter((c): c is Category => c !== undefined)

      const otherL1s = children.filter((c) => !menuConfig.featured.includes(c.slug))

      return {
        type: "ebay" as const,
        featuredL1s,
        otherL1s,
        banner: menuConfig.banner,
        maxItems: menuConfig.maxItems || MAX_MENU_ITEMS,
        columns: menuConfig.columns || 2,
        showL1sDirectly: menuConfig.showL1sDirectly || false,
        ...(menuConfig.columnHeaders ? { columnHeaders: menuConfig.columnHeaders } : {}),
      }
    }

    // Fallback: Simple 4-column layout
    const itemsPerColumn = Math.ceil(children.length / 4)
    const columns: Category[][] = []
    for (let i = 0; i < children.length; i += itemsPerColumn) {
      columns.push(children.slice(i, i + itemsPerColumn))
    }

    return { type: "simple" as const, columns }
  }, [activeCategory])
}

// eBay-style menu with banner
interface EbayStyleMenuProps {
  content: {
    featuredL1s: Category[]
    otherL1s: Category[]
    banner: { href: string; image: string; title: string; titleBg: string; subtitle: string; subtitleBg: string; cta: string; ctaBg: string }
    maxItems: number
    columns: number
    showL1sDirectly: boolean
    columnHeaders?: Array<{ title: string; titleBg: string }>
  }
  getName: (cat: Category) => string
  onClose: () => void
  locale: string
  activeCategory: Category
}

function EbayStyleMenu({ content, getName, onClose, locale, activeCategory }: EbayStyleMenuProps) {
  return (
    <div className="flex gap-4 items-stretch">
      {/* Category columns */}
      <div className={cn("grid gap-4", content.columns === 3 ? "w-3/5 grid-cols-3" : "w-1/2 grid-cols-2")}>
        {content.showL1sDirectly ? (
          <DirectL1Columns content={content} getName={getName} onClose={onClose} locale={locale} activeCategory={activeCategory} />
        ) : (
          <FeaturedL1Columns content={content} getName={getName} onClose={onClose} locale={locale} activeCategory={activeCategory} />
        )}
      </div>

      {/* Banner CTA */}
      <BannerCTA banner={content.banner} columns={content.columns} onClose={onClose} locale={locale} />
    </div>
  )
}

// Direct L1 columns (when showL1sDirectly is true)
function DirectL1Columns({ content, getName, onClose, locale, activeCategory }: EbayStyleMenuProps) {
  return (
    <>
      {Array.from({ length: content.columns }, (_, colIndex) => {
        const columnL1s = content.featuredL1s.slice(colIndex * content.maxItems, (colIndex + 1) * content.maxItems)
        const header = content.columnHeaders?.[colIndex]

        return (
          <div key={colIndex} className="flex flex-col">
            {header && (
              <span className="text-sm font-bold text-foreground mb-3">
                {locale === "bg" ? header.titleBg : header.title}
              </span>
            )}
            <ul className="space-y-1.5 flex-1" role="menu">
              {columnL1s.map((l1) => (
                <li key={l1.id} role="none">
                  <Link
                    href={`/categories/${l1.slug}`}
                    onClick={onClose}
                    className="text-sm text-muted-foreground hover:underline block"
                    role="menuitem"
                  >
                    {getName(l1)}
                  </Link>
                </li>
              ))}
              <li role="none">
                <Link
                  href={`/categories/${activeCategory.slug}?sort=deals`}
                  onClick={onClose}
                  className="text-sm text-destructive hover:underline block font-medium"
                  role="menuitem"
                >
                  {locale === "bg" ? "Топ оферти" : "Top Deals"}
                </Link>
              </li>
            </ul>
            {colIndex === 0 && (
              <Link
                href={`/categories/${activeCategory.slug}`}
                onClick={onClose}
                className="text-sm text-brand hover:underline font-medium inline-flex items-center gap-1 mt-3"
              >
                {locale === "bg" ? "Виж всички" : "See all"}
                <CaretRight size={12} weight="bold" aria-hidden="true" />
              </Link>
            )}
          </div>
        )
      })}
    </>
  )
}

// Featured L1 columns with L2 children
function FeaturedL1Columns({ content, getName, onClose, locale, activeCategory: _activeCategory }: EbayStyleMenuProps) {
  return (
    <>
      {content.featuredL1s.map((l1Category, index) => (
        <div key={l1Category.id} className="flex flex-col">
          <Link
            href={`/categories/${l1Category.slug}`}
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:underline mb-3 group"
          >
            {getName(l1Category)}
            <CaretRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100" aria-hidden="true" />
          </Link>

          <ul className="space-y-1.5 flex-1" role="menu">
            {l1Category.children && l1Category.children.length > 0 ? (
              <>
                {l1Category.children.slice(0, content.maxItems).map((l2) => (
                  <li key={l2.id} role="none">
                    <Link
                      href={`/categories/${l2.slug}`}
                      onClick={onClose}
                      className="text-sm text-muted-foreground hover:underline block"
                      role="menuitem"
                    >
                      {getName(l2)}
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              <>
                {content.otherL1s.slice(index * content.maxItems, (index + 1) * content.maxItems).map((otherL1) => (
                  <li key={otherL1.id} role="none">
                    <Link
                      href={`/categories/${otherL1.slug}`}
                      onClick={onClose}
                      className="text-sm text-muted-foreground hover:underline block"
                      role="menuitem"
                    >
                      {getName(otherL1)}
                    </Link>
                  </li>
                ))}
              </>
            )}
            <li role="none">
              <Link
                href={`/categories/${l1Category.slug}?sort=deals`}
                onClick={onClose}
                className="text-sm text-destructive hover:underline block font-medium"
                role="menuitem"
              >
                {locale === "bg" ? "Топ оферти" : "Top Deals"}
              </Link>
            </li>
          </ul>

          <Link
            href={`/categories/${l1Category.slug}`}
            onClick={onClose}
            className="text-sm text-brand hover:underline font-medium inline-flex items-center gap-1 mt-3"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
            <CaretRight size={12} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      ))}
    </>
  )
}

// Banner CTA component
interface BannerCTAProps {
  banner: { href: string; image: string; title: string; titleBg: string; subtitle: string; subtitleBg: string; cta: string; ctaBg: string }
  columns: number
  onClose: () => void
  locale: string
}

function BannerCTA({ banner, columns, onClose, locale }: BannerCTAProps) {
  return (
    <Link
      href={banner.href}
      onClick={onClose}
      className={cn("relative rounded-md overflow-hidden group", columns === 3 ? "w-2/5" : "w-1/2")}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner.image})` }} />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="relative z-10 h-full flex flex-col justify-center p-4 text-primary-foreground">
        <h3 className="text-2xl font-bold mb-2">{locale === "bg" ? banner.titleBg : banner.title}</h3>
        <p className="text-primary-foreground/80 text-sm mb-4 max-w-xs">{locale === "bg" ? banner.subtitleBg : banner.subtitle}</p>
        <div className="inline-flex items-center gap-2 bg-brand text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium w-fit">
          {locale === "bg" ? banner.ctaBg : banner.cta}
          <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}

// Simple grid menu fallback
interface SimpleGridMenuProps {
  content: { columns: Category[][] }
  getName: (cat: Category) => string
  onClose: () => void
}

function SimpleGridMenu({ content, getName, onClose }: SimpleGridMenuProps) {
  const colCount = content.columns.length

  return (
    <div
      className={cn(
        "grid gap-4",
        colCount === 1 && "grid-cols-1",
        colCount === 2 && "grid-cols-2",
        colCount === 3 && "grid-cols-3",
        colCount >= 4 && "grid-cols-4"
      )}
    >
      {content.columns.map((column, colIndex) => (
        <ul key={colIndex} className="space-y-2" role="menu">
          {column.map((l1Category) => (
            <li key={l1Category.id} role="none">
              <Link
                href={`/categories/${l1Category.slug}`}
                onClick={onClose}
                className="flex items-center gap-2 text-sm text-foreground hover:text-brand py-1 group"
                role="menuitem"
              >
                <span className="text-muted-foreground group-hover:text-brand" aria-hidden="true">
                  {getCategoryIcon(l1Category.slug)}
                </span>
                {getName(l1Category)}
                {l1Category.children && l1Category.children.length > 0 && (
                  <span className="text-xs text-muted-foreground">({l1Category.children.length})</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

// More categories grid
interface MoreCategoriesGridProps {
  categories: Category[]
  getName: (cat: Category) => string
  onClose: () => void
  locale: string
}

function MoreCategoriesGrid({ categories, getName, onClose, locale }: MoreCategoriesGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4" role="menu">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          onClick={onClose}
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/50 group border border-transparent hover:border-border"
          role="menuitem"
        >
          <span className="text-muted-foreground group-hover:text-brand" aria-hidden="true">
            {getCategoryIcon(cat.slug)}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground group-hover:text-brand block truncate">
              {getName(cat)}
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
  )
}
