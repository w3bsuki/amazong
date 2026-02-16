"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CaretRight, DotsThree, Sliders } from "@/lib/icons/phosphor"
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
// Types & Constants
// =============================================================================

type DiscoveryScope = "forYou" | "newest" | "promoted" | "nearby" | "deals"
type SortMode = "default" | "cheapest" | "newest"

const DISCOVERY_SCOPES: readonly {
  key: DiscoveryScope
  labelBg: string
  labelEn: string
}[] = [
  { key: "forYou", labelBg: "За теб", labelEn: "For You" },
  { key: "newest", labelBg: "Нови", labelEn: "New" },
  { key: "promoted", labelBg: "Промо", labelEn: "Promo" },
  { key: "nearby", labelBg: "Близо", labelEn: "Nearby" },
  { key: "deals", labelBg: "Оферти", labelEn: "Deals" },
]

const SORT_MODES: readonly {
  key: SortMode
  labelBg: string
  labelEn: string
}[] = [
  { key: "default", labelBg: "По подразбиране", labelEn: "Default" },
  { key: "cheapest", labelBg: "Най-евтини", labelEn: "Cheapest" },
  { key: "newest", labelBg: "Най-нови", labelEn: "Newest" },
]

const MAX_VISIBLE_TABS = 6
const QUICK_JUMP_LIMIT = 4
const SECONDARY_TOP = "calc(var(--app-header-offset) + var(--control-default))"

interface DemoHomeProps {
  locale: string
  categories: CategoryTreeNode[]
  newestProducts: UIProduct[]
  promotedProducts: UIProduct[]
  dealsProducts: UIProduct[]
  nearbyProducts: UIProduct[]
  forYouProducts: UIProduct[]
  categoryProducts: Record<string, UIProduct[]>
}

// =============================================================================
// Style constants
// =============================================================================

const TAB_BASE =
  "relative inline-flex min-h-(--control-default) items-center gap-1.5 px-3 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset"
const TAB_ACTIVE = "font-semibold text-foreground"
const TAB_INACTIVE = "font-medium text-muted-foreground"
const TAB_INDICATOR =
  "absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"

const PILL_BASE =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border min-h-(--control-compact) px-2.5 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const PILL_ACTIVE =
  "border-foreground bg-foreground text-background font-semibold"
const PILL_INACTIVE =
  "border-border-subtle bg-surface-subtle text-muted-foreground font-medium"

const ACTION_CHIP =
  "inline-flex shrink-0 min-h-(--control-compact) items-center gap-1 rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

function tabClass(active: boolean) {
  return cn(TAB_BASE, active ? TAB_ACTIVE : TAB_INACTIVE)
}

function pillClass(active: boolean) {
  return cn(PILL_BASE, active ? PILL_ACTIVE : PILL_INACTIVE)
}

// =============================================================================
// Helpers
// =============================================================================

function matchesSlug(product: UIProduct, slug: string): boolean {
  if (product.categorySlug === slug) return true
  if (product.categoryRootSlug === slug) return true
  if (Array.isArray(product.categoryPath)) {
    return product.categoryPath.some((c) => c.slug === slug)
  }
  return false
}

function sortProducts(products: UIProduct[], mode: SortMode): UIProduct[] {
  if (mode === "default") return products
  const sorted = [...products]
  if (mode === "cheapest") {
    sorted.sort((a, b) => a.price - b.price)
  } else if (mode === "newest") {
    sorted.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return db - da
    })
  }
  return sorted
}

// =============================================================================
// Product card
// =============================================================================

function ProductCard({ product, index }: { product: UIProduct; index: number }) {
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
      {...(product.boostExpiresAt
        ? { boostExpiresAt: product.boostExpiresAt }
        : {})}
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
// Main component
// =============================================================================

export function DemoHome({
  locale,
  categories,
  newestProducts,
  promotedProducts,
  dealsProducts,
  nearbyProducts,
  forYouProducts,
  categoryProducts,
}: DemoHomeProps) {
  const tMobile = useTranslations("Home.mobile")
  const tCategories = useTranslations("Categories")

  // ── State ──
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [scope, setScope] = useState<DiscoveryScope>("forYou")
  const [subSlug, setSubSlug] = useState<string | null>(null)
  const [sort, setSort] = useState<SortMode>("default")
  const [sortOpen, setSortOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const tabsRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // ── Derived data ──
  const visibleTabs = useMemo(() => categories.slice(0, MAX_VISIBLE_TABS), [categories])
  const overflowTabs = useMemo(() => categories.slice(MAX_VISIBLE_TABS), [categories])
  const quickJumps = useMemo(() => categories.slice(0, QUICK_JUMP_LIMIT), [categories])

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === activeSlug) ?? null,
    [activeSlug, categories]
  )
  const subcategories = activeCategory?.children ?? []

  const scopeMap = useMemo(
    () => ({
      forYou: forYouProducts,
      newest: newestProducts,
      promoted: promotedProducts,
      nearby: nearbyProducts,
      deals: dealsProducts,
    }),
    [dealsProducts, forYouProducts, nearbyProducts, newestProducts, promotedProducts]
  )

  /** Raw product pool before sorting */
  const rawProducts = useMemo(() => {
    if (activeSlug) {
      const pool = categoryProducts[activeSlug] ?? newestProducts
      return subSlug ? pool.filter((p) => matchesSlug(p, subSlug)) : pool
    }
    return scopeMap[scope]
  }, [activeSlug, categoryProducts, newestProducts, scope, scopeMap, subSlug])

  /** Final display products (sorted) */
  const displayProducts = useMemo(
    () => sortProducts(rawProducts, sort),
    [rawProducts, sort]
  )

  /** Feed key for transition animation */
  const feedKey = activeSlug
    ? `cat-${activeSlug}-${subSlug ?? "all"}-${sort}`
    : `scope-${scope}-${sort}`

  // ── Context text ──
  const activeSub = subcategories.find((s) => s.slug === subSlug) ?? null
  const contextTitle = activeSub
    ? getCategoryName(activeSub, locale)
    : activeCategory
      ? getCategoryName(activeCategory, locale)
      : (() => {
          const meta = DISCOVERY_SCOPES.find((s) => s.key === scope)
          const label = meta ? (locale === "bg" ? meta.labelBg : meta.labelEn) : scope
          return locale === "bg" ? `${label} обяви` : `${label} listings`
        })()

  const browseHref = activeSlug ? `/categories/${activeSlug}` : "/categories"
  const browseLabel = activeSlug
    ? locale === "bg"
      ? "Пълна категория"
      : "Full category"
    : locale === "bg"
      ? "Всички категории"
      : "All categories"

  // ── Handlers ──
  const handleTab = useCallback((slug: string | null) => {
    setActiveSlug(slug)
    setSubSlug(null)
    setSort("default")
    if (slug === null) setScope("forYou")
  }, [])

  const handleSub = useCallback((slug: string | null) => {
    setSubSlug((prev) => (prev === slug ? null : slug))
  }, [])

  const handleOverflowPick = useCallback((slug: string) => {
    setPickerOpen(false)
    setActiveSlug(slug)
    setSubSlug(null)
    setSort("default")
  }, [])

  const handleQuickJump = useCallback((slug: string) => {
    setActiveSlug(slug)
    setSubSlug(null)
    setSort("default")
  }, [])

  const handleReset = useCallback(() => {
    setActiveSlug(null)
    setSubSlug(null)
    setSort("default")
    setScope("forYou")
  }, [])

  // ── Scroll to top on feed change ──
  useEffect(() => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [feedKey])

  // ── Labels ──
  const isBg = locale === "bg"
  const sortLabel = SORT_MODES.find((s) => s.key === sort)
  const sortText = sortLabel ? (isBg ? sortLabel.labelBg : sortLabel.labelEn) : ""

  // ── Render ──
  return (
    <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
      <h1 className="sr-only">Treido</h1>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* L0 CATEGORY TABS — sticky, scrollable, icon + text               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <nav
        className="sticky top-(--app-header-offset) z-30 border-b border-border-subtle bg-background"
        role="tablist"
        aria-label={isBg ? "Категории" : "Categories"}
      >
        <div ref={tabsRef} className="overflow-x-auto no-scrollbar">
          <div className="flex w-max min-w-full items-stretch">
            {/* "All" tab */}
            <button
              type="button"
              role="tab"
              aria-selected={activeSlug === null}
              onClick={() => handleTab(null)}
              className={tabClass(activeSlug === null)}
            >
              {getCategoryIcon("categories", {
                size: 16,
                weight: activeSlug === null ? "fill" : "regular",
                className: "shrink-0",
              })}
              <span>{tCategories("all")}</span>
              {activeSlug === null && (
                <span className={TAB_INDICATOR} aria-hidden="true" />
              )}
            </button>

            {/* Featured L0 tabs */}
            {visibleTabs.map((cat) => {
              const active = activeSlug === cat.slug
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTab(cat.slug)}
                  className={tabClass(active)}
                >
                  {getCategoryIcon(cat.slug, {
                    size: 16,
                    weight: active ? "fill" : "regular",
                    className: "shrink-0",
                  })}
                  <span className="whitespace-nowrap">
                    {getCategoryName(cat, locale)}
                  </span>
                  {active && (
                    <span className={TAB_INDICATOR} aria-hidden="true" />
                  )}
                </button>
              )
            })}

            {/* Overflow "More" trigger */}
            {overflowTabs.length > 0 && (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                aria-label={isBg ? "Още категории" : "More categories"}
                className={cn(
                  TAB_BASE,
                  TAB_INACTIVE,
                  "border-l border-border-subtle"
                )}
              >
                <DotsThree size={18} weight="bold" className="shrink-0" />
                <span>{isBg ? "Още" : "More"}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTEXT PILLS — sticky secondary rail with glass background      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="sticky z-20 border-b border-border-subtle bg-surface-glass backdrop-blur-sm"
        style={{ top: SECONDARY_TOP }}
      >
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex w-max items-center gap-1.5 px-3 py-2">
            {activeSlug === null ? (
              /* ── Discovery scopes + quick jump ── */
              <>
                {DISCOVERY_SCOPES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    aria-pressed={scope === s.key}
                    onClick={() => setScope(s.key)}
                    className={pillClass(scope === s.key)}
                  >
                    {isBg ? s.labelBg : s.labelEn}
                  </button>
                ))}

                {/* Divider + quick jump */}
                <div
                  aria-hidden="true"
                  className="mx-0.5 h-5 w-px shrink-0 bg-border-subtle"
                />
                <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {isBg ? "Бърз достъп" : "Quick jump"}
                </span>
                {quickJumps.map((cat) => (
                  <button
                    key={`qj-${cat.slug}`}
                    type="button"
                    onClick={() => handleQuickJump(cat.slug)}
                    className={pillClass(false)}
                  >
                    {getCategoryName(cat, locale)}
                  </button>
                ))}
              </>
            ) : (
              /* ── Subcategory pills ── */
              <>
                <button
                  type="button"
                  aria-pressed={subSlug === null}
                  onClick={() => handleSub(null)}
                  className={pillClass(subSlug === null)}
                >
                  {tCategories("all")}
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub.slug}
                    type="button"
                    aria-pressed={subSlug === sub.slug}
                    onClick={() => handleSub(sub.slug)}
                    className={pillClass(subSlug === sub.slug)}
                  >
                    {getCategoryName(sub, locale)}
                  </button>
                ))}
              </>
            )}

            {/* Divider + browse action */}
            <div
              aria-hidden="true"
              className="mx-0.5 h-5 w-px shrink-0 bg-border-subtle"
            />
            <Link href={browseHref} className={ACTION_CHIP}>
              <span>{browseLabel}</span>
              <CaretRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTEXT BAR — count + title + sort                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {contextTitle}
            <span className="ml-1.5 font-normal text-muted-foreground">
              ({displayProducts.length})
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className={ACTION_CHIP}
          aria-label={isBg ? "Сортиране" : "Sort"}
        >
          <Sliders size={14} weight="bold" aria-hidden="true" />
          <span className="max-w-20 truncate">{sortText}</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PRODUCT GRID                                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div ref={gridRef}>
        {displayProducts.length > 0 ? (
          <div
            key={feedKey}
            className="grid grid-cols-2 gap-(--spacing-home-card-gap) px-2 pb-4 animate-in fade-in duration-normal"
          >
            {displayProducts.map((product, i) => (
              <ProductCard key={`${product.id}-${i}`} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-14">
            <p className="text-sm text-muted-foreground">
              {tMobile("feed.empty.all")}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-surface-subtle px-3 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
            >
              {isBg ? "Всички обяви" : "All listings"}
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SORT SHEET                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <Sheet open={sortOpen} onOpenChange={setSortOpen}>
        <SheetContent
          side="bottom"
          className="max-h-dialog-sm overflow-hidden rounded-t-2xl p-0"
        >
          <SheetHeader className="border-b border-border-subtle px-4 pr-14">
            <SheetTitle>
              {isBg ? "Сортиране" : "Sort"}
            </SheetTitle>
            <SheetDescription>
              {isBg
                ? "Подреди обявите по предпочитани критерии."
                : "Order listings by your preferred criteria."}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-1 px-4 py-3">
            {SORT_MODES.map((m) => {
              const active = sort === m.key
              return (
                <button
                  key={m.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSort(m.key)
                    setSortOpen(false)
                  }}
                  className={cn(
                    "flex w-full min-h-(--control-default) items-center rounded-xl px-3 text-sm tap-transparent transition-colors duration-fast ease-smooth",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1",
                    active
                      ? "bg-foreground font-semibold text-background"
                      : "bg-surface-subtle font-medium text-foreground hover:bg-hover active:bg-active"
                  )}
                >
                  {isBg ? m.labelBg : m.labelEn}
                </button>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CATEGORY PICKER SHEET                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
        <SheetContent
          side="bottom"
          className="max-h-dialog overflow-hidden rounded-t-2xl p-0"
        >
          <SheetHeader className="border-b border-border-subtle px-4 pr-14">
            <SheetTitle>
              {isBg ? "Още категории" : "More categories"}
            </SheetTitle>
            <SheetDescription>
              {isBg
                ? "Избери категория или отвори пълния каталог."
                : "Pick a category or open the full directory."}
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-4 py-3">
            {/* Action row */}
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPickerOpen(false)
                  handleReset()
                }}
                className={ACTION_CHIP}
              >
                {isBg ? "Всички обяви" : "All listings"}
              </button>
              <Link
                href="/categories"
                onClick={() => setPickerOpen(false)}
                className={ACTION_CHIP}
              >
                {isBg ? "Отвори каталог" : "Full directory"}
              </Link>
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-2 gap-2 pb-2">
              {categories.map((cat) => {
                const active = activeSlug === cat.slug
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleOverflowPick(cat.slug)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex min-h-(--control-default) items-center justify-center rounded-xl border px-3 text-xs font-semibold tap-transparent transition-colors duration-fast ease-smooth",
                      "hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border-subtle bg-surface-subtle text-foreground"
                    )}
                  >
                    <span className="truncate">
                      {getCategoryName(cat, locale)}
                    </span>
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

