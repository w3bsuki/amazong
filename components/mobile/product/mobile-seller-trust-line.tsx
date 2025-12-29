"use client";

import { Star, ShieldCheck, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  };

  // Format rating display
  const displayRating = rating != null 
    ? typeof rating === "number" 
      ? rating.toFixed(1) 
      : rating 
    : null;

  // Format positive feedback
  const displayPositive = positivePercent != null
    ? typeof positivePercent === "number"
      ? `${Math.round(positivePercent)}%`
      : positivePercent
    : null;

  const href = sellerUsername ? `/${sellerUsername}` : "#";

  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-3 -mx-4 px-4 bg-muted/30 active:bg-muted/60 transition-colors group touch-action-manipulation border-y border-border/50 my-2"
    >
      {/* Avatar - Larger */}
      <Avatar className="h-10 w-10 border-2 border-[var(--color-verified)]/30 shrink-0 ring-2 ring-[var(--color-verified)]/10">
        <AvatarImage src={sellerAvatarUrl} alt={sellerName} />
        <AvatarFallback className="text-xs font-bold bg-[var(--color-verified)]/10 text-[var(--color-verified)]">
          {sellerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Info - Better hierarchy */}
      <div className="flex flex-col flex-1 min-w-0 gap-0.5">
        <div className="flex items-center gap-1.5">
          {/* Seller Name */}
          <span className="text-sm font-bold text-foreground group-hover:text-[var(--color-link)] truncate">
            {sellerName}
          </span>

          {/* Verified Badge */}
          {isVerified && (
            <ShieldCheck className="w-4 h-4 text-[var(--color-verified)] shrink-0 fill-[var(--color-verified)]/20" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Rating */}
          {displayRating && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-3.5 h-3.5 fill-[var(--color-rating)] text-[var(--color-rating)]" />
              <span className="text-xs font-bold text-foreground">{displayRating}</span>
            </div>
          )}

          {/* Positive Feedback */}
          {displayPositive && (
            <span className="text-xs font-medium text-[var(--color-success)]">
              {displayPositive} {t.positive}
            </span>
          )}
        </div>
      </div>

      {/* Visit Button */}
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--color-link)]/10 text-[var(--color-link)] shrink-0">
        <span className="text-xs font-semibold">{locale === "bg" ? "Виж" : "Visit"}</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}
