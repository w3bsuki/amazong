import { Star, ShieldCheck, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeAvatarSrc } from "@/lib/utils";

interface MobileSellerTrustLineProps {
  sellerName: string;
  sellerUsername?: string;
  sellerAvatarUrl?: string;
  rating?: number | string | null;
  positivePercent?: number | string | null;
  isVerified?: boolean;
  locale?: string;
}

/**
 * MobileSellerTrustLine - FLAT design, no opacity layers
 * 
 * Design principles:
 * - Solid colors only (no bg-white/20 gradient vibes)
 * - High contrast text
 * - Clear CTA button with solid background
 */
export function MobileSellerTrustLine({
  sellerName,
  sellerUsername,
  sellerAvatarUrl,
  rating,
  positivePercent,
  isVerified,
  locale = "en",
}: MobileSellerTrustLineProps) {
  const t = {
    positive: locale === "bg" ? "положителни" : "positive",
    newSeller: locale === "bg" ? "Нов продавач" : "New Seller",
    visit: locale === "bg" ? "Виж" : "Visit",
  };

  const numericRating = rating != null ? Number(rating) : 0;
  const hasRating = numericRating > 0;
  const displayRating = hasRating ? (typeof rating === "number" ? rating.toFixed(1) : rating) : null;
  const displayPositive = hasRating && positivePercent != null
    ? typeof positivePercent === "number" ? `${Math.round(positivePercent)}%` : positivePercent
    : null;

  const href = sellerUsername ? `/${sellerUsername}` : "#";

  return (
    <Link href={href} className="flex items-center gap-2.5 py-2.5 px-3 bg-seller-banner group my-2">
      {/* Avatar - solid border, no opacity */}
      <Avatar className="size-9 border-2 border-background shrink-0">
        <AvatarImage src={safeAvatarSrc(sellerAvatarUrl)} alt={sellerName} />
        <AvatarFallback className="text-xs font-semibold bg-background text-seller-banner">
          {sellerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-seller-banner-text truncate">{sellerName}</span>
          {isVerified && <ShieldCheck className="size-4 text-seller-banner-text shrink-0" />}
        </div>

        <div className="flex items-center gap-2">
          {!hasRating ? (
            <span className="text-xs font-medium text-seller-banner-text/90 bg-background/20 px-1.5 py-0.5 rounded">
              {t.newSeller}
            </span>
          ) : (
            <>
              {displayRating && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-seller-banner-text">{displayRating}</span>
                </div>
              )}
              {displayPositive && (
                <span className="text-xs text-seller-banner-text/80">{displayPositive} {t.positive}</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Visit button - SOLID, no transparency */}
      <div className="flex items-center gap-0.5 h-7 px-3 rounded-md bg-seller-banner-pill-bg text-seller-banner-pill-text shrink-0 font-medium">
        <span className="text-xs">{t.visit}</span>
        <ChevronRight className="size-3.5" />
      </div>
    </Link>
  );
}
