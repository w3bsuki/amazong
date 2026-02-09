"use client"

import { Crosshair, MapPin } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
          <Select
            value={currentCity ?? "all"}
            onValueChange={(value) => onCityChange(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectCity")} />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <SelectItem value="all">
                <span className="flex items-center gap-2">
                  <MapPin size={14} weight="regular" />
                  {t("anyLocation")}
                </span>
              </SelectItem>
              {BULGARIAN_CITIES.filter((city) => city.value !== "other").map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {locale === "bg" ? city.labelBg : city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
              <Crosshair size={16} weight="regular" className="text-primary" />
              {t("nearMe")}
            </span>
          </label>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
