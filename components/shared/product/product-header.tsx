"use client";

import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getConditionBadgeVariant } from "@/components/shared/product/_lib/condition-badges";
import { getConditionKey } from "@/components/shared/product/_lib/condition";

interface ProductHeaderProps {
  title: string;
  condition: string | null;
  freeShipping: boolean;
  price: number;
  currency: string;
  isNegotiable: boolean;
  locale: string;
}

/**
 * Product header with price, title, and badges.
 * TradeSphere compact pattern - price first (most important).
 */
export function ProductHeader({
  title,
  condition,
  freeShipping,
  price,
  currency,
  isNegotiable,
  locale,
}: ProductHeaderProps) {
  const t = useTranslations("Product");

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "BGN" ? 0 : 2,
      maximumFractionDigits: currency === "BGN" ? 0 : 2,
    }).format(p);

  return (
    <div className="space-y-1.5">
      {/* Price first (most important) */}
      {price > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-foreground">{formatPrice(price)}</p>
          {isNegotiable && (
            <Badge variant="default">{t("negotiable")}</Badge>
          )}
        </div>
      )}
      {/* Title */}
      <h1 className="text-base font-semibold text-foreground leading-snug">{title}</h1>
      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        {condition && (
          <Badge variant={getConditionBadgeVariant(condition)}>
            {(() => {
              const key = getConditionKey(condition);
              return key ? t(key) : condition;
            })()}
          </Badge>
        )}
        {freeShipping && (
          <Badge variant="shipping">
            <Truck className="size-3" strokeWidth={2} />
            {t("freeShipping")}
          </Badge>
        )}
      </div>
    </div>
  );
}

export type { ProductHeaderProps };
