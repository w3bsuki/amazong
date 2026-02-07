"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { FilterCheckboxItem } from "@/components/shared/filters/filter-checkbox-item"
import { FilterRadioGroup, FilterRadioItem } from "@/components/shared/filters/filter-radio-group"
import { SortModal } from "@/components/shared/filters/sort-modal"

const HOME_NEWEST_SORT_OPTIONS = ["newest", "price-asc", "price-desc", "rating"] as const

export type HomeNewestSort = (typeof HOME_NEWEST_SORT_OPTIONS)[number]

interface HomeNewestControlsProps {
  locale: string
  sort: HomeNewestSort
  city: string | null
  nearby: boolean
  onSortChange: (sort: HomeNewestSort) => void
  onLocationApply: (next: { city: string | null; nearby: boolean }) => void
  isLoading?: boolean
  className?: string
}

function isHomeNewestSort(value: string): value is HomeNewestSort {
  return HOME_NEWEST_SORT_OPTIONS.includes(value as HomeNewestSort)
}

export function HomeNewestControls({
  locale,
  sort,
  city,
  nearby,
  onSortChange,
  onLocationApply,
  isLoading = false,
  className,
}: HomeNewestControlsProps) {
  const tFilters = useTranslations("SearchFilters")
  const tCommon = useTranslations("Common")

  const [sortOpen, setSortOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [pendingCity, setPendingCity] = useState<string | null>(city)
  const [pendingNearby, setPendingNearby] = useState(nearby)

  useEffect(() => {
    if (!locationOpen) return
    setPendingCity(city)
    setPendingNearby(nearby)
  }, [city, locationOpen, nearby])

  const cityLabel = useMemo(() => {
    if (!city) return null
    const match = BULGARIAN_CITIES.find((entry) => entry.value === city)
    if (!match) return city
    return locale === "bg" ? match.labelBg : match.label
  }, [city, locale])

  const locationLabel = useMemo(() => {
    if (cityLabel && nearby) return `${cityLabel} · ${tFilters("nearMe")}`
    if (cityLabel) return cityLabel
    if (nearby) return tFilters("nearMe")
    return tFilters("anyLocation")
  }, [cityLabel, nearby, tFilters])

  const sortLabel = useMemo(() => {
    if (sort === "price-asc") return tFilters("priceLowHigh")
    if (sort === "price-desc") return tFilters("priceHighLow")
    if (sort === "rating") return tFilters("avgReview")
    return tFilters("newestArrivals")
  }, [sort, tFilters])

  const handleSortChange = useCallback(
    (value: string) => {
      if (!isHomeNewestSort(value)) return
      onSortChange(value)
    },
    [onSortChange]
  )

  const handleApplyLocation = useCallback(() => {
    const normalizedCity = pendingCity && pendingCity.length > 0 ? pendingCity : null
    const normalizedNearby = normalizedCity ? pendingNearby : false
    onLocationApply({ city: normalizedCity, nearby: normalizedNearby })
    setLocationOpen(false)
  }, [onLocationApply, pendingCity, pendingNearby])

  return (
    <>
      <div
        data-testid="home-newest-controls"
        className={cn("px-(--spacing-home-inset) pt-1.5", className)}
      >
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSortOpen(true)}
            disabled={isLoading}
            className={cn(
              "min-h-(--spacing-touch-sm) flex-1 justify-start gap-2 rounded-full border-border-subtle bg-background px-3.5 text-sm font-semibold text-foreground shadow-none",
              "tap-transparent transition-colors hover:bg-hover active:bg-active"
            )}
            aria-haspopup="dialog"
            aria-label={`${tFilters("sortBy")}: ${sortLabel}`}
            data-testid="home-newest-sort-trigger"
          >
            <ArrowUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate">{sortLabel}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setLocationOpen(true)}
            disabled={isLoading}
            className={cn(
              "min-h-(--spacing-touch-sm) flex-1 justify-start gap-2 rounded-full border-border-subtle bg-background px-3.5 text-sm font-semibold text-foreground shadow-none",
              "tap-transparent transition-colors hover:bg-hover active:bg-active"
            )}
            aria-haspopup="dialog"
            aria-label={`${tFilters("location")}: ${locationLabel}`}
            data-testid="home-newest-location-trigger"
          >
            <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate">{locationLabel}</span>
          </Button>
        </div>
      </div>

      <SortModal
        open={sortOpen}
        onOpenChange={setSortOpen}
        locale={locale}
        value={sort}
        onValueChange={handleSortChange}
        excludeOptions={["featured"]}
      />

      <Drawer open={locationOpen} onOpenChange={setLocationOpen}>
        <DrawerContent
          data-testid="home-newest-location-drawer"
          className="max-h-dialog-sm rounded-t-2xl lg:hidden"
          aria-label={tFilters("location")}
        >
          <DrawerHeader className="px-inset pt-4 pb-3 border-b border-border/50">
            <DrawerTitle className="text-base font-semibold text-center">
              {tFilters("location")}
            </DrawerTitle>
          </DrawerHeader>

          <DrawerBody className="px-inset py-2">
            <FilterRadioGroup
              value={pendingCity ?? ""}
              onValueChange={(value) => setPendingCity(value || null)}
              className="-mx-inset"
            >
              <FilterRadioItem
                value=""
                fullBleed
              >
                {tFilters("anyLocation")}
              </FilterRadioItem>
              {BULGARIAN_CITIES.filter((entry) => entry.value !== "other")
                .slice(0, 15)
                .map((entry) => (
                  <FilterRadioItem key={entry.value} value={entry.value} fullBleed>
                    {locale === "bg" ? entry.labelBg : entry.label}
                  </FilterRadioItem>
                ))}
            </FilterRadioGroup>

            <div className="-mx-inset mt-3 border-t border-border">
              <FilterCheckboxItem
                checked={pendingNearby}
                onCheckedChange={setPendingNearby}
                fullBleed
              >
                {tFilters("nearMe")}
              </FilterCheckboxItem>
            </div>
          </DrawerBody>

          <DrawerFooter className="px-inset border-t border-border bg-background">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => setLocationOpen(false)}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="button"
                className="flex-1 rounded-full"
                onClick={handleApplyLocation}
                data-testid="home-newest-location-apply"
              >
                {tCommon("apply")}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export type { HomeNewestControlsProps }
