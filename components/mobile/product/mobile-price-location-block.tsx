"use client";

import { useLocale } from "next-intl";
import { MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bg, enUS } from "date-fns/locale";

interface MobilePriceLocationBlockProps {
  /** Current sale/display price */
  price: number;
  /** Currency code (default: EUR) */
  currency?: string;
  /** Location string (e.g., "София" or "Sofia") */
  location?: string | null;
  /** ISO timestamp of when item was created/listed */
  createdAt?: string | Date | null;
}

/**
 * Mobile price block with location and time info - OLX/Treido style
 * 
 * Design reference:
 * ```
 * 1250 лв.
 * 📍 София · преди 2ч
 * ```
 */
export function MobilePriceLocationBlock({
  price,
  currency = "EUR",
  location,
  createdAt,
}: MobilePriceLocationBlockProps) {
  const locale = useLocale();

  // Format price with locale-aware formatting
  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "BGN" ? 0 : 2,
      maximumFractionDigits: currency === "BGN" ? 0 : 2,
    }).format(p);

  // Calculate relative time (e.g., "2 hours ago")
  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
        locale: locale === "bg" ? bg : enUS,
      })
    : null;

  return (
    <div className="space-y-1.5">
      {/* Price - treido-mock: text-[22px] font-bold text-gray-900 */}
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold text-foreground">{formatPrice(price)}</span>
      </div>

      {/* Location + Time Row - treido-mock: text-[12px] text-gray-500 */}
      {(location || timeAgo) && (
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5 shrink-0" strokeWidth={1.5} />
            {location}
          </span>
          {location && timeAgo && (
            <span className="size-0.5 bg-muted-foreground/50 rounded-full" />
          )}
          {timeAgo && <span>{timeAgo}</span>}
        </div>
      )}
    </div>
  );
}
