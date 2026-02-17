import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PriceFilterSectionProps {
  locale: string
  currentMinPrice: string | null
  currentMaxPrice: string | null
  priceMin: string
  priceMax: string
  onPriceMinChange: (value: string) => void
  onPriceMaxChange: (value: string) => void
  onApplyPriceInputs: () => void
  onPricePresetClick: (min: string | null, max: string | null) => void
}

export function PriceFilterSection({
  locale,
  currentMinPrice,
  currentMaxPrice,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onApplyPriceInputs,
  onPricePresetClick,
}: PriceFilterSectionProps) {
  const t = useTranslations("SearchFilters")

  const presets = [
    { label: locale === "bg" ? "Под 25" : "Under 25", min: null, max: "25" },
    { label: "25-50", min: "25", max: "50" },
    { label: "50-100", min: "50", max: "100" },
    { label: "100-200", min: "100", max: "200" },
    { label: locale === "bg" ? "Над 200" : "200+", min: "200", max: null },
  ]

  return (
    <AccordionItem value="price" className="border-b-0">
      <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
        {t("price")}
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder={t("min")}
                value={priceMin}
                onChange={(event) => onPriceMinChange(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onApplyPriceInputs()}
                className="text-sm"
                min={0}
              />
            </div>
            <span className="text-muted-foreground text-sm">-</span>
            <div className="flex-1">
              <Input
                type="number"
                placeholder={t("max")}
                value={priceMax}
                onChange={(event) => onPriceMaxChange(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onApplyPriceInputs()}
                className="text-sm"
                min={0}
              />
            </div>
            <Button
              size="default"
              variant="secondary"
              onClick={onApplyPriceInputs}
              className="px-3"
            >
              {t("go")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {presets.map(({ label, min, max }) => {
              const isActive = currentMinPrice === min && currentMaxPrice === max
              return (
                <button
                  key={label}
                  type="button"
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-muted",
                  )}
                  onClick={() => onPricePresetClick(min, max)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

