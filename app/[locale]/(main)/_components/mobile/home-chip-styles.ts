import { cn } from "@/lib/utils"

export type HomeChipSize = "compact" | "default"

const HOME_CHIP_BASE =
  "inline-flex shrink-0 items-center rounded-full border whitespace-nowrap tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const HOME_CHIP_SIZE: Record<HomeChipSize, string> = {
  compact: "min-h-(--spacing-touch-sm) px-2.5 text-xs font-medium leading-none",
  default: "min-h-(--spacing-touch-md) px-3 text-xs font-medium leading-none",
}

const HOME_CHIP_INACTIVE =
  "border-border-subtle bg-surface-subtle text-muted-foreground"

const HOME_CHIP_ACTIVE =
  "border-foreground bg-foreground text-background font-semibold"

const HOME_CHIP_COUNT_BASE =
  "inline-flex min-w-5 shrink-0 items-center justify-center rounded-full border px-1.5 py-0.5 text-2xs font-semibold tabular-nums"

const HOME_CHIP_COUNT_INACTIVE = "border-border-subtle bg-background text-muted-foreground"
const HOME_CHIP_COUNT_ACTIVE = "border-background bg-background text-foreground"

export function getHomeChipClass({
  active,
  size,
  className,
}: {
  active: boolean
  size?: HomeChipSize
  className?: string
}) {
  return cn(
    HOME_CHIP_BASE,
    HOME_CHIP_SIZE[size ?? "compact"],
    active ? HOME_CHIP_ACTIVE : HOME_CHIP_INACTIVE,
    className
  )
}

export function getHomeChipCountClass({
  active,
  className,
}: {
  active: boolean
  className?: string
}) {
  return cn(
    HOME_CHIP_COUNT_BASE,
    active ? HOME_CHIP_COUNT_ACTIVE : HOME_CHIP_COUNT_INACTIVE,
    className
  )
}

export function getHomeChipIconClass(active: boolean) {
  return active ? "text-background" : "text-muted-foreground"
}
