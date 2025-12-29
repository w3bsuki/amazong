"use client";

import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface MobilePriceBlockProps {
  salePrice: number;
  regularPrice?: number | null;
  currency?: string;
  showSavings?: boolean;
}

export function MobilePriceBlock({
  salePrice,
  regularPrice,
  currency = "BGN",
  showSavings = true,
}: MobilePriceBlockProps) {
  const locale = useLocale();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(price);

  const hasDiscount = regularPrice && regularPrice > salePrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;
  const savingsAmount = hasDiscount ? regularPrice - salePrice : 0;

  const t = {
    youSave: locale === "bg" ? "Спестяваш" : "You save",
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Price Row */}
      <div className="flex items-baseline gap-2.5 flex-wrap">
        {/* Sale Price - Extra Large & Bold with brand color accent */}
        <span className="text-[32px] font-extrabold tracking-tighter text-foreground">
          {formatPrice(salePrice)}
        </span>

        {/* Original Price - Strikethrough */}
        {hasDiscount && (
          <span className="text-base text-muted-foreground line-through decoration-muted-foreground/60 decoration-2">
            {formatPrice(regularPrice)}
          </span>
        )}

        {/* Discount Badge - More prominent */}
        {hasDiscount && discountPercent > 0 && (
          <Badge 
            className="bg-[var(--color-discount-badge-bg)] text-[var(--color-discount-badge-text)] text-xs font-extrabold px-2 py-0.5 h-6 rounded-md border-none hover:bg-[var(--color-discount-badge-bg)] animate-pulse"
          >
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Savings Text - More eye-catching */}
      {showSavings && hasDiscount && savingsAmount > 0 && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-price-savings)]" />
          <span className="text-sm font-semibold text-[var(--color-price-savings)]">
            {t.youSave} {formatPrice(savingsAmount)}
          </span>
        </div>
      )}
    </div>
  );
}
