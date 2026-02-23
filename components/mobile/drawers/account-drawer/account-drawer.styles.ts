import { cn } from "@/lib/utils"

/** Grouped card container — iOS Settings pattern */
export const MENU_GROUP_CLASS =
  "overflow-hidden rounded-2xl border border-border-subtle bg-background"

/** Single menu row inside a grouped card */
export const MENU_ROW_CLASS = cn(
  "flex min-h-(--spacing-touch-md) w-full items-center gap-3 px-4 text-left",
  "tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
  "hover:bg-hover active:bg-active",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset"
)
