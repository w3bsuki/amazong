"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { FunnelSimple } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import { CategoryCirclesSimple } from "@/components/mobile/category-nav"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getCategoryName } from "@/lib/category-display"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/types/products"

type FeedScope = "promoted" | "newest" | "nearby" | "forYou"

interface DemoLabLabels {
  seeAll: string
  scopePromoted: string
  scopeNewest: string
  scopeNearby: string
  scopeForYou: string
  filterActionLabel: string
  filterTitle: string
  allCategoriesLabel: string
  clearLabel: string
  closeLabel: string
  scopeBanners: Record<
    FeedScope,
    {
      eyebrow: string
      title: string
      subtitle: string
    }
  >
}

interface DemoLandingLabProps {
  locale: string
  categories: CategoryTreeNode[]
  heroProduct: UIProduct | null
  promotedProducts: UIProduct[]
  newestProducts: UIProduct[]
  nearbyProducts: UIProduct[]
  forYouProducts: UIProduct[]
  labels: DemoLabLabels
}

function renderMobileCard(product: UIProduct, index: number) {
  return (
    <MobileProductCard
      key={`feed-${product.id}-${index}`}
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
      {...((product.sellerName || product.storeSlug)
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

const scopeHref: Record<FeedScope, string> = {
  promoted: "/search?promoted=true&sort=newest",
  newest: "/search?sort=newest",
  nearby: "/search?nearby=true&sort=newest",
  forYou: "/search?sort=newest",
}

export function DemoLandingLab({
  locale,
  categories,
  heroProduct,
  promotedProducts,
  newestProducts,
  nearbyProducts,
  forYouProducts,
  labels,
}: DemoLandingLabProps) {
  const [scope, setScope] = useState<FeedScope>("promoted")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>([])
  const tMobile = useTranslations("Home.mobile")

  const productsByScope = useMemo(
    () => ({
      promoted: promotedProducts,
      newest: newestProducts,
      nearby: nearbyProducts,
      forYou: forYouProducts,
    }),
    [forYouProducts, nearbyProducts, newestProducts, promotedProducts]
  )

  const activeProducts = productsByScope[scope]

  const filteredProducts = useMemo(() => {
    if (selectedCategorySlugs.length === 0) return activeProducts

    return activeProducts.filter((product) => {
      const productSlugs = new Set<string>()
      if (product.categoryRootSlug) productSlugs.add(product.categoryRootSlug)
      if (product.categorySlug) productSlugs.add(product.categorySlug)
      if (Array.isArray(product.categoryPath)) {
        for (const category of product.categoryPath) {
          productSlugs.add(category.slug)
        }
      }

      return selectedCategorySlugs.some((slug) => productSlugs.has(slug))
    })
  }, [activeProducts, selectedCategorySlugs])

  const scopeMeta: Record<FeedScope, { label: string }> = {
    promoted: { label: labels.scopePromoted },
    newest: { label: labels.scopeNewest },
    nearby: { label: labels.scopeNearby },
    forYou: { label: labels.scopeForYou },
  }
  const bannerContent = labels.scopeBanners[scope]
  const bannerProduct = filteredProducts[0] ?? activeProducts[0] ?? heroProduct

  function toggleCategoryFilter(slug: string) {
    setSelectedCategorySlugs((previous) => {
      if (previous.includes(slug)) return previous.filter((value) => value !== slug)
      return [...previous, slug]
    })
  }

  function clearCategoryFilters() {
    setSelectedCategorySlugs([])
  }

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
      <h1 className="sr-only">Mobile Landing Demo</h1>

      <section className="pt-1">
        <CategoryCirclesSimple
          categories={categories}
          locale={locale}
          maxVisible={6}
          className="pt-2 pb-1"
        />
      </section>

      <section className="sticky top-(--app-header-offset) z-30 bg-surface-glass px-(--spacing-home-inset) py-2 backdrop-blur-sm">
        <div className="rounded-2xl border border-border-subtle bg-surface-subtle p-1">
          <div className="flex items-center gap-1">
            <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
              {(Object.keys(scopeMeta) as FeedScope[]).map((item) => {
                const active = scope === item
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setScope(item)}
                    className={[
                      "inline-flex min-h-(--control-default) min-w-0 items-center justify-center rounded-xl px-1.5 text-sm font-semibold whitespace-nowrap tap-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      active
                        ? "bg-background text-foreground ring-1 ring-border-subtle"
                        : "text-muted-foreground hover:bg-hover active:bg-active",
                    ].join(" ")}
                  >
                    <span className="truncate">{scopeMeta[item].label}</span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label={labels.filterActionLabel}
              aria-pressed={selectedCategorySlugs.length > 0}
              className={[
                "relative inline-flex min-h-(--control-default) min-w-(--control-default) shrink-0 items-center justify-center rounded-xl px-2 text-sm font-semibold tap-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selectedCategorySlugs.length > 0
                  ? "bg-background text-foreground ring-1 ring-border-subtle"
                  : "text-muted-foreground hover:bg-hover active:bg-active",
              ].join(" ")}
            >
              <FunnelSimple size={18} weight="regular" aria-hidden="true" />
              <span className="sr-only">{labels.filterActionLabel}</span>
              {selectedCategorySlugs.length > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full border border-background bg-foreground px-1 text-2xs font-semibold leading-none text-background">
                  {selectedCategorySlugs.length}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </section>

      {bannerProduct?.image ? (
        <section className="px-(--spacing-home-inset) pt-2">
          <Link
            href={scopeHref[scope]}
            className="group block overflow-hidden rounded-2xl border border-home-promoted-cta-border bg-home-promoted-cta-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${bannerContent.title}. ${labels.seeAll}`}
          >
            <div className="grid min-h-32 grid-cols-5 items-stretch">
              <div className="col-span-3 flex min-w-0 flex-col p-3">
                <span className="inline-flex w-fit items-center rounded-full border border-home-promoted-cta-border bg-background px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide text-home-promoted-cta-eyebrow">
                  {bannerContent.eyebrow}
                </span>
                <h2 className="pt-1.5 text-lg font-semibold leading-tight tracking-tight text-home-promoted-cta-text">
                  {bannerContent.title}
                </h2>
                <p className="line-clamp-1 pt-0.5 text-2xs font-semibold text-home-promoted-cta-text">
                  {bannerProduct.title}
                </p>
                <p className="line-clamp-2 pt-0.5 text-2xs text-home-promoted-cta-subtitle">
                  {bannerContent.subtitle}
                </p>
                <span className="mt-2 inline-flex min-h-(--control-compact) w-fit items-center rounded-xl border border-home-promoted-cta-button-border bg-home-promoted-cta-button-surface px-2.5 text-xs font-semibold text-home-promoted-cta-button-text transition-transform duration-normal ease-smooth group-active:scale-98">
                  {labels.seeAll}
                </span>
              </div>

              <div className="relative col-span-2 overflow-hidden border-l border-home-promoted-cta-border bg-surface-subtle">
                <Image
                  src={bannerProduct.image}
                  alt={bannerProduct.title}
                  fill
                  sizes="(max-width: 768px) 40vw, 180px"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="px-(--spacing-home-inset) pt-2 pb-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-(--spacing-home-card-gap)">
            {filteredProducts.map((product, index) => renderMobileCard(product, index))}
          </div>
        ) : (
          <div className="rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2">
            <p className="text-xs text-muted-foreground">{tMobile("feed.empty.all")}</p>
          </div>
        )}
      </section>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="bottom" className="max-h-dialog overflow-hidden rounded-t-2xl p-0">
          <SheetHeader className="border-b border-border-subtle pr-14">
            <SheetTitle>{labels.filterTitle}</SheetTitle>
            <SheetDescription>{scopeMeta[scope].label}</SheetDescription>
          </SheetHeader>

          <div className="overflow-y-auto px-(--spacing-home-inset) py-3">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={clearCategoryFilters}
                className="inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-background px-2.5 text-xs font-medium text-muted-foreground"
              >
                {labels.clearLabel}
              </button>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="inline-flex min-h-(--control-compact) items-center rounded-full border border-border-subtle bg-background px-2.5 text-xs font-medium text-muted-foreground"
              >
                {labels.closeLabel}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                type="button"
                onClick={clearCategoryFilters}
                className="col-span-2 inline-flex min-h-(--control-default) items-center justify-center rounded-xl border border-border-subtle bg-surface-subtle px-3 text-xs font-semibold text-foreground tap-transparent transition-colors hover:bg-hover active:bg-active"
              >
                {labels.allCategoriesLabel}
              </button>

              {categories.map((category) => {
                const selected = selectedCategorySlugs.includes(category.slug)
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategoryFilter(category.slug)}
                    aria-pressed={selected}
                    className={[
                      "inline-flex min-h-(--control-default) items-center justify-center rounded-xl border px-3 text-xs font-semibold tap-transparent transition-colors hover:bg-hover active:bg-active",
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border-subtle bg-surface-subtle text-foreground",
                    ].join(" ")}
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
