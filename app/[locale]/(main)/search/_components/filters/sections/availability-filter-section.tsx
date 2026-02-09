"use client"

import { Package } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface AvailabilityFilterSectionProps {
  currentAvailability: string | null
  onAvailabilityChange: (value: string | null) => void
}

export function AvailabilityFilterSection({
  currentAvailability,
  onAvailabilityChange,
}: AvailabilityFilterSectionProps) {
  const t = useTranslations("SearchFilters")
  const isInStock = currentAvailability === "instock"

  return (
    <AccordionItem value="availability" className="border-b-0">
      <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
        {t("availability")}
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <label
          htmlFor="instock"
          className={cn(
            "flex min-h-11 items-center gap-3 px-2 -mx-2 rounded-md cursor-pointer transition-colors",
            isInStock
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-muted text-sidebar-foreground",
          )}
        >
          <Checkbox
            id="instock"
            checked={isInStock}
            onCheckedChange={() => onAvailabilityChange(isInStock ? null : "instock")}
          />
          <span className="text-sm flex items-center gap-1.5">
            <Package size={16} weight="regular" className="text-stock-available" />
            {t("includeOutOfStock")}
          </span>
        </label>
      </AccordionContent>
    </AccordionItem>
  )
}
