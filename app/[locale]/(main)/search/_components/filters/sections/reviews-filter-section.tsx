"use client"

import { Check, Star } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ReviewsFilterSectionProps {
  currentRating: string | null
  onRatingChange: (value: string | null) => void
}

export function ReviewsFilterSection({ currentRating, onRatingChange }: ReviewsFilterSectionProps) {
  const t = useTranslations("SearchFilters")

  return (
    <AccordionItem value="reviews" className="border-b-0">
      <AccordionTrigger className="py-3 text-sm font-semibold text-sidebar-foreground hover:no-underline hover:text-sidebar-accent-foreground">
        {t("customerReviews")}
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <div className="space-y-0.5">
          {[4, 3, 2, 1].map((stars) => {
            const isActive = currentRating === stars.toString()
            return (
              <button
                key={stars}
                type="button"
                aria-pressed={isActive}
                className={cn(
                  "w-full flex items-center gap-2 py-2 px-2 -mx-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-muted text-sidebar-foreground",
                )}
                onClick={() => onRatingChange(isActive ? null : stars.toString())}
              >
                <div className="flex text-rating">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      weight={index < stars ? "fill" : "regular"}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-sm">{t("andUp")}</span>
                {isActive && <Check size={16} weight="regular" className="ml-auto text-primary" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
