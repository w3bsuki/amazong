
import { Minus, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"

type QuantityStepperProps = {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
}: QuantityStepperProps) {
  const tSell = useTranslations("Sell")

  return (
    <div className="flex items-center h-12 w-fit rounded-md border border-border bg-background shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-full px-4 flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation border-r border-border-subtle"
        aria-label={tSell("steps.pricing.quantityDecreaseAriaLabel")}
      >
        <Minus className="size-4" />
      </button>
      <Input
        type="number"
        value={value}
        onChange={(event) => {
          const num = Number.parseInt(event.target.value, 10)
          if (!Number.isNaN(num)) {
            onChange(Math.max(min, Math.min(max, num)))
          }
        }}
        className="w-14 h-full text-center text-base font-bold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-full px-4 flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation border-l border-border-subtle"
        aria-label={tSell("steps.pricing.quantityIncreaseAriaLabel")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
