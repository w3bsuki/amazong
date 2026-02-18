import type { ComponentProps, ReactNode } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/layout/sidebar/sidebar"

interface DashboardSidebarProps extends ComponentProps<typeof Sidebar> {
  header: ReactNode
  footer?: ReactNode | undefined
  contentClassName?: string | undefined
  children: ReactNode
}

/**
 * Shared shell for account/business/admin dashboard sidebars.
 * Keeps route-specific header/content/footer internals while centralizing layout scaffolding.
 */
export function DashboardSidebar({
  header,
  footer,
  contentClassName,
  children,
  collapsible = "offcanvas",
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible={collapsible} {...props}>
      <SidebarHeader>{header}</SidebarHeader>
      <SidebarContent className={contentClassName}>{children}</SidebarContent>
      {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
    </Sidebar>
  )
}
