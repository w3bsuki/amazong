/**
 * DesktopShell — Unified desktop layout with CSS Grid + named areas
 *
 * Server version: keep server pages lean (no forced client boundary).
 * Client surfaces in `(main)` should import `./desktop-shell`.
 */

import * as React from "react"

import { cn } from "@/lib/utils"

export interface DesktopShellProps extends React.ComponentProps<"div"> {
  /** Main content (required) */
  children: React.ReactNode
  /** Sidebar content - hidden on mobile */
  sidebar?: React.ReactNode
  /** Footer content */
  footer?: React.ReactNode
  /** Whether sidebar is visible (lg+ only) */
  sidebarVisible?: boolean
  /** Whether sidebar is sticky */
  sidebarSticky?: boolean
  /** Whether sidebar can be collapsed to icon mode */
  sidebarCollapsible?: boolean
  /** Whether sidebar is currently collapsed */
  sidebarCollapsed?: boolean
  /** Container variant for background */
  variant?: "default" | "muted"
  /** Additional className for the shell */
  className?: string
}

const variantStyles = {
  default: "bg-surface-page",
  muted: "bg-surface-subtle",
} as const

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
  const hasSidebar = sidebar && sidebarVisible
  const sidebarWidth = sidebarCollapsed
    ? "var(--layout-sidebar-w-collapsed)"
    : "var(--layout-sidebar-w)"

  return (
    <div
      data-slot="desktop-shell"
      data-variant={variant}
      data-sidebar={hasSidebar ? "visible" : "hidden"}
      data-sidebar-collapsed={sidebarCollapsed}
      className={cn("min-h-dvh", variantStyles[variant], className)}
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
              ? "grid-cols-1 lg:grid-cols-shell gap-4 lg:gap-(--layout-gap)"
              : "grid-cols-1",
          )}
        >
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
                ],
              )}
              tabIndex={-1}
            >
              {sidebar}
            </aside>
          )}

          <main
            data-slot="shell-content"
            className="flex-1 min-w-0 @container flex flex-col gap-4"
          >
            {children}
          </main>
        </div>

        {footer && (
          <footer data-slot="shell-footer" className="mt-8">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
