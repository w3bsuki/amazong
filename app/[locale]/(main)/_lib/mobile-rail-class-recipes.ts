import { cn } from "@/lib/utils"

const PRIMARY_TAB_BASE_CLASS =
  "relative inline-flex min-h-(--control-default) items-center gap-1.5 px-3 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset"
const PRIMARY_TAB_NOWRAP_CLASS = "whitespace-nowrap"
const PRIMARY_TAB_ACTIVE_CLASS = "font-semibold text-foreground"
const PRIMARY_TAB_INACTIVE_CLASS = "font-medium text-muted-foreground"

const PILL_BASE_CLASS =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border min-h-(--control-compact) px-2.5 text-xs tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const PILL_ACTIVE_CLASS = "border-foreground bg-foreground text-background font-semibold"
const PILL_INACTIVE_CLASS =
  "border-border-subtle bg-surface-subtle text-muted-foreground font-medium"

export const ACTION_CHIP_CLASS =
  "inline-flex shrink-0 min-h-(--control-compact) items-center gap-1 rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

export function getPrimaryTabClass(
  active: boolean,
  options?: { nowrap?: boolean; className?: string }
): string {
  return cn(
    PRIMARY_TAB_BASE_CLASS,
    (options?.nowrap ?? true) && PRIMARY_TAB_NOWRAP_CLASS,
    active ? PRIMARY_TAB_ACTIVE_CLASS : PRIMARY_TAB_INACTIVE_CLASS,
    options?.className
  )
}

export function getPillClass(active: boolean, className?: string): string {
  return cn(PILL_BASE_CLASS, active ? PILL_ACTIVE_CLASS : PILL_INACTIVE_CLASS, className)
}
