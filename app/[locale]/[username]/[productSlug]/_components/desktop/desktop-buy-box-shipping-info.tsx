import { Clock, MapPin, Truck } from "lucide-react"

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

type DesktopBuyBoxShippingInfoProps = {
  isRealEstate: boolean
  isAutomotive: boolean
  freeShipping: boolean
  location?: string | null | undefined
  t: TranslateFn
}

export function DesktopBuyBoxShippingInfo({
  isRealEstate,
  isAutomotive,
  freeShipping,
  location,
  t,
}: DesktopBuyBoxShippingInfoProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-subtle p-2.5 space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {isRealEstate ? (
            <>
              <MapPin className="size-4 text-foreground" />
              <span className="font-medium text-foreground">{location || t("locationTBA")}</span>
            </>
          ) : (
            <>
              <Truck className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {freeShipping ? t("freeShipping") : t("shippingAvailable")}
              </span>
            </>
          )}
        </div>
      </div>
      {!isRealEstate && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {isAutomotive ? t("pickupAvailable") : t("delivery2to3Days")}
          </span>
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {location}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
