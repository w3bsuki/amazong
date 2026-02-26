import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { HomeDiscoveryScope } from "@/lib/home-browse-href"
import { MOBILE_ACTION_ICON_CLASS, getMobileQuickPillClass } from "@/components/mobile/chrome/mobile-control-recipes"

const DEFAULT_DISCOVERY_SCOPES: HomeDiscoveryScope[] = ["forYou", "newest", "promoted", "deals", "nearby"]

export interface DiscoveryRailAction {
  label: string
  icon: ReactNode
  active?: boolean
  badgeCount?: number
  onSelect: () => void
  testId?: string
}

export interface DiscoveryRailProps {
  activeScope: HomeDiscoveryScope
  onScopeChange: (scope: HomeDiscoveryScope) => void
  /** Translation function – expects keys like "scopes.forYou", "scopes.newest", etc. */
  t: (key: string) => string
  scopes?: HomeDiscoveryScope[] | undefined
  trailingAction?: DiscoveryRailAction | undefined
  className?: string
  testId?: string
}

export function DiscoveryRail({
  activeScope,
  onScopeChange,
  t,
  scopes,
  trailingAction,
  className,
  testId,
}: DiscoveryRailProps) {
  const railScopes = scopes ?? DEFAULT_DISCOVERY_SCOPES

  return (
    <nav
      aria-label={t("aria.discoveryScopes")}
      className={cn("bg-background", className)}
      {...(testId ? { "data-testid": testId } : {})}
    >
      <div className="flex items-center gap-1.5 px-4 py-1">
        <div role="tablist" className="min-w-0 flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex w-max min-w-full items-center gap-1.5 pr-2">
            {railScopes.map((scope) => {
              const isActive = activeScope === scope
              return (
                <button
                  key={scope}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onScopeChange(scope)}
                  className={getMobileQuickPillClass(isActive)}
                  data-testid={testId ? `${testId}-${scope}` : undefined}
                >
                  {t(`scopes.${scope}`)}
                </button>
              )
            })}
          </div>
        </div>

        {trailingAction ? (
          <button
            type="button"
            onClick={trailingAction.onSelect}
            className={cn(
              MOBILE_ACTION_ICON_CLASS,
              "relative border",
              trailingAction.active ? "border-foreground" : "border-border",
            )}
            aria-label={trailingAction.label}
            {...(trailingAction.testId ? { "data-testid": trailingAction.testId } : {})}
          >
            {trailingAction.icon}
            <span className="sr-only">{trailingAction.label}</span>
            {typeof trailingAction.badgeCount === "number" && trailingAction.badgeCount > 0 && (
              <span
                className="absolute -top-1 -right-1 inline-flex size-4 items-center justify-center rounded-full bg-foreground text-2xs font-semibold text-background"
                aria-label={String(trailingAction.badgeCount)}
              >
                {trailingAction.badgeCount}
              </span>
            )}
          </button>
        ) : null}
      </div>
    </nav>
  )
}
