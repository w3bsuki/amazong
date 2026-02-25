import type { ReactNode } from "react"
import Image from "next/image"
import { ArrowRight, Clock, Package, TrendingUp as TrendUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DrawerBody, DrawerFooter } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

export type SearchOverlayProduct = {
  id: string
  title: string
  price: number
  images?: string[]
  slug?: string
  storeSlug?: string | null
}

type SearchChipSectionProps = {
  headingId: string
  title: string
  icon: ReactNode
  items: string[]
  quickChipClass: string
  onSelect: (search: string) => void
  onClear?: () => void
  clearLabel?: string
}

function SearchChipSection({
  headingId,
  title,
  icon,
  items,
  quickChipClass,
  onSelect,
  onClear,
  clearLabel,
}: SearchChipSectionProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby={headingId}>
      <div className={cn("mb-2 flex items-center gap-2", onClear && "justify-between gap-3")}>
        <h3
          id={headingId}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {icon}
          {title}
        </h3>
        {onClear && clearLabel ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-muted-foreground transition-colors duration-fast ease-smooth hover:text-foreground"
            data-vaul-no-drag
          >
            {clearLabel}
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((search) => (
          <button
            key={search}
            type="button"
            onClick={() => onSelect(search)}
            className={cn(quickChipClass, "max-w-full")}
            data-vaul-no-drag
          >
            <span className="truncate">{search}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

type MobileSearchOverlayResultsProps = {
  isSearching: boolean
  products: SearchOverlayProduct[]
  formatPrice: (price: number) => string
  onProductSelect: (product: SearchOverlayProduct) => void
  query: string
  minSearchLength: number
  noResultsLabel: string
  noResultsHelp: string
  productsLabel: string
  searchingLabel: string
  recentSearches: string[]
  trendingSearches: string[]
  quickChipClass: string
  onSearch: (query: string) => void
  onClearRecentSearches: () => void
  recentSearchesLabel: string
  trendingLabel: string
  clearLabel: string
  trimmedQuery: string
  viewAllResultsLabel: string
  onViewAllResults: () => void
  drawerAriaLabel: string
}

export function MobileSearchOverlayResults({
  isSearching,
  products,
  formatPrice,
  onProductSelect,
  query,
  minSearchLength,
  noResultsLabel,
  noResultsHelp,
  productsLabel,
  searchingLabel,
  recentSearches,
  trendingSearches,
  quickChipClass,
  onSearch,
  onClearRecentSearches,
  recentSearchesLabel,
  trendingLabel,
  clearLabel,
  trimmedQuery,
  viewAllResultsLabel,
  onViewAllResults,
  drawerAriaLabel,
}: MobileSearchOverlayResultsProps) {
  return (
    <>
      <DrawerBody className="px-0 py-0" aria-label={drawerAriaLabel}>
        {isSearching ? (
          <div role="status" aria-live="polite" className="px-inset py-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div
                className="size-5 animate-spin rounded-full border-2 border-border border-t-primary"
                aria-hidden="true"
              />
              <span>{searchingLabel}</span>
            </div>
          </div>
        ) : null}

        {!isSearching && products.length > 0 ? (
          <section aria-labelledby="products-heading" className="border-b border-border-subtle">
            <div className="flex items-center gap-2 px-inset py-2">
              <h3
                id="products-heading"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                <Package size={14} aria-hidden="true" />
                {productsLabel}
              </h3>
            </div>

            <ul className="divide-y divide-border-subtle" role="listbox" aria-label={productsLabel}>
              {products.map((product) => (
                <li key={product.id} role="option" aria-selected="false">
                  <button
                    type="button"
                    onClick={() => onProductSelect(product)}
                    className="flex w-full items-center gap-2 px-inset py-3 text-left transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active"
                    data-vaul-no-drag
                  >
                    <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                          <Package size={24} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">{product.title}</p>
                      <p className="mt-0.5 text-sm font-bold text-price-sale">{formatPrice(product.price)}</p>
                    </div>
                    <ArrowRight size={16} className="shrink-0 text-foreground" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {!isSearching && query.length >= minSearchLength && products.length === 0 ? (
          <div role="status" aria-live="polite" className="px-inset py-10 text-center">
            <Package size={48} className="mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
            <p className="text-base font-medium text-foreground">{noResultsLabel}</p>
            <p className="mt-1 text-sm text-muted-foreground">{noResultsHelp}</p>
          </div>
        ) : null}

        {!query ? (
          <div className="space-y-5 px-inset py-4">
            <SearchChipSection
              headingId="recent-searches-heading"
              title={recentSearchesLabel}
              icon={<Clock size={14} aria-hidden="true" />}
              items={recentSearches}
              quickChipClass={quickChipClass}
              onSelect={onSearch}
              onClear={onClearRecentSearches}
              clearLabel={clearLabel}
            />

            <SearchChipSection
              headingId="trending-searches-heading"
              title={trendingLabel}
              icon={<TrendUp size={14} aria-hidden="true" />}
              items={trendingSearches}
              quickChipClass={quickChipClass}
              onSelect={onSearch}
            />
          </div>
        ) : null}
      </DrawerBody>

      {trimmedQuery ? (
        <DrawerFooter className="border-t border-border-subtle px-inset py-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onViewAllResults}
            className="h-(--control-default) w-full justify-between rounded-full bg-surface-subtle px-4 text-sm font-semibold text-foreground hover:bg-hover active:bg-active"
            data-vaul-no-drag
          >
            <span className="truncate">{viewAllResultsLabel}</span>
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Button>
        </DrawerFooter>
      ) : null}
    </>
  )
}
