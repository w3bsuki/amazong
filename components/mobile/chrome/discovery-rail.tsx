import { cn } from "@/lib/utils"
import { getMobileGhostPillClass } from "@/components/mobile/chrome/mobile-control-recipes"
import type { HomeDiscoveryScope } from "@/lib/home-browse-href"

const DISCOVERY_SCOPES: HomeDiscoveryScope[] = ["forYou", "newest", "promoted", "deals", "nearby"]

export interface DiscoveryRailProps {
  activeScope: HomeDiscoveryScope
  onScopeChange: (scope: HomeDiscoveryScope) => void
  /** Translation function – expects keys like "scopes.forYou", "scopes.newest", etc. */
  t: (key: string) => string
  className?: string
  testId?: string
}

export function DiscoveryRail({
  activeScope,
  onScopeChange,
  t,
  className,
  testId,
}: DiscoveryRailProps) {
  return (
    <div
      role="tablist"
      aria-label={t("aria.discoveryScopes")}
      className={cn(
        "overflow-x-auto no-scrollbar",
        className,
      )}
      {...(testId ? { "data-testid": testId } : {})}
    >
      <div className="flex w-max min-w-full items-center gap-1.5 px-inset py-1.5">
        {DISCOVERY_SCOPES.map((scope) => {
          const isActive = activeScope === scope
          return (
            <button
              key={scope}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onScopeChange(scope)}
              className={getMobileGhostPillClass(
                isActive,
                "min-h-(--control-default) px-3 text-compact"
              )}
              data-testid={testId ? `${testId}-${scope}` : undefined}
            >
              {t(`scopes.${scope}`)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
