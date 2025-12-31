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
      <div className="flex items-baseline gap-2 flex-wrap">
        {/* Sale Price - LARGEST element per design system: 18px (text-lg) bold */}
        <span className={`text-lg font-bold tracking-tight ${hasDiscount ? "text-price-sale" : "text-foreground"}`}>
          {formatPrice(salePrice)}
          {showVat && <span className="text-xs font-normal text-muted-foreground ml-1">{t.inclVat}</span>}
        </span>

        {/* Original Price - text-tiny (11px) struck through */}
        {hasDiscount && (
          <span className="text-tiny text-muted-foreground line-through">
            {formatPrice(regularPrice)}
          </span>
        )}

        {/* Discount Badge - text-2xs (10px) */}
        {hasDiscount && discountPercent > 0 && (
          <Badge 
            className="bg-discount-badge-bg text-discount-badge-text text-2xs font-semibold px-1.5 py-0.5 h-5 rounded border-none hover:bg-discount-badge-bg"
          >
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Savings Text - text-tiny (11px) */}
      {showSavings && hasDiscount && savingsAmount > 0 && (
        <div className="flex items-center gap-1">
          <Sparkles className="size-3 text-price-savings" />
          <span className="text-tiny font-medium text-price-savings">
            {t.youSave} {formatPrice(savingsAmount)}
          </span>
        </div>
      )}
    </div>
  );
}
