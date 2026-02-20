"use client"

import { useEffect, useRef } from "react"
import { X, ChevronRight, Ellipsis } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMobileQuickPillClass } from "@/components/mobile/chrome/mobile-control-recipes"

export interface SectionPathSegment {
  slug: string
  label: string
}

export interface CategoryOptionItem {
  id: string
  label: string
  slug: string
}

// Tab-style classes — visually distinct from filter pill chips
const TAB_BASE =
  "relative inline-flex shrink-0 min-h-(--control-compact) items-center px-3 text-sm leading-none whitespace-nowrap tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset"
const TAB_ACTIVE = "font-semibold text-foreground"
const TAB_INACTIVE = "font-medium text-muted-foreground hover:text-foreground active:text-foreground"
// Underline indicator for active tab
const TAB_INDICATOR =
  "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"

interface CategoryOptionRailProps {
  /** Currently active category label — shown as highlighted tab when no sectionPath. */
  activeLabel: string | null
  /** L2+ path within the current section. When present, renders a compound pill with ×. */
  sectionPath?: SectionPathSegment[]
  /** Called when × is tapped on compound section pill — goes back one level. */
  onSectionBack?: () => void
  /** Available options (siblings or children) */
  options: CategoryOptionItem[]
  /** Called when user selects an option */
  onOptionSelect: (slug: string) => void
  /** "More" button text */
  moreLabel?: string
  /** Called when "More" is tapped */
  onMoreClick?: () => void
  ariaLabel: string
  stickyTop?: string
  sticky?: boolean
  className?: string
  testId?: string
}

export function CategoryOptionRail({
  activeLabel,
  sectionPath,
  onSectionBack,
  options,
  onOptionSelect,
  moreLabel,
  onMoreClick,
  ariaLabel,
  stickyTop = "var(--offset-mobile-primary-rail)",
  sticky = true,
  className,
  testId,
}: CategoryOptionRailProps) {
  const hasSectionPath = sectionPath && sectionPath.length > 0
  const activeRef = useRef<HTMLElement>(null)

  // Auto-scroll active element into view when selection changes
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    })
  }, [activeLabel, sectionPath])

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "bg-background px-inset py-1 border-b border-border-subtle",
        sticky && "sticky z-30",
        className,
      )}
      style={sticky ? { top: stickyTop } : undefined}
      {...(testId ? { "data-testid": testId } : {})}
    >
      <div className="flex items-center overflow-x-auto no-scrollbar">
        {hasSectionPath ? (
          /* Compound section pill — shows L2+ drill path, × pops last segment */
          <button
            ref={activeRef as React.RefObject<HTMLButtonElement>}
            type="button"
            onClick={onSectionBack}
            className={cn(getMobileQuickPillClass(true), "gap-1 mr-1")}
            aria-label={sectionPath.map((s) => s.label).join(" / ")}
          >
            {sectionPath.map((segment, index) => (
              <span key={segment.slug} className="contents">
                {index > 0 && (
                  <ChevronRight
                    className="size-3 shrink-0 opacity-60"
                    aria-hidden="true"
                  />
                )}
                <span className="whitespace-nowrap">{segment.label}</span>
              </span>
            ))}
            <X className="size-3 shrink-0 ml-0.5" aria-hidden="true" />
          </button>
        ) : activeLabel ? (
          <span
            ref={activeRef as React.RefObject<HTMLSpanElement>}
            className={cn(TAB_BASE, TAB_ACTIVE, TAB_INDICATOR)}
            aria-current="page"
          >
            {activeLabel}
          </span>
        ) : null}

        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onOptionSelect(option.slug)}
            className={cn(TAB_BASE, TAB_INACTIVE)}
          >
            {option.label}
          </button>
        ))}

        {moreLabel && onMoreClick && (
          <button
            type="button"
            onClick={onMoreClick}
            className={cn(TAB_BASE, TAB_INACTIVE, "gap-1")}
            aria-label={moreLabel}
          >
            <Ellipsis className="size-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </nav>
  )
}

export type { CategoryOptionRailProps }
