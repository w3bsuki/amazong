"use client"

import { useTranslations } from "next-intl"
import { ProductCard } from "@/components/shared/product/product-card"
import type { UIProduct } from "@/lib/types/products"
import { HomeSectionHeader } from "@/components/mobile/home-section-header"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"

interface PromotedListingsStripProps {
  products: UIProduct[]
  layout?: "grid" | "strip"
  maxItems?: number
  styleDensity?: "default" | "featured"
  showHeader?: boolean
  showQuickScopes?: boolean
  className?: string
}

export function PromotedListingsStrip({
  products,
  layout = "strip",
  maxItems = 10,
  showHeader = true,
  showQuickScopes = true,
  className,
}: PromotedListingsStripProps) {
  const t = useTranslations("Home")
  const tMobile = useTranslations("Home.mobile")
  const tProduct = useTranslations("Product")

  if (!products || products.length === 0) return null

  const visibleProducts = products.slice(0, maxItems)
  const cardWidthClass = "w-(--spacing-home-card-column-w)"

  return (
    <section
      data-testid="home-section-promoted"
      className={cn(
        showHeader ? "pt-(--spacing-home-section-gap)" : "pt-2",
        className
      )}
    >
      {showHeader && (
        <HomeSectionHeader
          title={t("mobile.promotedListings")}
          href="/search?promoted=true&sort=newest"
          actionLabel={t("mobile.seeAll")}
          variant="promoted"
          badgeLabel={tProduct("adBadge")}
        />
      )}

      {showQuickScopes && (
        <div className="mb-2 px-(--spacing-home-inset)">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Link
              href="/search?promoted=true&sort=newest"
              className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center rounded-full border border-foreground bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-foreground active:bg-foreground"
            >
              {tMobile("sort.newest")}
            </Link>
            <Link
              href="/search?promoted=true&sort=price-asc"
              className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active active:text-foreground"
            >
              {tMobile("sort.priceLow")}
            </Link>
            <Link
              href="/search?promoted=true&sort=price-desc"
              className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active active:text-foreground"
            >
              {tMobile("sort.priceHigh")}
            </Link>
            <Link
              href="/search?promoted=true&nearby=true"
              className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active active:text-foreground"
            >
              {tMobile("sort.nearby")}
            </Link>
          </div>
        </div>
      )}

      {layout === "strip" ? (
        <div
          data-testid="home-section-promoted-strip"
          className="overflow-x-auto scroll-smooth no-scrollbar"
        >
          <div className="flex snap-x snap-mandatory gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-2">
            {visibleProducts.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  "shrink-0 snap-start",
                  cardWidthClass
                )}
              >
                <ProductCard
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
                  sellerEmailVerified={Boolean(product.sellerEmailVerified)}
                  sellerPhoneVerified={Boolean(product.sellerPhoneVerified)}
                  sellerIdVerified={Boolean(product.sellerIdVerified)}
                  {...(product.condition ? { condition: product.condition } : {})}
                  {...(product.brand ? { brand: product.brand } : {})}
                  {...(product.categorySlug ? { categorySlug: product.categorySlug } : {})}
                  {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
                  {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                  {...(product.make ? { make: product.make } : {})}
                  {...(product.model ? { model: product.model } : {})}
                  {...(product.year ? { year: product.year } : {})}
                  {...(product.location ? { location: product.location } : {})}
                  {...(product.attributes ? { attributes: product.attributes } : {})}
                  appearance="card"
                  media="portrait"
                  density="compact"
                  titleLines={2}
                  uiVariant="home"
                  showCategoryBadge={true}
                  radius="2xl"
                  maxOverlayBadges={2}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-2">
          {visibleProducts.map((product, index) => (
            <ProductCard
              key={product.id}
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
              sellerEmailVerified={Boolean(product.sellerEmailVerified)}
              sellerPhoneVerified={Boolean(product.sellerPhoneVerified)}
              sellerIdVerified={Boolean(product.sellerIdVerified)}
              {...(product.condition ? { condition: product.condition } : {})}
              {...(product.brand ? { brand: product.brand } : {})}
              {...(product.categorySlug ? { categorySlug: product.categorySlug } : {})}
              {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
              {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
              {...(product.make ? { make: product.make } : {})}
              {...(product.model ? { model: product.model } : {})}
              {...(product.year ? { year: product.year } : {})}
              {...(product.location ? { location: product.location } : {})}
              {...(product.attributes ? { attributes: product.attributes } : {})}
              appearance="card"
              media="portrait"
              density="compact"
              titleLines={2}
              uiVariant="home"
              showCategoryBadge={true}
              radius="2xl"
              maxOverlayBadges={2}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export type { PromotedListingsStripProps }
