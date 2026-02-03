"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
  IconDashboard,
  IconUsers,
  IconBox,
  IconShoppingCart,
  IconBuildingStore,
  IconHome,
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

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  const t = useTranslations("AdminNav")

  const adminNavItems = [
    {
      title: t("items.dashboard"),
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: t("items.tasks"),
      url: "/admin/tasks",
      icon: IconChecklist,
    },
    {
      title: t("items.docs"),
      url: "/admin/docs",
      icon: IconFileText,
    },
    {
      title: t("items.notes"),
      url: "/admin/notes",
      icon: IconNote,
    },
    {
      title: t("items.users"),
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: t("items.products"),
      url: "/admin/products",
      icon: IconBox,
    },
    {
      title: t("items.orders"),
      url: "/admin/orders",
      icon: IconShoppingCart,
    },
    {
      title: t("items.sellers"),
      url: "/admin/sellers",
      icon: IconBuildingStore,
    },
  ]

  const adminSecondaryNav = [
    {
      title: t("secondary.backToStore"),
      url: "/",
      icon: IconHome,
    },
  ]

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
                <span className="text-base font-semibold">{t("panel")}</span>
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
