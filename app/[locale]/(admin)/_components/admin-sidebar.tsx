"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import {
  IconDashboard,
  IconUsers,
  IconBox,
  IconShoppingCart,
  IconBuildingStore,
  IconSettings,
  IconChartBar,
  IconCategory,
  IconTags,
  IconHome,
  IconMessage,
  IconCrown,
  IconFileText,
  IconChecklist,
  IconNote,
} from "@tabler/icons-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavSecondary } from "@/components/layout/nav-secondary"
import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/layout/sidebar/sidebar"

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: IconDashboard,
  },
  {
    title: "Tasks",
    url: "/admin/tasks",
    icon: IconChecklist,
  },
  {
    title: "Docs",
    url: "/admin/docs",
    icon: IconFileText,
  },
  {
    title: "Notes",
    url: "/admin/notes",
    icon: IconNote,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: IconUsers,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: IconBox,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: IconShoppingCart,
  },
  {
    title: "Sellers",
    url: "/admin/sellers",
    icon: IconBuildingStore,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: IconCategory,
  },
  {
    title: "Brands",
    url: "/admin/brands",
    icon: IconTags,
  },
  {
    title: "Messages",
    url: "/admin/messages",
    icon: IconMessage,
  },
  {
    title: "Subscriptions",
    url: "/admin/subscriptions",
    icon: IconCrown,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: IconChartBar,
  },
]

const adminSecondaryNav = [
  {
    title: "Back to Store",
    url: "/",
    icon: IconHome,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: IconSettings,
  },
]

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/admin">
                <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                  A
                </div>
                <span className="text-base font-semibold">Admin Panel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavItems} />
        <NavSecondary items={adminSecondaryNav} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
