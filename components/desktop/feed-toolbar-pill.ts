import { cn } from "@/lib/utils";

// Desktop-optimized pill styles for better visibility and readability
export const pillBase = cn(
  "h-(--control-compact) px-4 gap-2 rounded-lg",
  "text-sm font-medium whitespace-nowrap",
  "flex items-center justify-center",
  "border cursor-pointer tap-transparent",
  "motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none",
  "active:bg-active",
  "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
);

export const pillInactive = cn(
  "border-border bg-surface-subtle",
  "text-muted-foreground",
  "hover:bg-hover hover:text-foreground"
);

export const pillActive = cn("border-selected-border bg-selected", "text-primary");
