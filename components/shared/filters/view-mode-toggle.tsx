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
 * ViewModeToggle - Single button that toggles between grid and list views
 */
export function ViewModeToggle({ viewMode, onViewModeChange, className }: ViewModeToggleProps) {
  const t = useTranslations("ViewMode")
  const isGrid = viewMode === "grid"
  const nextMode = isGrid ? "list" : "grid"
  const Icon = isGrid ? SquaresFour : List
  const label = isGrid ? t("grid") : t("list")

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={() => onViewModeChange(nextMode)}
      className={cn("gap-0", className)}
      aria-label={isGrid ? t("switchToList") : t("switchToGrid")}
    >
      <Icon size={16} weight="fill" />
      <span className="sr-only">{label}</span>
    </Button>
  )
}
