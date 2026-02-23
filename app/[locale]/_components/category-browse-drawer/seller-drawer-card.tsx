import { ChevronRight as CaretRight, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/shared/user-avatar"

import type { DrawerSeller } from "./category-browse-drawer.types"

/** Compact seller card for the sellers tab */
export function SellerDrawerCard({
  seller,
  onClick,
  verifiedLabel,
  listingsLabel,
}: {
  seller: DrawerSeller
  onClick: () => void
  verifiedLabel: string
  listingsLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl border border-border-subtle bg-background p-2.5 text-left tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
    >
      <UserAvatar
        name={seller.store_name}
        avatarUrl={seller.avatar_url}
        className="size-10 shrink-0"
        fallbackClassName="text-xs font-semibold"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-foreground">
            {seller.store_name}
          </span>
          {seller.verified && (
            <Badge variant="success-subtle" className="shrink-0">
              {verifiedLabel}
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2.5 text-2xs text-muted-foreground">
          <span>
            {seller.product_count} {listingsLabel}
          </span>
          {seller.total_rating != null && (
            <span className="inline-flex items-center gap-0.5">
              <Star size={10} className="fill-current text-rating" />
              {seller.total_rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <CaretRight size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
    </button>
  )
}
