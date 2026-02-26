import type { RefObject } from "react"

import type { UIProduct } from "@/lib/types/products"
import { ProductGridSkeleton } from "@/components/shared/product/product-grid"
import { EmptyStateCTA } from "../../../_components/empty-state-cta"
import { MobileHomeProductCard } from "./mobile-home-product-card"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

interface MobileHomeFeedProps {
  products: UIProduct[]
  isLoading: boolean
  error: string | null
  loadMoreRef: RefObject<HTMLDivElement | null>
  tMobile: Translate
  tV4: Translate
  onResetAll: () => void
  onRetry: () => void
}

export function MobileHomeFeed({
  products,
  isLoading,
  error,
  loadMoreRef,
  tMobile,
  tV4,
  onResetAll,
  onRetry,
}: MobileHomeFeedProps) {
  return (
    <>
      <section data-testid="home-v4-feed" className="px-4 pb-6 pt-2">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 pb-1">
              {products.map((product, index) => (
                <MobileHomeProductCard key={`${product.id}-${index}`} product={product} index={index} />
              ))}
            </div>
            <div ref={loadMoreRef} data-testid="home-v4-load-more" className="h-10" />
          </>
        ) : (
          <div className="py-6">
            <EmptyStateCTA variant="no-listings" showCTA={false} className="px-0 py-10" />
            <button
              type="button"
              onClick={onResetAll}
              className="mx-auto inline-flex min-h-(--control-default) items-center rounded-full border border-border-subtle bg-surface-subtle px-3 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
            >
              {tV4("actions.reset")}
            </button>
          </div>
        )}
      </section>

      {isLoading && (
        <div className="px-4 pb-2">
          <ProductGridSkeleton count={2} density="compact" />
        </div>
      )}

      {error && (
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary px-3 py-2">
            <p className="text-xs text-muted-foreground">{tMobile("feed.error")}</p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent active:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {tMobile("feed.retry")}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
