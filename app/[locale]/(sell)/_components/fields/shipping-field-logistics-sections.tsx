import { ChevronRight as CaretRight, Package, Truck } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { SelectDrawer } from "../ui/select-drawer"

const DIMENSION_FIELDS: Array<{
  key: "lengthCm" | "widthCm" | "heightCm" | "weightKg"
  labelKey: string
  unit: string
  step?: string
}> = [
  { key: "lengthCm", labelKey: "shipping.dimensions.lengthLabel", unit: "cm" },
  { key: "widthCm", labelKey: "shipping.dimensions.widthLabel", unit: "cm" },
  { key: "heightCm", labelKey: "shipping.dimensions.heightLabel", unit: "cm" },
  { key: "weightKg", labelKey: "shipping.dimensions.weightLabel", unit: "kg", step: "0.1" },
]

export function ShippingDimensionsSection({
  dimensions,
  onChange,
  tSell,
}: {
  dimensions: { lengthCm?: number; widthCm?: number; heightCm?: number; weightKg?: number } | undefined
  onChange: (dims: { lengthCm?: number; widthCm?: number; heightCm?: number; weightKg?: number }) => void
  tSell: (key: string) => string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Package className="size-4 text-muted-foreground" />
        <Label className="text-sm font-semibold">
          {tSell("shipping.dimensions.title")} <span className="font-normal opacity-60">{tSell("common.optionalParenthetical")}</span>
        </Label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DIMENSION_FIELDS.map((entry) => (
          <div key={entry.key} className="space-y-1.5">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{tSell(entry.labelKey)}</Label>
            <div className="relative">
              <Input
                type="number"
                {...(entry.step ? { step: entry.step } : {})}
                placeholder="0"
                value={dimensions?.[entry.key] || ""}
                onChange={(event) => onChange({
                  ...(dimensions ?? {}),
                  ...(event.target.value ? { [entry.key]: Number(event.target.value) } : {}),
                })}
                className="h-10 pr-8 rounded-lg border-border font-medium"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xs font-bold text-muted-foreground">{entry.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ShippingProcessingSection({
  compact,
  processingDays,
  isBg,
  isDrawerOpen,
  onDrawerOpenChange,
  onChange,
  tSell,
}: {
  compact: boolean
  processingDays: number
  isBg: boolean
  isDrawerOpen: boolean
  onDrawerOpenChange: (open: boolean) => void
  onChange: (days: number) => void
  tSell: (key: string, values?: { count: number }) => string
}) {
  const options = [1, 2, 3, 5, 7, 10, 14]
  const processingDisplayOptions = options.map((value) => tSell("shipping.processing.days", { count: value }))

  return (
    <div className="space-y-2">
      {compact ? (
        <>
          <button
            type="button"
            onClick={() => onDrawerOpenChange(true)}
            className="relative w-full flex items-center h-12 px-4 rounded-md border border-border bg-background hover:border-hover-border transition-colors text-left shadow-xs"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                {tSell("shipping.processing.inlineLabel")}
              </span>
              <span className="text-sm font-semibold text-foreground truncate">
                {tSell("shipping.processing.days", { count: processingDays })}
              </span>
            </div>
            <CaretRight className="size-4 text-text-subtle shrink-0 ml-2" />
          </button>
          <SelectDrawer
            isOpen={isDrawerOpen}
            onClose={() => onDrawerOpenChange(false)}
            title={tSell("shipping.processing.title")}
            options={options.map((value) => String(value))}
            displayOptions={processingDisplayOptions}
            value={String(processingDays)}
            onChange={(value) => onChange(Number(value))}
            locale={isBg ? "bg" : "en"}
          />
        </>
      ) : (
        <>
          <Label className="text-sm font-semibold">{tSell("shipping.processing.title")}</Label>
          <Select value={String(processingDays)} onValueChange={(value) => onChange(Number(value))}>
            <SelectTrigger className="h-(--control-primary) w-44 rounded-md border-border font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((days) => (
                <SelectItem key={days} value={String(days)} className="font-medium">
                  {tSell("shipping.processing.days", { count: days })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
      <p className="text-xs text-muted-foreground font-medium px-1">{tSell("shipping.processing.hint")}</p>
    </div>
  )
}

export function ShippingPriceSection({
  freeShipping,
  shippingPrice,
  onFreeShippingChange,
  onShippingPriceChange,
  tSell,
}: {
  freeShipping: boolean
  shippingPrice: string
  onFreeShippingChange: (checked: boolean) => void
  onShippingPriceChange: (value: string) => void
  tSell: (key: string) => string
}) {
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onFreeShippingChange(!freeShipping)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            onFreeShippingChange(!freeShipping)
          }
        }}
        className={cn(
          "w-full flex items-center gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          freeShipping
            ? "border-selected-border bg-selected"
            : "border-border bg-card hover:bg-hover"
        )}
      >
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all",
          freeShipping ? "bg-selected text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Truck className="size-5" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <span className="text-base font-semibold block">{tSell("shipping.freeShipping.title")}</span>
          <span className="text-sm text-muted-foreground line-clamp-1">{tSell("shipping.freeShipping.description")}</span>
        </div>
        <Switch checked={freeShipping} onCheckedChange={onFreeShippingChange} className="shrink-0 scale-110" />
      </div>

      {!freeShipping && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-foreground">{tSell("shipping.shippingPriceLabel")}</label>
          </div>
          <div className={cn(
            "flex items-center h-14 px-4 rounded-xl border bg-card transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring"
          )}>
            <span className="text-base font-bold text-muted-foreground mr-2">лв</span>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={shippingPrice}
              onChange={(event) => onShippingPriceChange(event.target.value)}
              className="border-none bg-transparent h-full text-lg font-semibold p-0 focus-visible:ring-0 flex-1"
            />
          </div>
        </div>
      )}
    </>
  )
}
