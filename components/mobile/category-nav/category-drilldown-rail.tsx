"use client"

import { X, ChevronRight } from "lucide-react"
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

interface CategoryOptionRailProps {
  /** Currently active category label — shown as highlighted pill when no sectionPath. */
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
        {hasSectionPath ? (
          /* Compound section pill — shows L2+ drill path, × pops last segment */
          <button
            type="button"
            onClick={onSectionBack}
            className={cn(getMobileQuickPillClass(true), "gap-1")}
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
            className={getMobileQuickPillClass(true)}
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

export type { CategoryOptionRailProps }
