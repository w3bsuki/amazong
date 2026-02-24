"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { ArrowRight, Clock, Eye, Package, TrendingUp as TrendUp } from "lucide-react"
import type { ReactNode } from "react"

import { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"

const SearchAiChat = dynamic(
  () => import("@/components/shared/search/search-ai-chat").then((mod) => mod.SearchAiChat),
  {
    ssr: false,
    loading: () => <div className="h-96 animate-pulse rounded-lg bg-muted" />,
  }
)

interface SearchProduct {
  id: string
  title: string
  price: number
  images: string[]
  slug?: string
  storeSlug?: string | null
}

interface RecentlyViewedProduct {
  id: string
  title: string
  price: number
  image: string | null
  slug?: string
  storeSlug?: string | null
}

function DesktopSearchProductStrip({
  icon,
  title,
  products,
  onClear,
  clearLabel,
  buildProductUrl,
  formatPrice,
  onClose,
  limit,
}: {
  icon: ReactNode
  title: string
  products: RecentlyViewedProduct[]
  onClear: () => void
  clearLabel: string
  buildProductUrl: (product: { id: string; slug?: string; storeSlug?: string | null }) => string
  formatPrice: (price: number) => string
  onClose: () => void
  limit?: number
}) {
  const visibleProducts = typeof limit === "number" ? products.slice(0, limit) : products

  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {icon}
          {title}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="rounded-sm text-xs text-muted-foreground tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          {clearLabel}
        </button>
      </div>
      <div className="p-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {visibleProducts.map((product) => (
            <Link
              key={product.id}
              href={buildProductUrl(product)}
              onClick={onClose}
              className="group w-24 shrink-0 rounded-md tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden ring-1 ring-border">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={24} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="mt-1.5 text-xs text-foreground line-clamp-2 group-hover:text-primary group-hover:underline">
                {product.title}
              </p>
              <p className="text-xs font-semibold text-price-sale">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

interface DesktopSearchPopoverPanelProps {
  aiMode: boolean
  query: string
  products: SearchProduct[]
  recentlyViewed: RecentlyViewedProduct[]
  recentProducts: RecentlyViewedProduct[]
  trendingSearches: string[]
  isSearching: boolean
  minSearchLength: number
  formatPrice: (price: number) => string
  buildSearchHref: (query: string) => string
  buildProductUrl: (product: { id: string; slug?: string; storeSlug?: string | null }) => string
  onClose: () => void
  onSelectSearch: (search: string) => void
  onSelectProduct: (product: SearchProduct) => void
  onClearRecentlyViewed: () => void
  onClearRecentProducts: () => void
}

export function DesktopSearchPopoverPanel({
  aiMode,
  query,
  products,
  recentlyViewed,
  recentProducts,
  trendingSearches,
  isSearching,
  minSearchLength,
  formatPrice,
  buildSearchHref,
  buildProductUrl,
  onClose,
  onSelectSearch,
  onSelectProduct,
  onClearRecentlyViewed,
  onClearRecentProducts,
}: DesktopSearchPopoverPanelProps) {
  const tSearch = useTranslations("SearchOverlay")

  if (aiMode) {
    return <SearchAiChat onClose={onClose} className="h-96" />
  }

  return (
    <>
      <div className="max-h-(--spacing-scroll-xl) overflow-y-auto">
        {products.length > 0 && (
          <div className="border-b border-border">
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <Package size={14} />
                {tSearch("products")}
              </span>
              <Link
                href={buildSearchHref(query)}
                className="flex items-center gap-1 rounded-sm text-xs text-primary tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                onClick={onClose}
              >
                {tSearch("viewAll")}
                <ArrowRight size={12} />
              </Link>
            </div>
            <div className="p-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="group flex w-full items-center gap-3 rounded-lg p-2.5 text-left tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground group-hover:text-primary">
                      {product.title}
                    </p>
                    <p className="text-sm font-bold text-price-sale">{formatPrice(product.price)}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-foreground opacity-0 motion-safe:transition-opacity motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && !query && (
          <DesktopSearchProductStrip
            icon={<Eye size={14} />}
            title={tSearch("recentlyViewed")}
            products={recentlyViewed}
            onClear={onClearRecentlyViewed}
            clearLabel={tSearch("clear")}
            buildProductUrl={buildProductUrl}
            formatPrice={formatPrice}
            onClose={onClose}
            limit={6}
          />
        )}

        {recentProducts.length > 0 && !query && (
          <DesktopSearchProductStrip
            icon={<Clock size={14} />}
            title={tSearch("recentSearches")}
            products={recentProducts}
            onClear={onClearRecentProducts}
            clearLabel={tSearch("clear")}
            buildProductUrl={buildProductUrl}
            formatPrice={formatPrice}
            onClose={onClose}
          />
        )}

        {!query && (
          <div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-subtle">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <TrendUp size={14} />
                {tSearch("trending")}
              </span>
            </div>
            <div className="p-1">
              {trendingSearches.map((search, i) => (
                <button
                  key={`trending-${i}`}
                  type="button"
                  onClick={() => onSelectSearch(search)}
                  className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <span className="text-sm text-foreground group-hover:text-primary flex-1">{search}</span>
                  <ArrowRight
                    size={14}
                    className="text-foreground opacity-0 motion-safe:transition-opacity motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {isSearching && query && (
          <div className="px-4 py-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-4 rounded-full border-2 border-border border-t-primary motion-safe:animate-spin motion-reduce:animate-none" />
              {tSearch("searching")}
            </div>
          </div>
        )}

        {!isSearching && query && query.length >= minSearchLength && products.length === 0 && (
          <div className="px-4 py-8 text-center">
            <Package size={40} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{tSearch("noResultsFor", { query })}</p>
            <p className="text-xs text-muted-foreground mt-1">{tSearch("tryDifferent")}</p>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-surface-subtle border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {tSearch("press")}{" "}
          <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs font-mono">Enter</kbd>{" "}
          {tSearch("toSearch")}
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs font-mono">Esc</kbd>{" "}
          {tSearch("toClose")}
        </span>
      </div>
    </>
  )
}
