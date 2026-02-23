import { ChevronRight as CaretRight } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

import { SUBCATEGORY_ROW } from "./category-browse-drawer.styles"
import type { DrawerSeller } from "./category-browse-drawer.types"
import { SellerDrawerCard } from "./seller-drawer-card"

export function CategoryBrowseDrawerSellersTab({
  normalizedQuery,
  sellersLoading,
  filteredSellers,
  onNavigateToSeller,
  onNavigateToSellers,
  verifiedLabel,
  listingsLabel,
  viewAllSellersLabel,
  noMatchesLabel,
  noSellersLabel,
}: {
  normalizedQuery: string
  sellersLoading: boolean
  filteredSellers: DrawerSeller[]
  onNavigateToSeller: (seller: DrawerSeller) => void
  onNavigateToSellers: () => void
  verifiedLabel: string
  listingsLabel: string
  viewAllSellersLabel: string
  noMatchesLabel: string
  noSellersLabel: string
}) {
  if (sellersLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-background p-2.5"
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredSellers.length > 0) {
    return (
      <div className="space-y-1.5">
        {filteredSellers.map((seller) => (
          <SellerDrawerCard
            key={seller.id}
            seller={seller}
            onClick={() => onNavigateToSeller(seller)}
            verifiedLabel={verifiedLabel}
            listingsLabel={listingsLabel}
          />
        ))}

        {/* View all sellers link */}
        <button
          type="button"
          onClick={onNavigateToSellers}
          className={`${SUBCATEGORY_ROW} mt-2 border-foreground bg-foreground text-background`}
        >
          <span className="min-w-0 flex-1 truncate">{viewAllSellersLabel}</span>
          <CaretRight size={16} className="shrink-0 opacity-60" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="py-8 text-center">
      <p className="text-sm text-muted-foreground">
        {normalizedQuery ? noMatchesLabel : noSellersLabel}
      </p>
    </div>
  )
}
