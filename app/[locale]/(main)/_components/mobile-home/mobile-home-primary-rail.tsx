import { cn } from "@/lib/utils"

interface MobileHomePrimaryRailProps {
  ariaLabel: string
  tabs: { slug: string | null; label: string }[]
  activeCategorySlug: string | null
  onSelect: (slug: string | null) => void
}

export function MobileHomePrimaryRail({
  ariaLabel,
  tabs,
  activeCategorySlug,
  onSelect,
}: MobileHomePrimaryRailProps) {
  return (
    <div
      data-testid="home-v4-primary-rail"
      role="tablist"
      aria-label={ariaLabel}
      className="sticky z-40 border-b border-border bg-background"
      style={{ top: "var(--offset-mobile-primary-rail)" }}
    >
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max min-w-full items-center gap-2 px-4">
          {tabs.map((tab) => {
            const isActive = tab.slug === activeCategorySlug
            return (
              <button
                key={tab.slug ?? "all"}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(tab.slug)}
                className={cn(
                  "inline-flex shrink-0 min-h-(--control-default) items-center justify-center rounded-full px-4 text-sm font-semibold tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground hover:bg-accent active:bg-accent"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

