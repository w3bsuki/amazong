import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketplaceBadge } from "@/components/shared/marketplace-badge";
import { getConditionBadgeVariant, getConditionKey } from "@/components/shared/product/condition";
import { formatPrice } from "@/lib/price";

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
  isNegotiable,
  locale,
}: ProductHeaderProps) {
  const t = useTranslations("Product");

  return (
    <div className="space-y-1.5">
      {/* Price first (most important) */}
      {price > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-foreground">{formatPrice(price, { locale })}</p>
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
          <MarketplaceBadge variant={getConditionBadgeVariant(condition)}>
            {(() => {
              const key = getConditionKey(condition);
              return key ? t(key) : condition;
            })()}
          </MarketplaceBadge>
        )}
        {freeShipping && (
          <MarketplaceBadge variant="shipping">
            <Truck className="size-3" strokeWidth={2} />
            {t("freeShipping")}
          </MarketplaceBadge>
        )}
      </div>
    </div>
  );
}

export type { ProductHeaderProps };

