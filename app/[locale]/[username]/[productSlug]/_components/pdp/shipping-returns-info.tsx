import { useTranslations } from "next-intl";
import { Package, RotateCcw, ShieldCheck } from "lucide-react";

interface ShippingReturnsInfoProps {
  pickupOnly: boolean;
}

/**
 * Shipping, returns, and buyer protection information cards.
 */
export function ShippingReturnsInfo({ pickupOnly }: ShippingReturnsInfoProps) {
  const t = useTranslations("Product");

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("shippingReturns")}
      </h3>
      <div className="space-y-2">
        {/* Shipping */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted">
          <Package className="size-5 text-muted-foreground shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-foreground">{t("shippingTitle")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {!pickupOnly ? t("freeDelivery") : t("defaultShipping")}
            </p>
          </div>
        </div>
        {/* Returns */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted">
          <RotateCcw className="size-5 text-muted-foreground shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-foreground">{t("returnsTitle")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("defaultReturns")}</p>
          </div>
        </div>
        {/* Buyer Protection */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted border border-border">
          <ShieldCheck className="size-5 text-muted-foreground shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-foreground">{t("buyerProtection")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("buyerProtectionDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { ShippingReturnsInfoProps };

