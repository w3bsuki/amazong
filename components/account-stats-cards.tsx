"use client"

import { IconPackage, IconChartLine, IconBuildingStore, IconMessage, IconHeart, IconChevronRight, IconPlus } from "@tabler/icons-react"
import Link from "next/link"

interface AccountStatsProps {
  totals: {
    orders: number
    pendingOrders: number
    sales: number
    revenue: number
    products: number
    messages: number
    wishlist: number
  }
  locale: string
}

export function AccountStatsCards({ totals, locale }: AccountStatsProps) {
  const t = {
    orders: locale === 'bg' ? 'Поръчки' : 'Orders',
    sales: locale === 'bg' ? 'Продажби' : 'Sales',
    products: locale === 'bg' ? 'Обяви' : 'Listings',
    messages: locale === 'bg' ? 'Чат' : 'Chat',
    wishlist: locale === 'bg' ? 'Любими' : 'Saved',
    sell: locale === 'bg' ? 'Продай' : 'Sell',
    settings: locale === 'bg' ? 'Настройки' : 'Settings',
  }

  // Quick actions - Professional neutral icons
  const quickActions = [
    {
      href: "/account/orders",
      icon: IconPackage,
      label: t.orders,
      count: totals.orders,
    },
    {
      href: "/account/selling",
      icon: IconBuildingStore,
      label: t.products,
      count: totals.products,
    },
    {
      href: "/account/sales",
      icon: IconChartLine,
      label: t.sales,
      count: totals.sales,
    },
    {
      href: "/chat",
      icon: IconMessage,
      label: t.messages,
      count: totals.messages,
    },
    {
      href: "/account/wishlist",
      icon: IconHeart,
      label: t.wishlist,
      count: totals.wishlist,
    },
    {
      href: "/sell",
      icon: IconPlus,
      label: t.sell,
      count: null,
    },
  ]

  return (
    <>
      {/* Mobile: Revolut-style circular action buttons */}
      <div className="sm:hidden">
        <div className="grid grid-cols-5 gap-1">
          {quickActions.slice(0, 5).map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-1.5 py-2 active:scale-95 transition-transform"
            >
              {/* Circular neutral icon */}
              <div className="relative flex size-12 items-center justify-center rounded-full bg-account-stat-icon-bg border border-border">
                <action.icon className="size-5 text-account-stat-icon" strokeWidth={1.8} />
                {/* Count badge */}
                {action.count !== null && action.count > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-foreground text-background px-1 text-[10px] font-bold shadow-sm">
                    {action.count > 99 ? '99+' : action.count}
                  </div>
                )}
              </div>
              {/* Label */}
              <span className="text-[11px] font-medium text-account-stat-label text-center leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: Horizontal quick actions bar */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-account-stat-bg border border-account-stat-border hover:bg-account-card-hover transition-all shrink-0"
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-account-stat-icon-bg">
              <action.icon className="size-3.5 text-account-stat-icon" strokeWidth={2} />
            </div>
            <span className="text-sm font-medium text-account-stat-value">{action.label}</span>
            {action.count !== null && action.count > 0 && (
              <span className="text-xs font-semibold text-account-stat-label bg-account-accent-soft px-1.5 py-0.5 rounded-full">
                {action.count}
              </span>
            )}
            <IconChevronRight className="size-3.5 text-muted-foreground/50 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </>
  )
}
