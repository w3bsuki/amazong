"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { Bell as IconBell, Store as IconBuildingStore, ChartLine as IconChartLine, CreditCard as IconCreditCard, Crown as IconCrown, EllipsisVertical as IconDotsVertical, Heart as IconHeart, House as IconHome, Lock as IconLock, LogOut as IconLogout, MapPin as IconMapPin, MessageCircle as IconMessage, Package as IconPackage, Receipt as IconReceipt, Settings as IconSettings, Sparkles as IconSparkles, User as IconUser } from "lucide-react";

import { PlansModal, type PlansModalServerActions } from "./plans-modal"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar"

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/layout/sidebar/sidebar"
import { UserAvatar } from "@/components/shared/user-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useSidebar } from "@/components/layout/sidebar/sidebar"

const getAccountNavItems = (locale: string) => [
  {
    title: locale === 'bg' ? 'Преглед' : 'Overview',
    url: "/account",
    icon: IconUser,
    exact: true,
  },
  {
    title: locale === 'bg' ? 'Поръчки' : 'Orders',
    url: "/account/orders",
    icon: IconPackage,
  },
  {
    title: locale === 'bg' ? 'Любими' : 'Wishlist',
    url: "/account/wishlist",
    icon: IconHeart,
  },
  {
    title: locale === 'bg' ? 'Следвани' : 'Following',
    url: "/account/following",
    icon: IconBuildingStore,
  },
  {
    title: locale === 'bg' ? 'Съобщения' : 'Messages',
    url: "/chat",
    icon: IconMessage,
  },
]

const getAccountManageItems = (locale: string) => [
  {
    title: locale === 'bg' ? 'Профил' : 'Profile',
    url: "/account/profile",
    icon: IconUser,
  },
  {
    title: locale === 'bg' ? 'Сигурност' : 'Security',
    url: "/account/security",
    icon: IconLock,
  },
  {
    title: locale === 'bg' ? 'Адреси' : 'Addresses',
    url: "/account/addresses",
    icon: IconMapPin,
  },
  {
    title: locale === 'bg' ? 'Плащания' : 'Payments',
    url: "/account/payments",
    icon: IconCreditCard,
  },
  {
    title: locale === 'bg' ? 'Фактуриране' : 'Billing',
    url: "/account/billing",
    icon: IconReceipt,
  },
  {
    title: locale === 'bg' ? 'Известия' : 'Notifications',
    url: "/account/notifications",
    icon: IconBell,
  },
]

const getAccountSellerItems = (locale: string) => [
  {
    title: locale === 'bg' ? 'Продавам' : 'Selling',
    url: "/account/selling",
    icon: IconBuildingStore,
  },
  {
    title: locale === 'bg' ? 'Продажби' : 'Sales',
    url: "/account/sales",
    icon: IconChartLine,
  },
]

const getSecondaryNav = (locale: string) => [
  {
    title: locale === 'bg' ? 'Към магазина' : 'Back to Store',
    url: "/",
    icon: IconHome,
  },
]

interface AccountSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar?: string
  }
  plansModalActions: PlansModalServerActions
}

function AccountSidebarNavList({
  items,
  isActive,
}: {
  items: Array<{
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    exact?: boolean
  }>
  isActive: (url: string, exact?: boolean) => boolean
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url, item.exact)}>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

function AccountNavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar?: string
  }
}) {
  const { isMobile } = useSidebar()
  const locale = useLocale()
  const displayName = user.name?.trim() || user.email

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar
                name={displayName}
                avatarUrl={user.avatar ?? null}
                className="size-8 rounded-lg"
                fallbackClassName="rounded-lg bg-selected text-primary"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name || user.email}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {locale === 'bg' ? 'Личен акаунт' : 'Personal Account'}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar
                  name={displayName}
                  avatarUrl={user.avatar ?? null}
                  className="size-8 rounded-lg"
                  fallbackClassName="rounded-lg bg-selected text-primary"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name || user.email}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account/settings">
                <IconSettings className="mr-2 size-4" />
                {locale === 'bg' ? 'Настройки' : 'Settings'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-0">
              <form action="/api/auth/sign-out" method="post" className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-accent focus:bg-accent cursor-pointer"
                >
                  <IconLogout className="size-4" />
                  {locale === 'bg' ? 'Изход' : 'Sign Out'}
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AccountSidebar({ user, plansModalActions, ...props }: AccountSidebarProps) {
  const locale = useLocale()
  const pathname = usePathname()

  const localePrefix = `/${locale}`
  const basePathname = pathname.startsWith(localePrefix)
    ? (pathname.slice(localePrefix.length) || "/")
    : pathname

  const navItems = getAccountNavItems(locale)
  const manageItems = getAccountManageItems(locale)
  const sellerItems = getAccountSellerItems(locale)
  const secondaryNav = getSecondaryNav(locale)

  const isActive = (url: string, exact?: boolean) => {
    const fullPath = url
    if (exact) return basePathname === fullPath
    return basePathname === fullPath || basePathname.startsWith(fullPath + '/')
  }

  return (
    <DashboardSidebar
      {...props}
      header={
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/account">
                <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                  A
                </div>
                <span className="text-base font-semibold">
                  {locale === 'bg' ? 'Моят акаунт' : 'My Account'}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      }
      footer={<AccountNavUser user={user} />}
    >
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <AccountSidebarNavList items={navItems} isActive={isActive} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {locale === 'bg' ? 'Настройки' : 'Settings'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <AccountSidebarNavList items={manageItems} isActive={isActive} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Seller Group */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {locale === 'bg' ? 'Продавач' : 'Seller'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <AccountSidebarNavList items={sellerItems} isActive={isActive} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Upgrade CTA */}
        <SidebarGroup className="px-2">
          <div className="rounded-lg bg-selected border border-selected-border p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-md bg-selected flex items-center justify-center">
                <IconSparkles className="size-4 text-primary" />
              </div>
              <div className="text-sm font-medium">
                {locale === 'bg' ? 'Надградете плана' : 'Upgrade Plan'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {locale === 'bg'
                ? 'По-ниски такси и повече възможности'
                : 'Lower fees & more features'}
            </p>
            <PlansModal
              source="sidebar"
              actions={plansModalActions}
              trigger={
                <Button size="sm" className="w-full h-8 text-xs">
                  <IconCrown className="size-3.5 mr-1.5" />
                  {locale === 'bg' ? 'Виж планове' : 'View Plans'}        
                </Button>
              }
            />
          </div>
        </SidebarGroup>

        {/* Secondary Nav */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
    </DashboardSidebar>
  )
}
