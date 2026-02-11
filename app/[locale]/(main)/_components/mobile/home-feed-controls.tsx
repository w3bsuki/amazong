"use client"

import { ArrowDown, ArrowUp, Clock, GearSix, MapPin, Megaphone, SquaresFour, Star } from "@phosphor-icons/react"
import type { Icon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { HomeFeedSort, HomeFeedTab } from "@/hooks/use-home-feed-tabs"
import { getHomeChipClass, getHomeChipIconClass } from "./home-chip-styles"

interface HomeFeedControlsProps {
  tab: HomeFeedTab
  sort: HomeFeedSort
  nearby: boolean
  cityLabel?: string | null
  onTabChange: (tab: HomeFeedTab) => void
  onSortChange: (sort: HomeFeedSort) => void
  onNearbyToggle: () => void
  onNearbyConfigure: () => void
  className?: string
}

const SORT_CHIP_CONFIG: ReadonlyArray<{
  value: HomeFeedSort
  labelKey: "newest" | "priceLow" | "priceHigh" | "topRated"
  testId: string
  icon: Icon
}> = [
  { value: "newest", labelKey: "newest", testId: "home-feed-chip-sort-newest", icon: Clock },
  { value: "price-asc", labelKey: "priceLow", testId: "home-feed-chip-sort-price-asc", icon: ArrowDown },
  { value: "price-desc", labelKey: "priceHigh", testId: "home-feed-chip-sort-price-desc", icon: ArrowUp },
  { value: "rating", labelKey: "topRated", testId: "home-feed-chip-sort-rating", icon: Star },
]

export function HomeFeedControls({
  tab,
  sort,
  nearby,
  cityLabel,
  onTabChange,
  onSortChange,
  onNearbyToggle,
  onNearbyConfigure,
  className,
}: HomeFeedControlsProps) {
  const tMobile = useTranslations("Home.mobile")
  const isPromoted = tab === "promoted"
  const nearbyLabel = nearby && cityLabel
    ? tMobile("feed.nearbyWithCity", { city: cityLabel })
    : tMobile("feed.nearby")

  return (
    <section
      data-testid="home-feed-controls"
      className={cn("px-(--spacing-home-inset)", className)}
      aria-label={tMobile("feed.controlsAria")}
    >
      <div
        className="-mx-0.5 overflow-x-auto no-scrollbar touch-pan-x"
        data-testid="home-feed-tabs"
        aria-label={tMobile("feed.tabsAria")}
      >
        <div className="flex w-max items-center gap-1.5 px-0.5">
          <button
            type="button"
            data-testid="home-feed-tab-promoted"
            aria-pressed={isPromoted}
            onClick={() => onTabChange("promoted")}
            className={getHomeChipClass({ active: isPromoted, className: "gap-1" })}
          >
            <Megaphone
              size={14}
              weight="regular"
              aria-hidden="true"
              className={cn("shrink-0", getHomeChipIconClass(isPromoted))}
            />
            {tMobile("feed.tabs.promoted")}
          </button>

          <button
            type="button"
            data-testid="home-feed-tab-all"
            aria-pressed={!isPromoted}
            onClick={() => onTabChange("all")}
            className={getHomeChipClass({ active: !isPromoted, className: "gap-1" })}
          >
            <SquaresFour
              size={14}
              weight="regular"
              aria-hidden="true"
              className={cn("shrink-0", getHomeChipIconClass(!isPromoted))}
            />
            {tMobile("feed.tabs.all")}
          </button>

          <div aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-border-subtle" />

          {SORT_CHIP_CONFIG.map((chip) => {
            const isActive = sort === chip.value
            const Icon = chip.icon
            return (
              <button
                key={chip.value}
                type="button"
                data-testid={chip.testId}
                aria-pressed={isActive}
                onClick={() => onSortChange(chip.value)}
                className={getHomeChipClass({ active: isActive, className: "gap-1" })}
              >
                <Icon
                  size={14}
                  weight="regular"
                  aria-hidden="true"
                  className={cn("shrink-0", getHomeChipIconClass(isActive))}
                />
                {tMobile(`feed.sort.${chip.labelKey}`)}
              </button>
            )
          })}

          <button
            type="button"
            data-testid="home-feed-chip-nearby"
            aria-pressed={nearby}
            onClick={onNearbyToggle}
            className={getHomeChipClass({
              active: nearby,
              className: "max-w-44 gap-1",
            })}
          >
            <MapPin
              size={14}
              weight="regular"
              aria-hidden="true"
              className={cn("shrink-0", getHomeChipIconClass(nearby))}
            />
            <span className="truncate">{nearbyLabel}</span>
          </button>

          {nearby && (
            <button
              type="button"
              data-testid="home-feed-city-configure"
              aria-label={tMobile("feed.chooseCityTitle")}
              onClick={onNearbyConfigure}
              className="inline-flex size-(--spacing-touch-md) shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background text-muted-foreground tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <GearSix size={14} weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
