"use client"

import { useMemo, useState } from "react"
import { FunnelSimple } from "@/lib/icons/phosphor"
import { useTranslations } from "next-intl"

import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/types/products"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
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

type FeedScope = "promoted" | "newest" | "nearby" | "forYou"

const FEED_SCOPES: readonly {
  key: FeedScope
  labelBg: string
  labelEn: string
}[] = [
  { key: "promoted", labelBg: "Промо", labelEn: "Promo" },
  { key: "newest", labelBg: "Нови", labelEn: "New" },
  { key: "nearby", labelBg: "Близо", labelEn: "Nearby" },
  { key: "forYou", labelBg: "За теб", labelEn: "For you" },
]

interface DemoAppFeedProps {
  locale: string
  categories: CategoryTreeNode[]
  promotedProducts: UIProduct[]
  newestProducts: UIProduct[]
  nearbyProducts: UIProduct[]
  forYouProducts: UIProduct[]
}

// =============================================================================
// Helpers
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
      {...(product.boostExpiresAt
        ? { boostExpiresAt: product.boostExpiresAt }
        : {})}
      index={index}
      slug={product.slug ?? null}
      username={product.storeSlug ?? null}
      sellerId={product.sellerId ?? null}
      {...(product.sellerName || product.storeSlug
        ? {
            sellerName:
              product.sellerName || product.storeSlug || "",
          }
        : {})}
      sellerAvatarUrl={product.sellerAvatarUrl || null}
      sellerTier={product.sellerTier ?? "basic"}
      sellerVerified={Boolean(product.sellerVerified)}
      {...(product.condition ? { condition: product.condition } : {})}
      {...(product.categoryPath
        ? { categoryPath: product.categoryPath }
        : {})}
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

export function DemoAppFeed({
  locale,
  categories,
  promotedProducts,
  newestProducts,
  nearbyProducts,
  forYouProducts,
}: DemoAppFeedProps) {
  const [scope, setScope] = useState<FeedScope>("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>(
    []
  )
  const tMobile = useTranslations("Home.mobile")

  // ── Data ──

  const productsByScope = useMemo(
    () => ({
      promoted: promotedProducts,
      newest: newestProducts,
      nearby: nearbyProducts,
      forYou: forYouProducts,
    }),
    [promotedProducts, newestProducts, nearbyProducts, forYouProducts]
  )

  const activeProducts = productsByScope[scope]

  const filteredProducts = useMemo(() => {
    if (selectedCategorySlugs.length === 0) return activeProducts
    return activeProducts.filter((product) => {
      const slugs = new Set<string>()
      if (product.categoryRootSlug) slugs.add(product.categoryRootSlug)
      if (product.categorySlug) slugs.add(product.categorySlug)
      if (Array.isArray(product.categoryPath)) {
        for (const cat of product.categoryPath) {
          slugs.add(cat.slug)
        }
      }
      return selectedCategorySlugs.some((s) => slugs.has(s))
    })
  }, [activeProducts, selectedCategorySlugs])

  const hasCategoryFilters = selectedCategorySlugs.length > 0

  // ── Handlers ──

  function toggleCategory(slug: string) {
    setSelectedCategorySlugs((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    )
  }

  function clearFilters() {
    setSelectedCategorySlugs([])
  }

  // ── Render ──

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
      <h1 className="sr-only">Treido</h1>

      {/* ─── Underline tab bar ─── */}
      <nav
        className="sticky top-(--app-header-offset) z-30 flex items-stretch border-b border-border-subtle bg-background"
        role="tablist"
        aria-label={locale === "bg" ? "Канали на емисията" : "Feed channels"}
      >
        {FEED_SCOPES.map((tab) => {
          const isActive = scope === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setScope(tab.key)}
              className={cn(
                "relative flex-1 min-h-(--control-default) text-center text-xs tap-transparent",
                "transition-colors duration-fast ease-smooth",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
                isActive
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground"
              )}
            >
              {locale === "bg" ? tab.labelBg : tab.labelEn}
              {isActive && (
                <span
                  className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-foreground"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}

        {/* Filter icon */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          aria-label={
            locale === "bg" ? "Филтри по категория" : "Category filters"
          }
          className={cn(
            "relative flex min-h-(--control-default) w-12 shrink-0 items-center justify-center border-l border-border-subtle tap-transparent",
            "transition-colors duration-fast ease-smooth",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
            hasCategoryFilters
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          <FunnelSimple
            size={18}
            weight={hasCategoryFilters ? "fill" : "regular"}
            aria-hidden="true"
          />
          {hasCategoryFilters && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-foreground text-2xs font-bold leading-none text-background">
              {selectedCategorySlugs.length}
            </span>
          )}
        </button>
      </nav>

      {/* ─── Product feed — tight app-style grid ─── */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 p-2">
          {filteredProducts.map((product, index) =>
            renderCard(product, index)
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <p className="text-sm text-muted-foreground">
            {tMobile("feed.empty.all")}
          </p>
          {hasCategoryFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-surface-subtle px-3 text-xs font-medium text-foreground tap-transparent"
            >
              {locale === "bg" ? "Изчисти филтрите" : "Clear filters"}
            </button>
          )}
        </div>
      )}

      {/* ─── Category filter sheet ─── */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent
          side="bottom"
          className="max-h-dialog overflow-hidden rounded-t-2xl p-0"
        >
          <SheetHeader className="border-b border-border-subtle px-4 pr-14">
            <SheetTitle>
              {locale === "bg" ? "Филтър по категория" : "Filter by category"}
            </SheetTitle>
            <SheetDescription>
              {locale === "bg"
                ? "Избери категории за филтриране"
                : "Select categories to filter the feed"}
            </SheetDescription>
          </SheetHeader>

          <div className="overflow-y-auto px-4 py-3">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-background px-2.5 text-xs font-medium text-muted-foreground tap-transparent"
              >
                {locale === "bg" ? "Изчисти" : "Clear"}
              </button>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-background px-2.5 text-xs font-medium text-muted-foreground tap-transparent"
              >
                {locale === "bg" ? "Готово" : "Done"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                type="button"
                onClick={clearFilters}
                className="col-span-2 inline-flex min-h-(--control-default) items-center justify-center rounded-xl border border-border-subtle bg-surface-subtle px-3 text-xs font-semibold text-foreground tap-transparent transition-colors hover:bg-hover active:bg-active"
              >
                {locale === "bg" ? "Всички категории" : "All categories"}
              </button>

              {categories.map((category) => {
                const selected = selectedCategorySlugs.includes(
                  category.slug
                )
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.slug)}
                    aria-pressed={selected}
                    className={cn(
                      "inline-flex min-h-(--control-default) items-center justify-center rounded-xl border px-3 text-xs font-semibold tap-transparent transition-colors hover:bg-hover active:bg-active",
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border-subtle bg-surface-subtle text-foreground"
                    )}
                  >
                    <span className="truncate">
                      {getCategoryName(category, locale)}
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
