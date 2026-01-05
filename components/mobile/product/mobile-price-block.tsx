"use client";

import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface MobilePriceBlockProps {
  salePrice: number;
  regularPrice?: number | null;
  currency?: string;
  showSavings?: boolean;
  showVat?: boolean;
}

export function MobilePriceBlock({
  salePrice,
  regularPrice,
  currency = "EUR",
  showSavings = true,
  showVat = true,
}: MobilePriceBlockProps) {
  const locale = useLocale();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
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
    inclVat: locale === "bg" ? "с ДДС" : "incl. VAT",
  };

  return (
    <div className="flex flex-col gap-0.5">
      {/* Price Row */}
      <div className="flex items-baseline gap-1.5 flex-wrap">
        {/* Sale Price - text-base (16px) bold per design system */}
        <span className={`text-base font-bold ${hasDiscount ? "text-price-sale" : "text-foreground"}`}>
          {formatPrice(salePrice)}
          {showVat && <span className="text-xs font-normal text-muted-foreground ml-1">{t.inclVat}</span>}
        </span>

        {/* Original Price - text-xs (12px) struck through */}
        {hasDiscount && (
          <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/60">
            {formatPrice(regularPrice)}
          </span>
        )}

        {/* Discount Badge - using deal variant */}
        {hasDiscount && discountPercent > 0 && (
          <Badge 
            variant="sale"
            className="h-5 px-1.5 text-2xs font-bold rounded-sm"
          >
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Savings Text - text-tiny (11px) */}
      {showSavings && hasDiscount && savingsAmount > 0 && (
        <div className="flex items-center gap-1">
          <Sparkles className="size-3.5 text-price-savings" />
          <span className="text-tiny font-medium text-price-savings">
            {t.youSave} {formatPrice(savingsAmount)}
          </span>
        </div>
      )}
    </div>
  );
}
