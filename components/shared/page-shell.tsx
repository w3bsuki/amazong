import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PageShell — Canonical page surface wrapper for the entire app.
 *
 * This component enforces a single, consistent page canvas recipe across all routes.
 * It replaces ad-hoc usage of `min-h-screen bg-muted/30`, `bg-surface-page`,
 * `bg-background`, etc. that previously drifted across routes.
 *
 * Variants:
 * - `default`: Clean white/dark canvas (`bg-background`) — used for most pages
 * - `muted`: Subtle page tint (`bg-surface-page`) — used for desktop home, search grids
 *
 * Usage:
 * ```tsx
 * <PageShell>
 *   <YourPageContent />
 * </PageShell>
 *
 * <PageShell variant="muted" className="pb-24">
 *   <YourPageContent />
 * </PageShell>
 * ```
 */

export type PageShellVariant = "default" | "muted";

interface PageShellProps extends React.ComponentProps<"div"> {
  /**
   * Surface variant:
   * - `default`: bg-background (clean white/dark)
   * - `muted`: bg-muted/40 (subtle gray tint for grid pages)
   */
  variant?: PageShellVariant;
  /**
   * Whether to apply `min-h-dvh`. Defaults to true.
   */
  fullHeight?: boolean;
  /**
   * Additional container className
   */
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<PageShellVariant, string> = {
  default: "bg-background",
  muted: "bg-background", // Clean white - surface-page is also white now
};

export function PageShell({
  variant = "default",
  fullHeight = true,
  className,
  children,
  ...props
}: PageShellProps) {
  return (
    <div
      data-slot="page-shell"
      className={cn(
        variantStyles[variant],
        fullHeight && "min-h-dvh",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

