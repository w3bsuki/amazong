"use client"

import * as React from "react"
import Link from "next/link"
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
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: IconUsers,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: IconBox,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: IconShoppingCart,
  },
  {
    title: "Sellers",
    url: "/dashboard/sellers",
    icon: IconBuildingStore,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: IconCategory,
  },
  {
    title: "Brands",
    url: "/dashboard/brands",
    icon: IconTags,
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: IconMessage,
  },
  {
    title: "Subscriptions",
    url: "/dashboard/subscriptions",
    icon: IconCrown,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
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
    url: "/dashboard/settings",
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
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
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
