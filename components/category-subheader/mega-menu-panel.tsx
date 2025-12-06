/**
 * MegaMenuPanel Component
 * 
 * Renders the dropdown panel for category mega menus.
 * Supports both eBay-style (featured L1s with L2 children) and simple grid layouts.
 */

"use client"

import * as React from "react"
import { useMemo } from "react"
import { Link } from "@/i18n/routing"
import { CaretRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { MegaMenuBanner } from "./mega-menu-banner"
import { getSubheaderIcon } from "@/lib/category-icons"
import { 
  MEGA_MENU_CONFIG, 
  MAX_MENU_ITEMS, 
  type MegaMenuConfig 
} from "@/config/mega-menu-config"
import type { Category } from "@/hooks/use-categories-cache"

interface MegaMenuPanelProps {
  activeCategory: Category
  locale: string
  onNavigate?: () => void
}

interface EbayLayoutContent {
  type: 'ebay'
  featuredL1s: Category[]
  otherL1s: Category[]
  banner: MegaMenuConfig['banner']
  maxItems: number
  columns: 2 | 3
  showL1sDirectly: boolean
  columnHeaders?: { title: string; titleBg: string }[]
}

interface SimpleLayoutContent {
  type: 'simple'
  columns: Category[][]
}

type MenuContent = EbayLayoutContent | SimpleLayoutContent | null

export function MegaMenuPanel({ 
  activeCategory, 
  locale, 
  onNavigate 
}: MegaMenuPanelProps) {
  // Calculate menu layout based on config
  const menuContent = useMemo<MenuContent>(() => {
    if (!activeCategory?.children?.length) return null
    if (activeCategory.id === "more-categories") return null

    const children = activeCategory.children
    const config = MEGA_MENU_CONFIG[activeCategory.slug]
    
    if (config) {
      // eBay-style layout
      const featuredL1s = config.featured
        .map(slug => children.find(c => c.slug === slug))
        .filter((c): c is Category => c !== undefined)
      
      const otherL1s = children.filter(c => !config.featured.includes(c.slug))

      return { 
        type: 'ebay',
        featuredL1s,
        otherL1s,
        banner: config.banner,
        maxItems: config.maxItems || MAX_MENU_ITEMS,
        columns: config.columns || 2,
        showL1sDirectly: config.showL1sDirectly || false,
        columnHeaders: config.columnHeaders
      }
    } else {
      // Simple 4-column layout
      const itemsPerColumn = Math.ceil(children.length / 4)
      const columns: Category[][] = []
      
      for (let i = 0; i < children.length; i += itemsPerColumn) {
        columns.push(children.slice(i, i + itemsPerColumn))
      }

      return { type: 'simple', columns }
    }
  }, [activeCategory])

  if (!menuContent) return null

  return (
    <>
      {menuContent.type === 'ebay' ? (
        <EbayLayout 
          content={menuContent}
          activeCategory={activeCategory}
          locale={locale}
          onNavigate={onNavigate}
        />
      ) : (
        <SimpleLayout 
          content={menuContent}
          locale={locale}
          onNavigate={onNavigate}
        />
      )}
    </>
  )
}

// ============================================
// eBay-style Layout (columns + banner)
// ============================================

interface EbayLayoutProps {
  content: EbayLayoutContent
  activeCategory: Category
  locale: string
  onNavigate?: () => void
}

function EbayLayout({ content, activeCategory, locale, onNavigate }: EbayLayoutProps) {
  const getCategoryName = (cat: Category) => 
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name

  return (
    <div className="flex gap-6 items-stretch">
      {/* Left side - category columns */}
      <div className={cn(
        "grid gap-6",
        content.columns === 3 ? "w-3/5 grid-cols-3" : "w-1/2 grid-cols-2"
      )}>
        {content.showL1sDirectly ? (
          // Show L1 categories directly with custom headers
          <L1DirectColumns 
            content={content}
            activeCategory={activeCategory}
            locale={locale}
            onNavigate={onNavigate}
          />
        ) : (
          // Featured L1 columns with L2 children
          content.featuredL1s.map((l1Category, index) => (
            <FeaturedL1Column 
              key={l1Category.id}
              l1Category={l1Category}
              otherL1s={content.otherL1s}
              activeCategory={activeCategory}
              maxItems={content.maxItems}
              columnIndex={index}
              locale={locale}
              onNavigate={onNavigate}
              getCategoryName={getCategoryName}
            />
          ))
        )}
      </div>

      {/* Right side - Banner CTA */}
      <MegaMenuBanner 
        banner={content.banner}
        locale={locale}
        columns={content.columns}
        onNavigate={onNavigate}
      />
    </div>
  )
}

// L1 Direct columns (when showL1sDirectly is true)
interface L1DirectColumnsProps {
  content: EbayLayoutContent
  activeCategory: Category
  locale: string
  onNavigate?: () => void
}

function L1DirectColumns({ content, activeCategory, locale, onNavigate }: L1DirectColumnsProps) {
  const getCategoryName = (cat: Category) => 
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name

  return (
    <>
      {Array.from({ length: content.columns }, (_, colIndex) => {
        const maxItems = content.maxItems
        const columnL1s = content.featuredL1s.slice(
          colIndex * maxItems, 
          (colIndex + 1) * maxItems
        )
        const header = content.columnHeaders?.[colIndex]
        
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
                    onClick={onNavigate}
                    className="text-sm text-muted-foreground hover:underline transition-colors block"
                  >
                    {getCategoryName(l1)}
                  </Link>
                </li>
              ))}
              {/* Top Deals row */}
              <li>
                <Link
                  href={`/categories/${activeCategory.slug}?sort=deals`}
                  onClick={onNavigate}
                  className="text-sm text-destructive hover:underline transition-colors block font-medium"
                >
                  {locale === "bg" ? "Топ оферти" : "Top Deals"}
                </Link>
              </li>
            </ul>
            
            {/* "See all" at bottom of first column only */}
            {colIndex === 0 && (
              <Link
                href={`/categories/${activeCategory.slug}`}
                onClick={onNavigate}
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
  )
}

// Featured L1 Column with L2 children
interface FeaturedL1ColumnProps {
  l1Category: Category
  otherL1s: Category[]
  activeCategory: Category
  maxItems: number
  columnIndex: number
  locale: string
  onNavigate?: () => void
  getCategoryName: (cat: Category) => string
}

function FeaturedL1Column({ 
  l1Category, 
  otherL1s, 
  activeCategory,
  maxItems, 
  columnIndex, 
  locale, 
  onNavigate,
  getCategoryName 
}: FeaturedL1ColumnProps) {
  return (
    <div className="flex flex-col">
      {/* L1 Header */}
      <Link
        href={`/categories/${l1Category.slug}`}
        onClick={onNavigate}
        className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:underline transition-colors mb-3 group"
      >
        {getCategoryName(l1Category)}
        <CaretRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
      
      {/* L2 Children or fallback to other L1s */}
      {l1Category.children && l1Category.children.length > 0 ? (
        <ul className="space-y-1.5 flex-1">
          {l1Category.children.slice(0, maxItems).map((l2) => (
            <li key={l2.id}>
              <Link
                href={`/categories/${l2.slug}`}
                onClick={onNavigate}
                className="text-sm text-muted-foreground hover:underline transition-colors block"
              >
                {getCategoryName(l2)}
              </Link>
            </li>
          ))}
          {/* Top Deals row */}
          <li>
            <Link
              href={`/categories/${l1Category.slug}?sort=deals`}
              onClick={onNavigate}
              className="text-sm text-destructive hover:underline transition-colors block font-medium"
            >
              {locale === "bg" ? "Топ оферти" : "Top Deals"}
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="space-y-1.5 flex-1">
          {otherL1s.slice(columnIndex * maxItems, (columnIndex + 1) * maxItems).map((otherL1) => (
            <li key={otherL1.id}>
              <Link
                href={`/categories/${otherL1.slug}`}
                onClick={onNavigate}
                className="text-sm text-muted-foreground hover:underline transition-colors block"
              >
                {getCategoryName(otherL1)}
              </Link>
            </li>
          ))}
          {/* Top Deals row */}
          <li>
            <Link
              href={`/categories/${activeCategory.slug}?sort=deals`}
              onClick={onNavigate}
              className="text-sm text-destructive hover:underline transition-colors block font-medium"
            >
              {locale === "bg" ? "Топ оферти" : "Top Deals"}
            </Link>
          </li>
        </ul>
      )}
      
      {/* See all link */}
      <Link
        href={`/categories/${l1Category.slug}`}
        onClick={onNavigate}
        className="text-sm text-brand hover:underline font-medium transition-colors inline-flex items-center gap-1 mt-3"
      >
        {locale === "bg" ? "Виж всички" : "See all"}
        <CaretRight size={12} weight="bold" />
      </Link>
    </div>
  )
}

// ============================================
// Simple Grid Layout (fallback)
// ============================================

interface SimpleLayoutProps {
  content: SimpleLayoutContent
  locale: string
  onNavigate?: () => void
}

function SimpleLayout({ content, locale, onNavigate }: SimpleLayoutProps) {
  const getCategoryName = (cat: Category) => 
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name

  return (
    <div className={cn(
      "grid gap-8",
      content.columns.length === 1 && "grid-cols-1",
      content.columns.length === 2 && "grid-cols-2",
      content.columns.length === 3 && "grid-cols-3",
      content.columns.length >= 4 && "grid-cols-4"
    )}>
      {content.columns.map((column, colIndex) => (
        <div key={colIndex}>
          <ul className="space-y-2">
            {column.map((l1Category) => (
              <li key={l1Category.id}>
                <Link
                  href={`/categories/${l1Category.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-brand transition-colors py-1 group"
                >
                  <span className="text-muted-foreground group-hover:text-brand transition-colors">
                    {getSubheaderIcon(l1Category.slug)}
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
  )
}
