import { Link } from "@/i18n/routing"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Badge } from "@/components/ui/badge"
import type { SellerResultCard } from "../_lib/types"

interface SellerResultsListProps {
  sellers: SellerResultCard[]
  locale: string
  emptyTitle: string
  emptyDescription: string
  verifiedLabel: string
  listingsLabel: string
}

export function SellerResultsList({
  sellers,
  locale,
  emptyTitle,
  emptyDescription,
  verifiedLabel,
  listingsLabel,
}: SellerResultsListProps) {
  if (sellers.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-subtle px-4 py-8 text-center">
        <p className="text-base font-semibold text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2" data-testid="seller-results-list">
      {sellers.map((seller) => {
        const href = seller.username ? `/${seller.username}` : "/sellers"
        const ratingLabel = seller.total_rating != null ? seller.total_rating.toFixed(1) : "—"
        const memberSince = new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "short",
        }).format(new Date(seller.created_at))

        return (
          <Link
            key={seller.id}
            href={href}
            className="block rounded-xl border border-border-subtle bg-background px-3 py-2.5 transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
          >
            <div className="flex items-start gap-2.5">
              <UserAvatar
                name={seller.store_name}
                avatarUrl={seller.avatar_url}
                className="size-11 shrink-0"
                fallbackClassName="font-semibold"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-foreground">{seller.store_name}</p>
                  {seller.verified && (
                    <Badge variant="success-subtle" className="shrink-0">
                      {verifiedLabel}
                    </Badge>
                  )}
                </div>
                {seller.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{seller.description}</p>
                )}
                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{seller.product_count} {listingsLabel}</span>
                  <span>{ratingLabel} ★</span>
                  <span>{memberSince}</span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export type { SellerResultsListProps }
