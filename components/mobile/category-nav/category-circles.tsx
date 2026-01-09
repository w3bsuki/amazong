"use client"

import { useRef } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryShortName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { CaretLeft } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

export interface CategoryCirclesProps {
  circles: Category[]
  activeL1: string | null
  activeL2: string | null
  activeCategoryName?: string | null // NEW
  showL2Circles: boolean
  locale: string
  circlesNavigateToPages: boolean
  activeTab: string
  onCircleClick: (category: Category) => void
  onBack: () => void
  hideBackButton?: boolean
}

// =============================================================================
// Component
// =============================================================================

export function CategoryCircles({
  circles,
  activeL1,
  activeL2,
  activeCategoryName,
  showL2Circles,
  locale,
  circlesNavigateToPages,
  activeTab,
  onCircleClick,
  onBack,
  hideBackButton,
}: CategoryCirclesProps) {
  const subTabsContainerRef = useRef<HTMLDivElement>(null)

  // Don't render if no circles and no back button needed
  if (circles.length === 0 && (!activeL1 || hideBackButton)) {
    return <div className="flex-1" />
  }

  return (
    <div className="px-4 flex items-center gap-1.5">
      {/* Back Button - Transformer Logic */}
      {activeL1 && !hideBackButton && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "group flex flex-row items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full",
            "bg-foreground text-background border border-transparent", // Treido: Flat black pill
            "hover:opacity-90 transition-all active:scale-95"
          )} aria-label={locale === "bg" ? "Назад" : "Back"}
        >
          {/* Icon Circle */}
          <div className="w-7 h-7 rounded-full bg-background/20 flex items-center justify-center">
            <CaretLeft size={16} weight="bold" className="text-background" />
          </div>
          {/* Label */}
          <span className="text-[13px] font-medium max-w-[100px] truncate leading-none pb-[1px]">
            {activeCategoryName || (locale === "bg" ? "Назад" : "Back")}
          </span>
        </button>
      )}

      <div
        ref={subTabsContainerRef}
        className="flex-1 flex overflow-x-auto no-scrollbar gap-1.5 snap-x snap-mandatory items-center"
      >
        {circles.map((sub) => {
          const isActive = showL2Circles
            ? activeL2 === sub.slug
            : activeL1 === sub.slug

          const dimmed =
            (showL2Circles ? !!activeL2 : !!activeL1) && !isActive

          // Phase 3: Stop circle reloads - always use onClick for client-side drill-down
          // L0/L1 circles should never cause page navigation; they update pending state.
          // Navigation happens only on Apply in Filter Hub or via explicit "View all" links.
          // Keep href behavior only for non-"all" tab when explicitly navigating to leaf categories.
          const useHref = circlesNavigateToPages && activeTab !== "all" && showL2Circles
          const href = useHref ? (`/categories/${sub.slug}` as const) : undefined

          return (
            <CategoryCircle
              key={sub.slug}
              category={sub}
              {...(href ? { href } : { onClick: () => onCircleClick(sub) })}
              active={isActive}
              dimmed={dimmed}
              circleClassName="w-[56px] h-[56px]" // Treido: 56px fixed size
              fallbackIconSize={24} // Treido: 24px icon
              fallbackIconWeight={isActive ? "fill" : "light"} // Treido: light stroke
              variant="muted"
              label={getCategoryShortName(sub, locale)}
              className="w-[72px] shrink-0" // Treido: w-[72px] container
              labelClassName={cn(
                "w-full text-[11px] text-center leading-tight line-clamp-2 px-1 mt-2", // Treido: text-[11px], px-1
                isActive ? "text-foreground font-medium" : "text-muted-foreground font-medium" // Treido: scale-700 equivalent
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
