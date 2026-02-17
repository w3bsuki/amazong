import { useTranslations } from "next-intl";
import { MapPin, Truck } from "lucide-react";

interface DeliveryOptionsProps {
  pickupOnly: boolean;
  freeShipping: boolean;
}

/**
 * Delivery options display (pickup, shipping, free shipping badges).
 */
export function DeliveryOptions({ pickupOnly, freeShipping }: DeliveryOptionsProps) {
  const t = useTranslations("Product");

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("delivery")}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
          <MapPin className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
          {pickupOnly ? t("pickupOnly") : t("meetup")}
        </span>
        {!pickupOnly && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
            <Truck className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
            {t("shipping")}
          </span>
        )}
        {freeShipping && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
            <Truck className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
            {t("freeShipping")}
          </span>
        )}
      </div>
    </div>
  );
}

export type { DeliveryOptionsProps };

