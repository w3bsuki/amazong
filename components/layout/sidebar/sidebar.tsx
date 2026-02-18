/**
 * @fileoverview Sidebar primitives (shadcn/ui-based)
 *
 * This is THE ONLY sidebar primitive entrypoint in the codebase.
 * App sidebars (account/admin/business) should import from this file.
 */

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./sidebar-context"

export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
} from "./sidebar-structure"

export { SidebarMenuButton } from "./sidebar-menu-button"