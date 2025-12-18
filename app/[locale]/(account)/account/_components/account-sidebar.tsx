"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import {
  IconUser,
  IconPackage,
  IconHeart,
  IconMessage,
  IconLock,
  IconMapPin,
  IconCreditCard,
  IconReceipt,
  IconBuildingStore,
  IconChartLine,
  IconCrown,
  IconHome,
  IconSettings,
  IconLogout,
  IconSparkles,
} from "@tabler/icons-react"
import { PlansModal } from "@/components/plans-modal"
import { Button } from "@/components/ui/button"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { useSidebar } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"

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
  {    title: locale === 'bg' ? 'Следвани' : 'Following',
    url: "/account/following",
    icon: IconBuildingStore,
  },
  {    title: locale === 'bg' ? 'Съобщения' : 'Messages',
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
  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : "??"

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
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
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
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
              <Link href="/account/security">
                <IconSettings className="mr-2 size-4" />
                {locale === 'bg' ? 'Настройки' : 'Settings'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <IconLogout className="mr-2 size-4" />
              {locale === 'bg' ? 'Изход' : 'Sign Out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AccountSidebar({ user, ...props }: AccountSidebarProps) {
  const locale = useLocale()
  const pathname = usePathname()
  
  const navItems = getAccountNavItems(locale)
  const manageItems = getAccountManageItems(locale)
  const sellerItems = getAccountSellerItems(locale)
  const secondaryNav = getSecondaryNav(locale)

  const isActive = (url: string, exact?: boolean) => {
    const fullPath = `/${locale}${url}`
    if (exact) return pathname === fullPath
    return pathname === fullPath || pathname.startsWith(fullPath + '/')
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
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
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={isActive(item.url, item.exact)}
                  >
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

        {/* Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {locale === 'bg' ? 'Настройки' : 'Settings'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
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

        {/* Seller Group */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {locale === 'bg' ? 'Продавач' : 'Seller'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sellerItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
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

        {/* Upgrade CTA */}
        <SidebarGroup className="px-2">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
                <IconSparkles className="size-4 text-primary" />
              </div>
              <div className="text-sm font-medium">
                {locale === 'bg' ? 'Надградете плана' : 'Upgrade Plan'}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {locale === 'bg' 
                ? 'По-ниски комисиони и повече възможности' 
                : 'Lower commissions & more features'}
            </p>
            <PlansModal
              source="sidebar"
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
      </SidebarContent>
      <SidebarFooter>
        <AccountNavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
