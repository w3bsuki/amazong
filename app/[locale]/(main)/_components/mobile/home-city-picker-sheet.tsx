"use client"

import { useEffect, useMemo, useState } from "react"
import { MapPin } from "lucide-react"

import { useTranslations } from "next-intl"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { cn } from "@/lib/utils"
import {
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HomeCityPickerSheetProps {
  open: boolean
  locale: string
  selectedCity: string | null
  onOpenChange: (open: boolean) => void
  onSelectCity: (city: string) => void
}

export function HomeCityPickerSheet({
  open,
  locale,
  selectedCity,
  onOpenChange,
  onSelectCity,
}: HomeCityPickerSheetProps) {
  const tMobile = useTranslations("Home.mobile")
  const tCommon = useTranslations("Common")
  const [query, setQuery] = useState("")
  const [pendingCity, setPendingCity] = useState<string | null>(selectedCity)

  useEffect(() => {
    if (!open) return
    setPendingCity(selectedCity)
    setQuery("")
  }, [open, selectedCity])

  const cityOptions = useMemo(
    () =>
      BULGARIAN_CITIES
        .filter((city) => city.value !== "other")
        .filter((city) => {
          const normalized = query.trim().toLowerCase()
          if (!normalized) return true
          return (
            city.value.includes(normalized) ||
            city.label.toLowerCase().includes(normalized) ||
            city.labelBg.toLowerCase().includes(normalized)
          )
        }),
    [query]
  )

  const handleApply = () => {
    if (!pendingCity) return
    onSelectCity(pendingCity)
    onOpenChange(false)
  }

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title={tMobile("feed.chooseCityTitle")}
      headerLayout="centered"
      closeLabel={tCommon("close")}
      contentAriaLabel={tMobile("feed.chooseCityTitle")}
      contentClassName="max-h-dialog-md lg:hidden"
      headerClassName="border-border-subtle px-inset pt-4 pb-3"
      titleClassName="text-base font-semibold tracking-tight"
    >
      <DrawerBody className="px-inset py-3 pb-2">
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder={tMobile("feed.chooseCitySearchPlaceholder")}
          className="h-11"
        />

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-1">
            {cityOptions.length === 0 && (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                {tMobile("feed.chooseCityNoResults")}
              </p>
            )}

            {cityOptions.map((city) => {
              const label = locale === "bg" ? city.labelBg : city.label
              const isSelected = pendingCity === city.value
              return (
                <button
                  key={city.value}
                  type="button"
                  data-testid={`home-city-option-${city.value}`}
                  onClick={() => setPendingCity(city.value)}
                  className={cn(
                    "flex min-h-(--spacing-touch-md) w-full items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isSelected
                      ? "border-selected-border bg-selected text-selected-foreground"
                      : "border-border-subtle bg-background text-foreground hover:bg-hover active:bg-active"
                  )}
                >
                  <span className="min-w-0 truncate">{label}</span>
                  {isSelected && <MapPin size={14} aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        </div>
      </DrawerBody>

      <DrawerFooter className="border-border-subtle px-inset">
        <Button
          type="button"
          data-testid="home-city-apply"
          disabled={!pendingCity}
          onClick={handleApply}
          className="w-full"
        >
          {tMobile("feed.chooseCityApply")}
        </Button>
      </DrawerFooter>
    </DrawerShell>
  )
}
