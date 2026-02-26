import { LayoutGrid } from "lucide-react"

interface MobileHomeContextBannerProps {
  eyebrow: string
  title: string
  countLabel: string
  moreCategoriesLabel: string
  onOpenCategories: () => void
}

export function MobileHomeContextBanner({
  eyebrow,
  title,
  countLabel,
  moreCategoriesLabel,
  onOpenCategories,
}: MobileHomeContextBannerProps) {
  return (
    <section
      data-testid="home-v4-context-banner"
      className="sticky z-20 border-b border-border bg-background"
      style={{ top: "var(--offset-mobile-tertiary-rail)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
          <p
            data-testid="home-v4-context-title"
            className="min-w-0 truncate text-sm font-semibold text-foreground"
          >
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{countLabel}</p>
        </div>

        <button
          type="button"
          onClick={onOpenCategories}
          className="inline-flex min-h-(--control-default) min-w-(--control-default) items-center justify-center rounded-full border border-border-subtle bg-surface-subtle text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
          aria-label={moreCategoriesLabel}
          data-testid="home-v4-more-categories-trigger"
        >
          <LayoutGrid size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

