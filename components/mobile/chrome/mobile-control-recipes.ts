import { cn } from "@/lib/utils"

const MOBILE_PRIMARY_TAB_BASE_CLASS =
  "relative inline-flex min-h-(--control-compact) items-center gap-1.5 rounded-full px-3.5 text-compact leading-none tap-transparent motion-safe:transition-all motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset"
const MOBILE_PRIMARY_TAB_NOWRAP_CLASS = "whitespace-nowrap"
const MOBILE_PRIMARY_TAB_ACTIVE_CLASS = "bg-foreground text-background font-semibold shadow-sm"
const MOBILE_PRIMARY_TAB_INACTIVE_CLASS = "bg-surface-subtle text-muted-foreground font-medium hover:text-foreground hover:bg-hover"

const MOBILE_QUICK_PILL_BASE_CLASS =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-transparent min-h-(--control-compact) px-3.5 text-compact leading-none tap-transparent motion-safe:transition-all motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring flex-1 justify-center sm:flex-none"
const MOBILE_QUICK_PILL_ACTIVE_CLASS = "bg-foreground text-background font-semibold shadow-sm ring-1 ring-inset ring-foreground/10"
const MOBILE_QUICK_PILL_INACTIVE_CLASS = "bg-surface-subtle text-muted-foreground font-medium hover:text-foreground hover:bg-hover ring-1 ring-inset ring-border-subtle/50"

export const MOBILE_ACTION_CHIP_CLASS =
  "inline-flex shrink-0 min-h-(--control-compact) px-3.5 items-center gap-1.5 rounded-full bg-surface-subtle text-compact font-semibold leading-none text-foreground tap-transparent motion-safe:transition-all motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ring-1 ring-inset ring-border-subtle/50"

export const MOBILE_SEGMENTED_CONTAINER_CLASS =
  "grid grid-cols-2 rounded-full border border-border-subtle bg-surface-subtle p-0.5"

const MOBILE_SEGMENTED_TRIGGER_BASE_CLASS =
  "inline-flex min-h-(--control-default) items-center justify-center rounded-full px-3 text-sm font-medium leading-none transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const MOBILE_SEGMENTED_TRIGGER_ACTIVE_CLASS = "bg-background text-foreground shadow-sm"
const MOBILE_SEGMENTED_TRIGGER_INACTIVE_CLASS = "text-muted-foreground hover:text-foreground"

export function getMobilePrimaryTabClass(
  active: boolean,
  options?: { nowrap?: boolean; className?: string }
): string {
  return cn(
    MOBILE_PRIMARY_TAB_BASE_CLASS,
    (options?.nowrap ?? true) && MOBILE_PRIMARY_TAB_NOWRAP_CLASS,
    active ? MOBILE_PRIMARY_TAB_ACTIVE_CLASS : MOBILE_PRIMARY_TAB_INACTIVE_CLASS,
    options?.className
  )
}

export function getMobileQuickPillClass(active: boolean, className?: string): string {
  return cn(
    MOBILE_QUICK_PILL_BASE_CLASS,
    active ? MOBILE_QUICK_PILL_ACTIVE_CLASS : MOBILE_QUICK_PILL_INACTIVE_CLASS,
    className
  )
}

export function getMobileSegmentedTriggerClass(active: boolean, className?: string): string {
  return cn(
    MOBILE_SEGMENTED_TRIGGER_BASE_CLASS,
    active ? MOBILE_SEGMENTED_TRIGGER_ACTIVE_CLASS : MOBILE_SEGMENTED_TRIGGER_INACTIVE_CLASS,
    className
  )
}
