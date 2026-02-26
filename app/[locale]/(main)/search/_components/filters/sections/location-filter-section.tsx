import { ChevronDown, Crosshair, MapPin } from "lucide-react"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"

interface LocationFilterSectionProps {
  locale: string
  currentCity: string | null
  currentNearby: boolean
  onCityChange: (city: string | null) => void
  onToggleNearby: () => void
}

export function LocationFilterSection({
  locale,
  currentCity,
  currentNearby,
  onCityChange,
  onToggleNearby,
}: LocationFilterSectionProps) {
  const t = useTranslations("SearchFilters")

  return (
    <AccordionItem value="location" className="border-b-0">
      <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
        {t("location")}
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <div className="space-y-3">
          <div className="relative">
            <label className="sr-only" htmlFor="city">
              {t("selectCity")}
            </label>
            <div className="flex h-(--control-default) w-full items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm focus-within:ring-2 focus-within:ring-ring">
              <MapPin size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
              <select
                id="city"
                value={currentCity ?? "all"}
                onChange={(event) => onCityChange(event.target.value === "all" ? null : event.target.value)}
                className="h-full w-full flex-1 bg-transparent outline-none appearance-none pr-5"
              >
                <option value="all">{t("anyLocation")}</option>
                {BULGARIAN_CITIES.filter((city) => city.value !== "other").map((city) => (
                  <option key={city.value} value={city.value}>
                    {locale === "bg" ? city.labelBg : city.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>

          <label
            htmlFor="nearby"
            className={cn(
              "flex min-h-11 items-center gap-3 px-2 -mx-2 rounded-md cursor-pointer transition-colors",
              currentNearby
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-muted text-sidebar-foreground",
            )}
          >
            <Checkbox
              id="nearby"
              checked={currentNearby}
              onCheckedChange={onToggleNearby}
            />
            <span className="text-sm flex items-center gap-1.5">
              <Crosshair size={16} className="text-primary" />
              {t("nearMe")}
            </span>
          </label>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

