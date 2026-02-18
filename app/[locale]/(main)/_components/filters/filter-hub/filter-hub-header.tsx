"use client"

import { ChevronLeft as CaretLeft, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

interface FilterHubHeaderProps {
  activeSection: string | null
  isSingleMode: boolean
  currentSectionLabel: string | null
  hasPendingFilters: boolean
  onBack: () => void
  onClearAll: () => void
  onClose: () => void
}

export function FilterHubHeader({
  activeSection,
  isSingleMode,
  currentSectionLabel,
  hasPendingFilters,
  onBack,
  onClearAll,
  onClose,
}: FilterHubHeaderProps) {
  const tHub = useTranslations("FilterHub")

  return (
    <DrawerHeader
      className={cn(
        "px-inset pb-3 border-b border-border",
        activeSection || isSingleMode ? "pt-4" : "pt-3"
      )}
    >
      <div className="flex items-center justify-between min-h-touch-sm">
        {isSingleMode ? (
          <>
            <DrawerTitle className="text-base font-semibold tracking-tight">
              {currentSectionLabel}
            </DrawerTitle>
            <div className="flex items-center gap-2">
              {hasPendingFilters && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-sm font-medium text-primary transition-opacity active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  {tHub("clearAll")}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="size-11 flex items-center justify-center rounded-full transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                aria-label={tHub("close")}
              >
                <X size={18} />
              </button>
            </div>
          </>
        ) : activeSection ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 font-semibold text-foreground transition-opacity active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <CaretLeft size={20} />
            <span className="text-base">{currentSectionLabel}</span>
          </button>
        ) : (
          <DrawerTitle className="text-base font-semibold tracking-tight">
            {tHub("refineSearch")}
          </DrawerTitle>
        )}

        {!isSingleMode && hasPendingFilters && !activeSection && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-medium text-primary transition-opacity active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {tHub("clearAll")}
          </button>
        )}
      </div>
    </DrawerHeader>
  )
}
