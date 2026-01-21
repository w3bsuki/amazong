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
    {
      title: t("items.categories"),
      url: "/admin/categories",
      icon: IconCategory,
    },
    {
      title: t("items.brands"),
      url: "/admin/brands",
      icon: IconTags,
    },
    {
      title: t("items.messages"),
      url: "/admin/messages",
      icon: IconMessage,
    },
    {
      title: t("items.subscriptions"),
      url: "/admin/subscriptions",
      icon: IconCrown,
    },
    {
      title: t("items.analytics"),
      url: "/admin/analytics",
      icon: IconChartBar,
    },
  ]

  const adminSecondaryNav = [
    {
      title: t("secondary.backToStore"),
      url: "/",
      icon: IconHome,
    },
    {
      title: t("secondary.settings"),
      url: "/admin/settings",
      icon: IconSettings,
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
