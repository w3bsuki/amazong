import { cn } from "@/lib/utils"

const MOBILE_QUICK_PILL_BASE_CLASS =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full min-h-(--control-pill) px-3.5 text-compact leading-none tap-transparent motion-safe:transition-all motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
const MOBILE_QUICK_PILL_ACTIVE_CLASS = "bg-foreground text-background font-medium"
const MOBILE_QUICK_PILL_INACTIVE_CLASS =
  "bg-secondary text-muted-foreground font-medium hover:text-foreground hover:bg-accent"

const MOBILE_GHOST_PILL_ACTIVE_CLASS = "border-foreground bg-secondary text-foreground font-medium"
const MOBILE_GHOST_PILL_INACTIVE_CLASS =
  "border-border bg-background text-muted-foreground font-medium hover:border-border hover:bg-secondary hover:text-foreground"

export const MOBILE_ACTION_CHIP_CLASS =
  "inline-flex shrink-0 px-3.5 py-1.5 items-center gap-2 rounded-full bg-secondary text-sm font-medium leading-none text-foreground tap-transparent transition-all hover:bg-accent active:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

export const MOBILE_ACTION_ICON_CLASS =
  "inline-flex shrink-0 size-8 items-center justify-center rounded-full bg-secondary text-foreground tap-transparent transition-all hover:bg-accent active:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

export const MOBILE_SEGMENTED_CONTAINER_CLASS =
  "grid grid-cols-2 rounded-full border border-border-subtle bg-surface-subtle p-0.5"

const MOBILE_SEGMENTED_TRIGGER_BASE_CLASS =
  "inline-flex min-h-(--control-default) items-center justify-center rounded-full px-3 text-sm font-medium leading-none transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const MOBILE_SEGMENTED_TRIGGER_ACTIVE_CLASS = "bg-background text-foreground shadow-sm"
const MOBILE_SEGMENTED_TRIGGER_INACTIVE_CLASS = "text-muted-foreground hover:text-foreground"

export function getMobileQuickPillClass(active: boolean, className?: string): string {
  return cn(
    MOBILE_QUICK_PILL_BASE_CLASS,
    active ? MOBILE_QUICK_PILL_ACTIVE_CLASS : MOBILE_QUICK_PILL_INACTIVE_CLASS,
    className
  )
}

export function getMobileGhostPillClass(active: boolean, className?: string): string {
  return cn(
    MOBILE_QUICK_PILL_BASE_CLASS,
    "border",
    active ? MOBILE_GHOST_PILL_ACTIVE_CLASS : MOBILE_GHOST_PILL_INACTIVE_CLASS,
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
