"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { DotsThree } from "@/lib/icons/phosphor"
import { useTranslations } from "next-intl"

import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/types/products"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/components/shared/category/category-icons"
import { MobileProductCard } from "@/components/shared/product/card/mobile"

// =============================================================================
// Types
// =============================================================================

/** Discovery-mode pills shown when "All" tab is active */
type DiscoveryMode = "newest" | "promoted" | "nearby" | "forYou"

const DISCOVERY_MODES: readonly {
  key: DiscoveryMode
  labelBg: string
  labelEn: string
}[] = [
  { key: "newest", labelBg: "Нови", labelEn: "New" },
  { key: "promoted", labelBg: "Промо", labelEn: "Promo" },
  { key: "nearby", labelBg: "Близо", labelEn: "Nearby" },
  { key: "forYou", labelBg: "За теб", labelEn: "For you" },
]

interface DemoV3HomeProps {
  locale: string
  categories: CategoryTreeNode[]
  newestProducts: UIProduct[]
  promotedProducts: UIProduct[]
  nearbyProducts: UIProduct[]
  forYouProducts: UIProduct[]
  /** Pre-loaded products keyed by category slug */
  categoryProducts: Record<string, UIProduct[]>
}

// =============================================================================
// Product card renderer
// =============================================================================

function renderCard(product: UIProduct, index: number) {
  return (
    <MobileProductCard
      key={`${product.id}-${index}`}
      id={product.id}
      title={product.title}
      price={product.price}
      createdAt={product.createdAt ?? null}
      originalPrice={product.listPrice ?? null}
      image={product.image}
      rating={product.rating}
      reviews={product.reviews}
      {...(product.freeShipping === true ? { freeShipping: true } : {})}
      {...(product.isBoosted ? { isBoosted: true } : {})}
      {...(product.boostExpiresAt ? { boostExpiresAt: product.boostExpiresAt } : {})}
      index={index}
      slug={product.slug ?? null}
      username={product.storeSlug ?? null}
      sellerId={product.sellerId ?? null}
      {...(product.sellerName || product.storeSlug
        ? { sellerName: product.sellerName || product.storeSlug || "" }
        : {})}
      sellerAvatarUrl={product.sellerAvatarUrl || null}
      sellerTier={product.sellerTier ?? "basic"}
      sellerVerified={Boolean(product.sellerVerified)}
      {...(product.condition ? { condition: product.condition } : {})}
      {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
      {...(product.location ? { location: product.location } : {})}
      titleLines={1}
      layout="feed"
      showWishlistAction={false}
    />
  )
}

// =============================================================================
// Pill styles
// =============================================================================

const PILL_BASE =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border min-h-(--control-compact) px-2.5 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const PILL_INACTIVE = "border-border-subtle bg-surface-subtle text-muted-foreground font-medium"
const PILL_ACTIVE = "border-foreground bg-foreground text-background font-semibold"

function pillClass(active: boolean) {
  return cn(PILL_BASE, active ? PILL_ACTIVE : PILL_INACTIVE)
}

// =============================================================================
// Component
// =============================================================================

export function DemoV3Home({
  locale,
  categories,
  newestProducts,
  promotedProducts,
  nearbyProducts,
  forYouProducts,
  categoryProducts,
}: DemoV3HomeProps) {
  const tMobile = useTranslations("Home.mobile")
  const tCategories = useTranslations("Categories")

  // ── State ──

  /** null = "All" tab, otherwise a category slug */
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  /** Active discovery mode (used when "All" tab is active) */
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("newest")
  /** Active subcategory slug (used when a category tab is active) */
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)

  const pillsRef = useRef<HTMLDivElement>(null)

  // ── Derived ──

  const visibleCategories = useMemo(() => categories.slice(0, 7), [categories])

  /** Products for the current view */
  const displayProducts = useMemo(() => {
    // "All" tab — discovery modes
    if (activeCategory === null) {
      switch (discoveryMode) {
        case "promoted":
          return promotedProducts
        case "nearby":
          return nearbyProducts
        case "forYou":
          return forYouProducts
        default:
          return newestProducts
      }
    }

    // Category tab — filter by subcategory if selected
    const pool = categoryProducts[activeCategory] ?? newestProducts
    if (!activeSubcategory) return pool

    return pool.filter((product) => {
      if (Array.isArray(product.categoryPath)) {
        return product.categoryPath.some((cat) => cat.slug === activeSubcategory)
      }
      return product.categorySlug === activeSubcategory
    })
  }, [
    activeCategory,
    activeSubcategory,
    categoryProducts,
    discoveryMode,
    forYouProducts,
    nearbyProducts,
    newestProducts,
    promotedProducts,
  ])

  /** Subcategories of the active L0 category */
  const subcategories = useMemo(() => {
    if (activeCategory === null) return []
    const cat = categories.find((c) => c.slug === activeCategory)
    return cat?.children ?? []
  }, [activeCategory, categories])

  // ── Handlers ──

  const handleCategoryTab = useCallback((slug: string | null) => {
    setActiveCategory(slug)
    setActiveSubcategory(null)
    if (slug === null) {
      setDiscoveryMode("newest")
    }
    pillsRef.current?.scrollTo({ left: 0, behavior: "smooth" })
  }, [])

  const handleDiscoveryPill = useCallback((mode: DiscoveryMode) => {
    setDiscoveryMode(mode)
  }, [])

  const handleSubcategoryPill = useCallback((slug: string | null) => {
    setActiveSubcategory((prev) => (prev === slug ? null : slug))
  }, [])

  // ── Render ──

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
      <h1 className="sr-only">Treido</h1>

      {/* ═══ L0 CATEGORY TABS ═══ */}
      <nav
        className="sticky top-(--app-header-offset) z-30 bg-background"
        role="tablist"
        aria-label={locale === "bg" ? "Категории" : "Categories"}
      >
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex w-max min-w-full">
            {/* "All" tab */}
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === null}
              onClick={() => handleCategoryTab(null)}
              className={cn(
                "relative flex min-h-(--control-default) items-center gap-1.5 px-3.5 text-xs tap-transparent",
                "transition-colors duration-fast ease-smooth",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
                activeCategory === null
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground"
              )}
            >
              {getCategoryIcon("categories", {
                size: 16,
                weight: activeCategory === null ? "fill" : "regular",
                className: "shrink-0",
              })}
              <span>{tCategories("all")}</span>
              {activeCategory === null && (
                <span
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                  aria-hidden="true"
                />
              )}
            </button>

            {/* L0 categories */}
            {visibleCategories.map((cat) => {
              const isActive = activeCategory === cat.slug
              const label = getCategoryName(cat, locale)
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryTab(cat.slug)}
                  className={cn(
                    "relative flex min-h-(--control-default) items-center gap-1.5 px-3.5 text-xs tap-transparent",
                    "transition-colors duration-fast ease-smooth",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
                    isActive
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground"
                  )}
                >
                  {getCategoryIcon(cat.slug, {
                    size: 16,
                    weight: isActive ? "fill" : "regular",
                    className: "shrink-0",
                  })}
                  <span className="whitespace-nowrap">{label}</span>
                  {isActive && (
                    <span
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}

            {/* "More" overflow */}
            {categories.length > visibleCategories.length && (
              <button
                type="button"
                role="tab"
                aria-selected={false}
                aria-label={locale === "bg" ? "Още категории" : "More categories"}
                className={cn(
                  "relative flex min-h-(--control-default) items-center gap-1 px-3 text-xs font-medium text-muted-foreground tap-transparent",
                  "transition-colors duration-fast ease-smooth",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset"
                )}
              >
                <DotsThree size={18} weight="bold" className="shrink-0" />
              </button>
            )}
          </div>
        </div>
        <div className="h-px bg-border-subtle" aria-hidden="true" />
      </nav>

      {/* ═══ CONTEXT PILLS ═══ */}
      <div ref={pillsRef} className="overflow-x-auto no-scrollbar bg-background">
        <div className="flex w-max items-center gap-1.5 px-3 py-2">
          {activeCategory === null ? (
            /* Discovery mode pills */
            DISCOVERY_MODES.map((mode) => {
              const isActive = discoveryMode === mode.key
              return (
                <button
                  key={mode.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleDiscoveryPill(mode.key)}
                  className={pillClass(isActive)}
                >
                  {locale === "bg" ? mode.labelBg : mode.labelEn}
                </button>
              )
            })
          ) : (
            /* Subcategory pills */
            <>
              <button
                type="button"
                aria-pressed={activeSubcategory === null}
                onClick={() => handleSubcategoryPill(null)}
                className={pillClass(activeSubcategory === null)}
              >
                {tCategories("all")}
              </button>
              {subcategories.map((sub) => {
                const isActive = activeSubcategory === sub.slug
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleSubcategoryPill(sub.slug)}
                    className={pillClass(isActive)}
                  >
                    {getCategoryName(sub, locale)}
                  </button>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* ═══ PRODUCT GRID ═══ */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 px-2 pb-4 pt-1">
          {displayProducts.map((product, index) => renderCard(product, index))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <p className="text-sm text-muted-foreground">
            {tMobile("feed.empty.all")}
          </p>
        </div>
      )}
    </div>
  )
}
