import { Star, ShieldCheck, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, safeAvatarSrc } from "@/lib/utils";

interface MobileSellerTrustLineProps {
  sellerName: string;
  sellerUsername?: string;
  sellerAvatarUrl?: string;
  rating?: number | string | null;
  positivePercent?: number | string | null;
  isVerified?: boolean;
  locale?: string;
}

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
  };

  // Check if seller has any ratings
  const numericRating = rating != null ? Number(rating) : 0;
  const hasRating = numericRating > 0;
  const isNewSeller = !hasRating;

  // Format rating display (only if has rating)
  const displayRating = hasRating
    ? typeof rating === "number" 
      ? rating.toFixed(1) 
      : rating 
    : null;

  // Format positive feedback (only show if has rating)
  const displayPositive = hasRating && positivePercent != null
    ? typeof positivePercent === "number"
      ? `${Math.round(positivePercent)}%`
      : positivePercent
    : null;

  const href = sellerUsername ? `/${sellerUsername}` : "#";

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 py-2.5 px-3 bg-seller-banner group my-2"
    >
      {/* Avatar */}
      <Avatar className="size-8 border-2 border-white/30 shrink-0">
        <AvatarImage src={safeAvatarSrc(sellerAvatarUrl)} alt={sellerName} />
        <AvatarFallback className="text-2xs font-medium bg-white/20 text-white">
          {sellerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-seller-banner-text truncate">
            {sellerName}
          </span>
          {isVerified && (
            <ShieldCheck className="size-4 text-white shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {isNewSeller ? (
            <span className="text-tiny font-medium text-white bg-white/20 px-1.5 py-0.5 rounded">
              {t.newSeller}
            </span>
          ) : (
            <>
              {displayRating && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star className="size-3 fill-rating text-rating" />
                  <span className="text-tiny font-medium text-white">{displayRating}</span>
                </div>
              )}
              {displayPositive && (
                <span className="text-tiny text-white/80">
                  {displayPositive} {t.positive}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Visit Button - 28px (h-7) compact touch target */}
      <div className="flex items-center gap-0.5 h-7 px-2.5 rounded-full bg-white/20 text-white shrink-0">
        <span className="text-2xs font-medium">{locale === "bg" ? "Виж" : "Visit"}</span>
        <ChevronRight className="size-3.5" />
      </div>
    </Link>
  );
}
