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
      className="flex items-center gap-2.5 py-2.5 px-4 bg-muted/30 active:bg-muted/60 transition-colors duration-100 group border-y border-border/50 my-2"
    >
      {/* Avatar */}
      <Avatar className="size-9 border border-border shrink-0">
        <AvatarImage src={sellerAvatarUrl} alt={sellerName} />
        <AvatarFallback className="text-xs font-medium bg-muted">
          {sellerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-foreground group-hover:text-primary truncate">
            {sellerName}
          </span>
          {isVerified && (
            <ShieldCheck className="size-4 text-verified shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {displayRating && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="size-3 fill-rating text-rating" />
              <span className="text-tiny font-medium text-foreground">{displayRating}</span>
            </div>
          )}
          {displayPositive && (
            <span className="text-tiny text-muted-foreground">
              {displayPositive} {t.positive}
            </span>
          )}
        </div>
      </div>

      {/* Visit Button - 28px (h-7) compact touch target */}
      <div className="flex items-center gap-0.5 h-7 px-2.5 rounded-full bg-primary/10 text-primary shrink-0">
        <span className="text-2xs font-medium">{locale === "bg" ? "Виж" : "Visit"}</span>
        <ChevronRight className="size-3.5" />
      </div>
    </Link>
  );
}
