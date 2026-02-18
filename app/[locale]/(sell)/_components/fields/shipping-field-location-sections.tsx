import { ChevronRight as CaretRight, House, MapPin } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldError } from "@/components/shared/field"
import { cn } from "@/lib/utils"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { SelectDrawer } from "../ui/select-drawer"

const SHIPPING_REGIONS = [
  {
    id: "bulgaria",
    field: "shipsToBulgaria" as const,
    icon: House,
    carriers: ["Speedy", "Econt"],
  },
  {
    id: "pickup",
    field: "pickupOnly" as const,
    icon: MapPin,
    carriers: [],
  },
] as const

export type ShippingRegionValues = {
  shipsToBulgaria: boolean
  pickupOnly: boolean
}

export function ShippingRegionsSection({
  values,
  hasError,
  onToggle,
  tSell,
}: {
  values: ShippingRegionValues
  hasError: boolean
  onToggle: (field: keyof ShippingRegionValues) => void
  tSell: (key: string) => string
}) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">{tSell("shipping.regionsTitle")}</Label>
      <div className="grid gap-3 sm:grid-cols-2">
        {SHIPPING_REGIONS.map((region) => {
          const copy = region.id === "bulgaria"
            ? {
                label: tSell("shipping.regions.bulgaria.label"),
                description: tSell("shipping.regions.bulgaria.description"),
                deliveryTime: tSell("shipping.regions.bulgaria.deliveryTime"),
              }
            : {
                label: tSell("shipping.regions.pickup.label"),
                description: tSell("shipping.regions.pickup.description"),
                deliveryTime: tSell("shipping.regions.pickup.deliveryTime"),
              }

          const Icon = region.icon
          const isSelected = values[region.field]

          return (
            <label
              key={region.id}
              className={cn(
                "relative flex items-start gap-3 p-3 rounded-md border text-left transition-colors w-full cursor-pointer",
                isSelected
                  ? "border-selected-border bg-selected shadow-xs"
                  : "border-border bg-background hover:border-hover-border"
              )}
            >
              <div className={cn(
                "size-9 rounded-full flex items-center justify-center shrink-0 border",
                isSelected ? "bg-selected border-selected-border" : "bg-surface-subtle border-border-subtle"
              )}>
                <Icon className={cn("size-4.5", isSelected ? "text-primary" : "text-muted-foreground")} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-bold text-sm tracking-tight",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {copy.label}
                  </span>
                  <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                    {copy.deliveryTime}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {copy.description}
                </p>
                {region.carriers.length > 0 && isSelected && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {region.carriers.map((carrier) => (
                      <span
                        key={carrier}
                        className="text-2xs font-bold px-1.5 py-0.5 rounded-md bg-surface-subtle text-primary border border-border"
                      >
                        {carrier}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(region.field)}
                className="size-4.5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                aria-label={copy.label}
              />
            </label>
          )
        })}
      </div>
      {hasError && <FieldError>{tSell("validation.shippingRegionRequired")}</FieldError>}
    </div>
  )
}

export function ShippingCitySection({
  compact,
  shipsToBulgaria,
  pickupOnly,
  sellerCity,
  isBg,
  isDrawerOpen,
  onDrawerOpenChange,
  onCityChange,
  tSell,
}: {
  compact: boolean
  shipsToBulgaria: boolean
  pickupOnly: boolean
  sellerCity: string
  isBg: boolean
  isDrawerOpen: boolean
  onDrawerOpenChange: (open: boolean) => void
  onCityChange: (city: string) => void
  tSell: (key: string) => string
}) {
  if (!shipsToBulgaria && !pickupOnly) return null

  const cityOptions = BULGARIAN_CITIES.map((city) => city.label)
  const cityOptionsBg = BULGARIAN_CITIES.map((city) => city.labelBg)
  const selectedCityLabel = BULGARIAN_CITIES.find((city) => city.value === sellerCity)?.[isBg ? "labelBg" : "label"]

  return (
    <div className="space-y-2">
      {compact ? (
        <>
          <button
            type="button"
            onClick={() => onDrawerOpenChange(true)}
            className={cn(
              "w-full flex items-center gap-3.5 min-h-16 px-4 py-3 rounded-xl border text-left transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              sellerCity
                ? "border-selected-border bg-selected"
                : "border-border bg-card hover:bg-hover"
            )}
          >
            <div className={cn(
              "size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              sellerCity ? "bg-selected text-primary" : "bg-muted text-muted-foreground"
            )}>
              <MapPin className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {tSell("shipping.shipsFromLabel")}
                </span>
                <span className="text-destructive text-xs">*</span>
              </div>
              <span className={cn(
                "text-base font-semibold truncate block mt-0.5",
                sellerCity ? "text-foreground" : "text-text-subtle"
              )}>
                {selectedCityLabel || tSell("shipping.selectCityPlaceholder")}
              </span>
            </div>
            <CaretRight className={cn(
              "size-5 shrink-0 transition-colors",
              sellerCity ? "text-primary" : "text-text-subtle"
            )} />
          </button>
          <SelectDrawer
            isOpen={isDrawerOpen}
            onClose={() => onDrawerOpenChange(false)}
            title={tSell("shipping.selectCityTitle")}
            options={BULGARIAN_CITIES.map((city) => city.value)}
            displayOptions={isBg ? cityOptionsBg : cityOptions}
            value={sellerCity}
            onChange={onCityChange}
            locale={isBg ? "bg" : "en"}
          />
        </>
      ) : (
        <>
          <Label className="text-sm font-semibold">{tSell("shipping.cityLabel")} *</Label>
          <Select value={sellerCity} onValueChange={onCityChange}>
            <SelectTrigger className="h-(--control-primary) rounded-md border-border font-medium">
              <SelectValue placeholder={tSell("shipping.selectCityPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {BULGARIAN_CITIES.map((city) => (
                <SelectItem key={city.value} value={city.value} className="font-medium">
                  {isBg ? city.labelBg : city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
      <p className="text-xs text-muted-foreground font-medium px-1">{tSell("shipping.shipsFromHint")}</p>
    </div>
  )
}
