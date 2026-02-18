import { X } from "lucide-react"

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

interface MobileSellerActiveChipsProps {
  currentVerified: boolean
  currentMinRating: number
  currentMinListings: number
  chipClass: string
  t: Translate
  onClearVerified: () => void
  onClearMinRating: () => void
  onClearMinListings: () => void
  onClearAll: () => void
}

export function MobileSellerActiveChips({
  currentVerified,
  currentMinRating,
  currentMinListings,
  chipClass,
  t,
  onClearVerified,
  onClearMinRating,
  onClearMinListings,
  onClearAll,
}: MobileSellerActiveChipsProps) {
  if (!currentVerified && currentMinRating <= 0 && currentMinListings <= 0) {
    return null
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
      {currentVerified && (
        <button type="button" onClick={onClearVerified} className={chipClass}>
          <span>{t("verifiedSellers")}</span>
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
      {currentMinRating > 0 && (
        <button type="button" onClick={onClearMinRating} className={chipClass}>
          <span>{t("sellerMinRatingChip", { rating: currentMinRating })}</span>
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
      {currentMinListings > 0 && (
        <button type="button" onClick={onClearMinListings} className={chipClass}>
          <span>{t("sellerMinListingsChip", { count: currentMinListings })}</span>
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
      <button type="button" onClick={onClearAll} className={chipClass}>
        <span>{t("clear")}</span>
      </button>
    </div>
  )
}
