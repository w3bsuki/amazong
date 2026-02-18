"use client"

import * as React from "react"
import { X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMobileQuickPillClass } from "@/components/mobile/chrome/mobile-control-recipes"

export interface DrilldownSegment {
  slug: string
  label: string
}

export interface DrilldownOption {
  id: string
  label: string
  slug: string
}

interface CategoryDrilldownRailProps {
  /** Breadcrumb path of selected categories */
  selectedPath: DrilldownSegment[]
  /** Available options at the current drill level */
  options: DrilldownOption[]
  /** Label shown as active indicator when at root level (no selections) */
  allLabel?: string
  /** Called when user selects an option to drill deeper */
  onOptionSelect: (slug: string, label: string) => void
  /** Called when user taps × — pops last segment */
  onGoBack: () => void
  /** Called when user taps an ancestor breadcrumb segment to jump back */
  onSegmentTap?: (index: number) => void
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

/** Max visible breadcrumb segments before collapsing ancestors into "…" */
const MAX_VISIBLE_SEGMENTS = 2

export function CategoryDrilldownRail({
  selectedPath,
  options,
  allLabel,
  onOptionSelect,
  onGoBack,
  onSegmentTap,
  moreLabel,
  onMoreClick,
  ariaLabel,
  stickyTop = "var(--offset-mobile-primary-rail)",
  sticky = true,
  className,
  testId,
}: CategoryDrilldownRailProps) {
  const hasPath = selectedPath.length > 0

  // For deep paths (3+), show "… › second-to-last › last ×"
  const truncated = selectedPath.length > MAX_VISIBLE_SEGMENTS
  const visibleSegments = truncated
    ? selectedPath.slice(-MAX_VISIBLE_SEGMENTS)
    : selectedPath
  const visibleStartIndex = truncated
    ? selectedPath.length - MAX_VISIBLE_SEGMENTS
    : 0

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "bg-background px-inset py-1.5",
        sticky && "sticky z-30",
        className,
      )}
      style={sticky ? { top: stickyTop } : undefined}
      {...(testId ? { "data-testid": testId } : {})}
    >
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar snap-x snap-proximity">
        {hasPath ? (
          /* Compound breadcrumb pill — segments individually tappable, × pops last */
          <div
            className={cn(getMobileQuickPillClass(true), "gap-0 p-0 overflow-hidden")}
            role="navigation"
            aria-label={selectedPath.map((s) => s.label).join(" / ")}
          >
            {truncated && (
              <>
                <button
                  type="button"
                  onClick={() => onSegmentTap?.(0)}
                  className="px-2.5 py-1.5 text-inherit opacity-60 hover:opacity-100 transition-opacity duration-fast ease-smooth"
                  aria-label={selectedPath[0]?.label}
                >
                  &hellip;
                </button>
                <ChevronRight
                  className="size-3 shrink-0 opacity-40"
                  aria-hidden="true"
                />
              </>
            )}
            {visibleSegments.map((segment, i) => {
              const absoluteIndex = visibleStartIndex + i
              const isLast = absoluteIndex === selectedPath.length - 1

              return (
                <React.Fragment key={segment.slug}>
                  {i > 0 && (
                    <ChevronRight
                      className="size-3 shrink-0 opacity-40"
                      aria-hidden="true"
                    />
                  )}
                  {isLast ? (
                    /* Current (leaf) segment — not tappable, visually distinct */
                    <span className="px-2.5 py-1.5 font-semibold whitespace-nowrap">
                      {segment.label}
                    </span>
                  ) : (
                    /* Ancestor segment — tappable to jump back */
                    <button
                      type="button"
                      onClick={() => onSegmentTap?.(absoluteIndex)}
                      className="px-2.5 py-1.5 opacity-70 hover:opacity-100 transition-opacity duration-fast ease-smooth whitespace-nowrap"
                    >
                      {segment.label}
                    </button>
                  )}
                </React.Fragment>
              )
            })}
            <button
              type="button"
              onClick={onGoBack}
              className="px-2 py-1.5 opacity-70 hover:opacity-100 transition-opacity duration-fast ease-smooth"
              aria-label="Go back"
            >
              <X className="size-3 shrink-0" aria-hidden="true" />
            </button>
          </div>
        ) : allLabel ? (
          /* Root indicator — shows "All" when no drill selection */
          <span
            className={getMobileQuickPillClass(true)}
            aria-current="page"
          >
            {allLabel}
          </span>
        ) : null}

        {/* Current level options */}
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onOptionSelect(option.slug, option.label)}
            className={cn(
              getMobileQuickPillClass(
                false,
                "hover:bg-hover hover:text-foreground active:bg-active",
              ),
              "snap-start",
            )}
          >
            <span className="whitespace-nowrap">{option.label}</span>
          </button>
        ))}

        {moreLabel && onMoreClick && (
          <button
            type="button"
            onClick={onMoreClick}
            className={cn(
              getMobileQuickPillClass(
                false,
                "hover:bg-hover hover:text-foreground active:bg-active",
              ),
              "snap-start",
            )}
            aria-label={moreLabel}
          >
            <span className="whitespace-nowrap">{moreLabel}</span>
          </button>
        )}
      </div>
    </nav>
  )
}

export type { CategoryDrilldownRailProps }
