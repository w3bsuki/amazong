"use client"

import * as React from "react"
import { useState, useCallback, useMemo, useRef } from "react"
import { CaretDown, CaretRight, ArrowRight } from "@phosphor-icons/react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { getCategoryIcon } from "@/config/category-icons"
import { MEGA_MENU_CONFIG, MAX_MENU_ITEMS, MAX_VISIBLE_CATEGORIES } from "@/config/mega-menu-config"
import { useCategoriesCache, getCategoryName, type Category } from "@/hooks/use-categories-cache"

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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getName = useCallback((cat: Category) => getCategoryName(cat, locale), [locale])

  const handleMouseEnter = useCallback((category: Category) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveCategory(category)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveCategory(null), 150)
  }, [])

  const closeMenu = useCallback(() => setActiveCategory(null), [])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Compute visible categories and "more" overflow
  const maxVisible = locale === "bg" ? MAX_VISIBLE_CATEGORIES : MAX_VISIBLE_CATEGORIES - 1
  const visibleCategories = categories.slice(0, maxVisible)
  const moreCategories = categories.slice(maxVisible)
  const showMoreButton = categories.length > maxVisible

  const moreCategoryVirtual: Category = {
    id: "more-categories",
    name: "View All",
    name_bg: "Всички",
    slug: "more",
    children: moreCategories,
  }

  if (isLoading) {
    return <CategorySubheaderSkeleton />
  }

  return (
    <>
      <NavigationMenu className="w-full" viewport={false}>
        <NavigationMenuList className="flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar justify-start">
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

          {showMoreButton && (
            <NavigationMenuItem
              className="shrink-0"
              onMouseEnter={() => handleMouseEnter(moreCategoryVirtual)}
              onMouseLeave={handleMouseLeave}
            >
              <NavigationMenuTrigger
                className={cn(
                  "flex items-center gap-1 px-2.5 py-2.5 text-sm font-medium bg-transparent hover:bg-transparent",
                  "text-foreground hover:text-brand hover:underline data-[state=open]:bg-transparent",
                  activeCategory?.id === "more-categories" && "text-brand"
                )}
              >
                <span>{locale === "bg" ? "Всички" : "View All"}</span>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mega Menu Panel */}
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
    </>
  )
}

// Skeleton loading state
function CategorySubheaderSkeleton() {
  return (
    <div className="flex items-center gap-1 h-10 px-2" role="status" aria-label="Loading categories">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-4 w-20 bg-muted animate-pulse rounded" />
      ))}
    </div>
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
    <NavigationMenuItem
      className="shrink-0"
      onMouseEnter={() => onMouseEnter(category)}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "flex items-center gap-1 px-2 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
          "text-foreground hover:text-brand hover:underline",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          isActive && "text-brand"
        )}
        aria-expanded={hasChildren ? isActive : undefined}
        aria-haspopup={hasChildren ? "menu" : undefined}
      >
        <span>{getName(category)}</span>
        {hasChildren && (
          <CaretDown
            size={10}
            weight="fill"
            className={cn("transition-transform duration-200 opacity-60", isActive && "rotate-180")}
            aria-hidden="true"
          />
        )}
      </Link>
    </NavigationMenuItem>
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
        className="fixed left-0 right-0 z-50 bg-popover border-b border-border shadow-lg"
        style={{ top: `${headerHeight}px` }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role="menu"
        aria-label={getName(activeCategory)}
      >
        <div className="container py-6 max-h-[70vh] overflow-y-auto">
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
        className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-150"
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
        columnHeaders: menuConfig.columnHeaders,
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
    <div className="flex gap-6 items-stretch">
      {/* Category columns */}
      <div className={cn("grid gap-6", content.columns === 3 ? "w-3/5 grid-cols-3" : "w-1/2 grid-cols-2")}>
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
                    className="text-sm text-muted-foreground hover:underline transition-colors block"
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
                  className="text-sm text-destructive hover:underline transition-colors block font-medium"
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
                className="text-sm text-brand hover:underline font-medium transition-colors inline-flex items-center gap-1 mt-3"
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
            className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:underline transition-colors mb-3 group"
          >
            {getName(l1Category)}
            <CaretRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </Link>

          <ul className="space-y-1.5 flex-1" role="menu">
            {l1Category.children && l1Category.children.length > 0 ? (
              <>
                {l1Category.children.slice(0, content.maxItems).map((l2) => (
                  <li key={l2.id} role="none">
                    <Link
                      href={`/categories/${l2.slug}`}
                      onClick={onClose}
                      className="text-sm text-muted-foreground hover:underline transition-colors block"
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
                      className="text-sm text-muted-foreground hover:underline transition-colors block"
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
                className="text-sm text-destructive hover:underline transition-colors block font-medium"
                role="menuitem"
              >
                {locale === "bg" ? "Топ оферти" : "Top Deals"}
              </Link>
            </li>
          </ul>

          <Link
            href={`/categories/${l1Category.slug}`}
            onClick={onClose}
            className="text-sm text-brand hover:underline font-medium transition-colors inline-flex items-center gap-1 mt-3"
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
      className={cn("relative rounded-xl overflow-hidden group", columns === 3 ? "w-2/5" : "w-1/2")}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner.image})` }} />
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">{locale === "bg" ? banner.titleBg : banner.title}</h3>
        <p className="text-white/80 text-sm mb-4 max-w-xs">{locale === "bg" ? banner.subtitleBg : banner.subtitle}</p>
        <div className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium w-fit group-hover:bg-brand/90 transition-colors">
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
        "grid gap-8",
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
                className="flex items-center gap-2 text-sm text-foreground hover:text-brand transition-colors py-1 group"
                role="menuitem"
              >
                <span className="text-muted-foreground group-hover:text-brand transition-colors" aria-hidden="true">
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
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors group border border-transparent hover:border-border"
          role="menuitem"
        >
          <span className="text-muted-foreground group-hover:text-brand transition-colors" aria-hidden="true">
            {getCategoryIcon(cat.slug)}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors block truncate">
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
