import { cn } from "@/lib/utils";

// Desktop-optimized pill styles for better visibility and readability
export const pillBase = cn(
  "h-9 px-4 gap-2 rounded-lg",
  "text-sm font-medium whitespace-nowrap",
  "flex items-center justify-center",
  "border transition-colors cursor-pointer",
  "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-ring"
);

export const pillInactive = cn(
  "border-border bg-surface-subtle",
  "text-muted-foreground",
  "hover:bg-hover hover:text-foreground"
);

export const pillActive = cn("border-selected-border bg-selected", "text-primary");

