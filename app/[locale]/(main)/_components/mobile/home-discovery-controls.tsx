"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Clock,
  GearSix,
  MapPin,
  SquaresFour,
  Star,
} from "@phosphor-icons/react"
import type { Icon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { HomeDiscoverySort } from "@/hooks/use-home-discovery-feed"
import { getHomeChipClass, getHomeChipIconClass } from "./home-chip-styles"

interface HomeDiscoveryControlsProps {
  sort: HomeDiscoverySort
  nearby: boolean
  cityLabel?: string | null
  onSortChange: (sort: HomeDiscoverySort) => void
  onNearbyToggle: () => void
  onNearbyConfigure: () => void
  sticky?: boolean
  className?: string
}

const SORT_CHIP_CONFIG: ReadonlyArray<{
  value: HomeDiscoverySort
  labelKey: "all" | "newest" | "priceLow" | "priceHigh" | "topRated"
  testId: string
  icon: Icon
  /** When true this chip matches when sort equals the `value` AND is the initial/default state */
  isDefault?: boolean
}> = [
  { value: "newest", labelKey: "all", testId: "home-feed-chip-sort-all", icon: SquaresFour, isDefault: true },
  { value: "newest", labelKey: "newest", testId: "home-feed-chip-sort-newest", icon: Clock },
  { value: "price-asc", labelKey: "priceLow", testId: "home-feed-chip-sort-price-asc", icon: ArrowDown },
  { value: "price-desc", labelKey: "priceHigh", testId: "home-feed-chip-sort-price-desc", icon: ArrowUp },
  { value: "rating", labelKey: "topRated", testId: "home-feed-chip-sort-rating", icon: Star },
]

export function HomeDiscoveryControls({
  sort,
  nearby,
  cityLabel,
  onSortChange,
  onNearbyToggle,
  onNearbyConfigure,
  sticky = true,
  className,
}: HomeDiscoveryControlsProps) {
  const tMobile = useTranslations("Home.mobile")
  /* Track which chip label is visually active — needed because "all" and "newest" both map to sort="newest" */
  const [activeChipKey, setActiveChipKey] = useState<string>("all")
  const nearbyLabel = nearby && cityLabel
    ? tMobile("feed.nearbyWithCity", { city: cityLabel })
    : tMobile("feed.nearby")

  function handleChipClick(chip: (typeof SORT_CHIP_CONFIG)[number]) {
    setActiveChipKey(chip.labelKey)
    onSortChange(chip.value)
  }

  return (
    <section
      data-testid="home-feed-controls"
      data-slot="home-discovery-controls"
      className={cn(
        sticky
          ? "sticky top-(--app-header-offset) z-30 bg-surface-glass backdrop-blur-sm shadow-2xs"
          : "",
        className
      )}
      aria-label={tMobile("feed.controlsAria")}
    >
      <div className="px-(--spacing-home-inset) py-1">
        <div className="-mx-0.5 overflow-x-auto no-scrollbar touch-pan-x">
          <div className="flex w-max items-center gap-1.5 px-0.5">
            {SORT_CHIP_CONFIG.map((chip) => {
              const isActive = activeChipKey === chip.labelKey
              const Icon = chip.icon
              return (
                <button
                  key={chip.labelKey}
                  type="button"
                  data-testid={chip.testId}
                  aria-pressed={isActive}
                  onClick={() => handleChipClick(chip)}
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

            <div aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-border-subtle" />

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
      </div>
    </section>
  )
}

