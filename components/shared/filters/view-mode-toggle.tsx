"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { SquaresFour, List } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

type ViewMode = "grid" | "list"

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

/**
 * ViewModeToggle - Toggle between grid and list views
 * OLX/Bazar-style segmented control
 */
export function ViewModeToggle({ viewMode, onViewModeChange, className }: ViewModeToggleProps) {
  const t = useTranslations("ViewMode")

  return (
    <div
      className={cn("inline-flex items-center rounded-md border border-border bg-muted/30 p-0.5", className)}
      role="group"
      aria-label={t("ariaLabel")}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className={cn(
          "h-8 px-2.5 rounded-sm gap-1.5 transition-colors",
          viewMode === "grid"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        aria-pressed={viewMode === "grid"}
        aria-label={t("gridView")}
      >
        <SquaresFour size={16} weight={viewMode === "grid" ? "fill" : "regular"} />
        <span className="sr-only sm:not-sr-only text-xs font-medium">{t("grid")}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("list")}
        className={cn(
          "h-8 px-2.5 rounded-sm gap-1.5 transition-colors",
          viewMode === "list"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        aria-pressed={viewMode === "list"}
        aria-label={t("listView")}
      >
        <List size={16} weight={viewMode === "list" ? "fill" : "regular"} />
        <span className="sr-only sm:not-sr-only text-xs font-medium">{t("list")}</span>
      </Button>
    </div>
  )
}
