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
    <div className="flex flex-col gap-0.5">
      {/* Price Row */}
      <div className="flex items-baseline gap-2 flex-wrap">
        {/* Sale Price */}
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {formatPrice(salePrice)}
        </span>

        {/* Original Price - Strikethrough */}
        {hasDiscount && (
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(regularPrice)}
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && discountPercent > 0 && (
          <Badge 
            className="bg-[var(--color-discount-badge-bg)] text-[var(--color-discount-badge-text)] text-xs font-semibold px-1.5 py-0.5 h-5 rounded border-none hover:bg-[var(--color-discount-badge-bg)]"
          >
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Savings Text */}
      {showSavings && hasDiscount && savingsAmount > 0 && (
        <div className="flex items-center gap-1">
          <Sparkles className="size-3.5 text-[var(--color-price-savings)]" />
          <span className="text-xs font-medium text-[var(--color-price-savings)]">
            {t.youSave} {formatPrice(savingsAmount)}
          </span>
        </div>
      )}
    </div>
  );
}
