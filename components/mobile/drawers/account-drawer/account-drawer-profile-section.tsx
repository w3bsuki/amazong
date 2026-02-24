import { ChevronRight as CaretRight, ShieldCheck, Star } from "lucide-react"

import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserAvatar } from "@/components/shared/user-avatar"
import { cn } from "@/lib/utils"

import { MENU_GROUP_CLASS, MENU_ROW_CLASS } from "./account-drawer.styles"

interface AccountDrawerProfileSectionProps {
  displayName: string
  avatarUrl: string | null | undefined
  isEmailVerified: boolean
  memberSinceLabel: string | null
  email: string | null | undefined
  isSeller: boolean
  activeListings: number
  rating: number
  totalSales: number
  verifiedLabel: string
  statsListingsLabel: string
  statsRatingLabel: string
  statsSalesLabel: string
  onClose: () => void
}

export function AccountDrawerProfileSection({
  displayName,
  avatarUrl,
  isEmailVerified,
  memberSinceLabel,
  email,
  isSeller,
  activeListings,
  rating,
  totalSales,
  verifiedLabel,
  statsListingsLabel,
  statsRatingLabel,
  statsSalesLabel,
  onClose,
}: AccountDrawerProfileSectionProps) {
  return (
    <div className={MENU_GROUP_CLASS}>
      <Link
        href="/account"
        onClick={onClose}
        className={cn(MENU_ROW_CLASS, "gap-3.5 py-3.5")}
      >
        <UserAvatar
          name={displayName}
          avatarUrl={avatarUrl ?? null}
          size="xl"
          className="shrink-0 ring-2 ring-border-subtle"
          fallbackClassName="text-lg"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
            {isEmailVerified && (
              <Badge variant="success-subtle" size="compact" className="shrink-0">
                <ShieldCheck size={10} />
                {verifiedLabel}
              </Badge>
            )}
          </div>
          {memberSinceLabel && (
            <p className="mt-0.5 text-2xs text-muted-foreground">{memberSinceLabel}</p>
          )}
          {email && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{email}</p>
          )}
        </div>
        <CaretRight size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>

      {isSeller && (
        <>
          <Separator />
          <div className="grid grid-cols-3">
            <div className="flex flex-col items-center gap-0.5 py-2.5">
              <span className="text-sm font-semibold text-foreground">{activeListings}</span>
              <span className="text-2xs text-muted-foreground">{statsListingsLabel}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 border-x border-border-subtle py-2.5">
              <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-foreground">
                {rating > 0 ? (
                  <>
                    <Star size={12} className="text-rating" />
                    {rating.toFixed(1)}
                  </>
                ) : (
                  "—"
                )}
              </span>
              <span className="text-2xs text-muted-foreground">{statsRatingLabel}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 py-2.5">
              <span className="text-sm font-semibold text-foreground">{totalSales}</span>
              <span className="text-2xs text-muted-foreground">{statsSalesLabel}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

