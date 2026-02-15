"use client"

import { useCallback, useMemo, useState } from "react"
import { CaretRight, DotsThree } from "@/lib/icons/phosphor"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/types/products"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { getCategoryIcon } from "@/components/shared/category/category-icons"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// =============================================================================
// Types
// =============================================================================

type DiscoveryScope = "forYou" | "newest" | "promoted" | "nearby" | "deals"

const DISCOVERY_SCOPES: readonly {
  key: DiscoveryScope
  labelBg: string
  labelEn: string
}[] = [
  { key: "forYou", labelBg: "За теб", labelEn: "For you" },
  { key: "newest", labelBg: "Нови", labelEn: "New" },
  { key: "promoted", labelBg: "Промо", labelEn: "Promo" },
  { key: "nearby", labelBg: "Близо", labelEn: "Nearby" },
  { key: "deals", labelBg: "Оферти", labelEn: "Deals" },
]

interface DemoV4HomeProps {
  locale: string
  categories: CategoryTreeNode[]
  newestProducts: UIProduct[]
  promotedProducts: UIProduct[]
  nearbyProducts: UIProduct[]
  dealsProducts: UIProduct[]
  forYouProducts: UIProduct[]
  categoryProducts: Record<string, UIProduct[]>
}

// =============================================================================
// Config
// =============================================================================

const MAX_VISIBLE_CATEGORY_TABS = 5
const QUICK_JUMP_CATEGORY_LIMIT = 4
const SECONDARY_RAIL_TOP = "calc(var(--app-header-offset) + var(--control-default))"

const PRIMARY_TAB_BASE_CLASS =
  "relative inline-flex min-h-(--control-default) items-center gap-1.5 px-3 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset"
const PRIMARY_TAB_ACTIVE_CLASS = "font-semibold text-foreground"
const PRIMARY_TAB_INACTIVE_CLASS = "font-medium text-muted-foreground"

const PILL_BASE_CLASS =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border min-h-(--control-compact) px-2.5 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const PILL_ACTIVE_CLASS = "border-foreground bg-foreground text-background font-semibold"
const PILL_INACTIVE_CLASS =
  "border-border-subtle bg-surface-subtle text-muted-foreground font-medium"

const ACTION_CHIP_CLASS =
  "inline-flex shrink-0 min-h-(--control-compact) items-center gap-1 rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

// =============================================================================
// Helpers
// =============================================================================

function getPrimaryTabClass(active: boolean): string {
  return cn(
    PRIMARY_TAB_BASE_CLASS,
    active ? PRIMARY_TAB_ACTIVE_CLASS : PRIMARY_TAB_INACTIVE_CLASS
  )
}

function getPillClass(active: boolean): string {
  return cn(PILL_BASE_CLASS, active ? PILL_ACTIVE_CLASS : PILL_INACTIVE_CLASS)
}

function productMatchesSlug(product: UIProduct, slug: string): boolean {
  if (product.categorySlug === slug) return true
  if (product.categoryRootSlug === slug) return true
  if (Array.isArray(product.categoryPath)) {
    return product.categoryPath.some((category) => category.slug === slug)
  }
  return false
}

function renderProductCard(product: UIProduct, index: number) {
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
// Component
// =============================================================================

export function DemoV4Home({
  locale,
  categories,
  newestProducts,
  promotedProducts,
  nearbyProducts,
  dealsProducts,
  forYouProducts,
  categoryProducts,
}: DemoV4HomeProps) {
  const tMobile = useTranslations("Home.mobile")
  const tCategories = useTranslations("Categories")

  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)
  const [activeScope, setActiveScope] = useState<DiscoveryScope>("forYou")
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState<string | null>(null)
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false)

  const visibleCategoryTabs = useMemo(
    () => categories.slice(0, MAX_VISIBLE_CATEGORY_TABS),
    [categories]
  )
  const overflowCategories = useMemo(
    () => categories.slice(MAX_VISIBLE_CATEGORY_TABS),
    [categories]
  )
  const quickJumpCategories = useMemo(
    () => categories.slice(0, QUICK_JUMP_CATEGORY_LIMIT),
    [categories]
  )

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug) ?? null,
    [activeCategorySlug, categories]
  )
  const activeSubcategories = activeCategory?.children ?? []
  const activeSubcategory = activeSubcategories.find((sub) => sub.slug === activeSubcategorySlug) ?? null

  const productsByScope = useMemo(
    () => ({
      forYou: forYouProducts,
      newest: newestProducts,
      promoted: promotedProducts,
      nearby: nearbyProducts,
      deals: dealsProducts,
    }),
    [dealsProducts, forYouProducts, nearbyProducts, newestProducts, promotedProducts]
  )

  const baseProducts = useMemo(() => {
    if (activeCategorySlug) {
      return categoryProducts[activeCategorySlug] ?? newestProducts
    }
    return productsByScope[activeScope]
  }, [activeCategorySlug, activeScope, categoryProducts, newestProducts, productsByScope])

  const displayProducts = useMemo(() => {
    if (!activeCategorySlug || !activeSubcategorySlug) return baseProducts
    return baseProducts.filter((product) => productMatchesSlug(product, activeSubcategorySlug))
  }, [activeCategorySlug, activeSubcategorySlug, baseProducts])

  const scopeLabel = useMemo(() => {
    const scopeMeta = DISCOVERY_SCOPES.find((scope) => scope.key === activeScope)
    if (!scopeMeta) return activeScope
    return locale === "bg" ? scopeMeta.labelBg : scopeMeta.labelEn
  }, [activeScope, locale])

  const contextTitle = useMemo(() => {
    if (activeSubcategory) return getCategoryName(activeSubcategory, locale)
    if (activeCategory) return getCategoryName(activeCategory, locale)
    return locale === "bg" ? `${scopeLabel} предложения` : `${scopeLabel} picks`
  }, [activeCategory, activeSubcategory, locale, scopeLabel])

  const contextEyebrow = activeCategory
    ? (locale === "bg" ? "Разглеждаш категория" : "Browsing category")
    : (locale === "bg" ? "Бързо откриване" : "Quick discovery")

  const fullBrowseHref = activeCategorySlug ? `/categories/${activeCategorySlug}` : "/categories"
  const fullBrowseLabel = activeCategorySlug
    ? (locale === "bg" ? "Пълна категория" : "Full category")
    : (locale === "bg" ? "Всички категории" : "All categories")

  const handlePrimaryTab = useCallback((slug: string | null) => {
    setActiveCategorySlug(slug)
    setActiveSubcategorySlug(null)
  }, [])

  const handleOverflowCategoryPick = useCallback((slug: string) => {
    setCategoryPickerOpen(false)
    setActiveCategorySlug(slug)
    setActiveSubcategorySlug(null)
  }, [])

  const handleQuickJump = useCallback((slug: string) => {
    setActiveCategorySlug(slug)
    setActiveSubcategorySlug(null)
  }, [])

  const handleSubcategoryPill = useCallback((slug: string | null) => {
    setActiveSubcategorySlug((previous) => (previous === slug ? null : slug))
  }, [])

  const openCategoriesLabel = locale === "bg" ? "Отвори категории" : "Open categories"
  const browseLabel = locale === "bg" ? "Преглед" : "Browse"
  const resetAllLabel = locale === "bg" ? "Всички обяви" : "All listings"
  const quickJumpLabel = locale === "bg" ? "Бърз достъп" : "Quick jump"
  const categoryPickerTitle = locale === "bg" ? "Още категории" : "More categories"
  const categoryPickerDescription =
    locale === "bg"
      ? "Избери категория за бързо разглеждане или отвори пълния каталог."
      : "Pick a category for quick browse or open the full directory."

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
      <h1 className="sr-only">Treido V4 Mobile Demo</h1>

      {/* Primary rail: L0 category tabs */}
      <nav
        className="sticky top-(--app-header-offset) z-30 border-b border-border-subtle bg-background"
        role="tablist"
        aria-label={locale === "bg" ? "Основни категории" : "Primary categories"}
      >
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex w-max min-w-full items-stretch">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategorySlug === null}
              onClick={() => handlePrimaryTab(null)}
              className={getPrimaryTabClass(activeCategorySlug === null)}
            >
              {getCategoryIcon("categories", {
                size: 16,
                weight: activeCategorySlug === null ? "fill" : "regular",
                className: "shrink-0",
              })}
              <span>{tCategories("all")}</span>
              {activeCategorySlug === null && (
                <span
                  className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                  aria-hidden="true"
                />
              )}
            </button>

            {visibleCategoryTabs.map((category) => {
              const active = activeCategorySlug === category.slug
              return (
                <button
                  key={category.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handlePrimaryTab(category.slug)}
                  className={getPrimaryTabClass(active)}
                >
                  {getCategoryIcon(category.slug, {
                    size: 16,
                    weight: active ? "fill" : "regular",
                    className: "shrink-0",
                  })}
                  <span className="whitespace-nowrap">{getCategoryName(category, locale)}</span>
                  {active && (
                    <span
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}

            {overflowCategories.length > 0 && (
              <button
                type="button"
                onClick={() => setCategoryPickerOpen(true)}
                aria-label={categoryPickerTitle}
                className={cn(
                  PRIMARY_TAB_BASE_CLASS,
                  PRIMARY_TAB_INACTIVE_CLASS,
                  "border-l border-border-subtle"
                )}
              >
                <DotsThree size={18} weight="bold" className="shrink-0" />
                <span>{locale === "bg" ? "Още" : "More"}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Secondary rail: context pills (scope OR subcategories) */}
      <section
        className="sticky z-20 border-b border-border-subtle bg-surface-glass backdrop-blur-sm"
        style={{ top: SECONDARY_RAIL_TOP }}
      >
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex w-max items-center gap-1.5 px-3 py-2">
            {activeCategorySlug === null ? (
              <>
                {DISCOVERY_SCOPES.map((scope) => {
                  const active = activeScope === scope.key
                  return (
                    <button
                      key={scope.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveScope(scope.key)}
                      className={getPillClass(active)}
                    >
                      {locale === "bg" ? scope.labelBg : scope.labelEn}
                    </button>
                  )
                })}

                <div aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-border-subtle" />

                <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {quickJumpLabel}
                </span>
                {quickJumpCategories.map((category) => (
                  <button
                    key={`jump-${category.slug}`}
                    type="button"
                    onClick={() => handleQuickJump(category.slug)}
                    className={getPillClass(false)}
                  >
                    {getCategoryName(category, locale)}
                  </button>
                ))}
              </>
            ) : (
              <>
                <button
                  type="button"
                  aria-pressed={activeSubcategorySlug === null}
                  onClick={() => handleSubcategoryPill(null)}
                  className={getPillClass(activeSubcategorySlug === null)}
                >
                  {tCategories("all")}
                </button>
                {activeSubcategories.map((subcategory) => {
                  const active = activeSubcategorySlug === subcategory.slug
                  return (
                    <button
                      key={subcategory.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleSubcategoryPill(subcategory.slug)}
                      className={getPillClass(active)}
                    >
                      {getCategoryName(subcategory, locale)}
                    </button>
                  )
                })}
              </>
            )}

            <div aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-border-subtle" />

            <Link href={fullBrowseHref} className={ACTION_CHIP_CLASS}>
              <span>{fullBrowseLabel}</span>
              <CaretRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Context banner keeps intent clear: quick feed vs full browse */}
      <section className="px-3 pt-2">
        <div className="rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2.5">
          <p className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
            {contextEyebrow}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <h2 className="min-w-0 truncate text-sm font-semibold text-foreground">{contextTitle}</h2>
            <Link href={fullBrowseHref} className={ACTION_CHIP_CLASS}>
              <span>{browseLabel}</span>
              <CaretRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Product feed */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-(--spacing-home-card-gap) px-2 pb-4 pt-2">
          {displayProducts.map((product, index) => renderProductCard(product, index))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-14">
          <p className="text-sm text-muted-foreground">{tMobile("feed.empty.all")}</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategorySlug(null)
              setActiveSubcategorySlug(null)
            }}
            className="mt-3 inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-surface-subtle px-3 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
          >
            {resetAllLabel}
          </button>
        </div>
      )}

      {/* Category picker: working replacement for inert "More" tab */}
      <Sheet open={categoryPickerOpen} onOpenChange={setCategoryPickerOpen}>
        <SheetContent side="bottom" className="max-h-dialog overflow-hidden rounded-t-2xl p-0">
          <SheetHeader className="border-b border-border-subtle px-4 pr-14">
            <SheetTitle>{categoryPickerTitle}</SheetTitle>
            <SheetDescription>{categoryPickerDescription}</SheetDescription>
          </SheetHeader>

          <div className="overflow-y-auto px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategoryPickerOpen(false)
                  setActiveCategorySlug(null)
                  setActiveSubcategorySlug(null)
                }}
                className={ACTION_CHIP_CLASS}
              >
                {resetAllLabel}
              </button>
              <Link
                href="/categories"
                onClick={() => setCategoryPickerOpen(false)}
                className={ACTION_CHIP_CLASS}
              >
                {openCategoriesLabel}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2">
              {categories.map((category) => {
                const active = activeCategorySlug === category.slug
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleOverflowCategoryPick(category.slug)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex min-h-(--control-default) items-center justify-center rounded-xl border px-3 text-xs font-semibold tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border-subtle bg-surface-subtle text-foreground"
                    )}
                  >
                    <span className="truncate">{getCategoryName(category, locale)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
