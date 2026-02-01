/**
 * DesktopShell — Unified desktop layout with CSS Grid + named areas
 *
 * This component provides a consistent shell for all desktop pages with:
 * - Named CSS Grid areas for header, sidebar, content, and footer
 * - Responsive collapse (sidebar hidden on mobile)
 * - Sticky sidebar with safe viewport calculations
 * - Container query support on main content area
 *
 * Grid Template (Desktop lg+):
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                        [header]                                 │
 * ├──────────────┬──────────────────────────────────────────────────┤
 * │   [sidebar]  │                  [content]                       │
 * │              │                                                  │
 * │              │                                                  │
 * ├──────────────┼──────────────────────────────────────────────────┤
 * │   [sidebar]  │                  [footer]                        │
 * └──────────────┴──────────────────────────────────────────────────┘
 *
 * Usage:
 * ```tsx
 * <DesktopShell
 *   sidebar={<CategorySidebar />}
 *   sidebarSticky
 * >
 *   <ProductGrid products={products} />
 * </DesktopShell>
 * ```
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DesktopShellProps extends React.ComponentProps<"div"> {
  /** Main content (required) */
  children: React.ReactNode;
  /** Sidebar content - hidden on mobile */
  sidebar?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Whether sidebar is visible (lg+ only) */
  sidebarVisible?: boolean;
  /** Whether sidebar is sticky */
  sidebarSticky?: boolean;
  /** Whether sidebar can be collapsed to icon mode */
  sidebarCollapsible?: boolean;
  /** Whether sidebar is currently collapsed */
  sidebarCollapsed?: boolean;
  /** Container variant for background */
  variant?: "default" | "muted";
  /** Additional className for the shell */
  className?: string;
}

const variantStyles = {
  default: "bg-background",
  muted: "bg-background", // Clean white - same as default now
} as const;

export function DesktopShell({
  children,
  sidebar,
  footer,
  sidebarVisible = true,
  sidebarSticky = true,
  sidebarCollapsible = false,
  sidebarCollapsed = false,
  variant = "default",
  className,
  ...props
}: DesktopShellProps) {
  const hasSidebar = sidebar && sidebarVisible;
  const sidebarWidth = sidebarCollapsed
    ? "var(--layout-sidebar-w-collapsed)"
    : "var(--layout-sidebar-w)";

  return (
    <div
      data-slot="desktop-shell"
      data-sidebar={hasSidebar ? "visible" : "hidden"}
      data-sidebar-collapsed={sidebarCollapsed}
      className={cn(
        "min-h-dvh",
        variantStyles[variant],
        className
      )}
      style={
        {
          "--shell-sidebar-w": hasSidebar ? sidebarWidth : "0px",
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="container py-4">
        <div
          className={cn(
            "grid items-start",
            hasSidebar
              ? "grid-cols-1 lg:grid-cols-[var(--shell-sidebar-w)_1fr] gap-4 lg:gap-(--layout-gap)"
              : "grid-cols-1"
          )}
        >
          {/* SIDEBAR */}
          {hasSidebar && (
            <aside
              id="shell-sidebar"
              data-slot="shell-sidebar"
              className={cn(
                "hidden lg:flex flex-col shrink-0 gap-3",
                sidebarSticky && [
                  "sticky",
                  "top-(--sticky-top)",
                  "self-start",
                  "max-h-(--sidebar-max-h)",
                  "overflow-y-auto",
                ]
              )}
              tabIndex={-1}
            >
              {sidebar}
            </aside>
          )}

          {/* MAIN CONTENT */}
          <main
            data-slot="shell-content"
            className="flex-1 min-w-0 @container flex flex-col gap-4"
          >
            {children}
          </main>
        </div>

        {/* FOOTER */}
        {footer && (
          <footer data-slot="shell-footer" className="mt-8">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

/**
 * DesktopShellSkeleton — Loading state for DesktopShell
 */
export function DesktopShellSkeleton({
  showSidebar = true,
  sidebarItems = 12,
  contentRows = 16,
}: {
  showSidebar?: boolean;
  sidebarItems?: number;
  contentRows?: number;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="container py-4">
        <div
          className={cn(
            "grid items-start",
            showSidebar
              ? "grid-cols-1 lg:grid-cols-[var(--layout-sidebar-w)_1fr] gap-4 lg:gap-(--layout-gap)"
              : "grid-cols-1"
          )}
        >
          {/* Sidebar skeleton */}
          {showSidebar && (
            <aside className="hidden lg:flex flex-col shrink-0">
              <div className="rounded-lg border border-border bg-card p-1.5">
                {Array.from({ length: sidebarItems }).map((_, i) => (
                  <div
                    key={i}
                    className="h-(--sidebar-item-h) w-full rounded-md mb-1 bg-muted animate-pulse"
                  />
                ))}
              </div>
            </aside>
          )}

          {/* Content skeleton */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Toolbar skeleton */}
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-28 bg-muted rounded-md animate-pulse" />
                <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
              </div>
            </div>

            {/* Product grid skeleton */}
            <div className="rounded-xl bg-card border border-border p-4">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {Array.from({ length: contentRows }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-square w-full rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

