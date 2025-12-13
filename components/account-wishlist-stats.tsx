"use client"

import { IconHeart, IconPackage, IconPackageOff, IconCurrencyDollar } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface WishlistStatsProps {
  stats: {
    total: number
    inStock: number
    outOfStock: number
    totalValue: number
  }
  locale: string
}

export function AccountWishlistStats({ stats, locale }: WishlistStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const t = {
    totalItems: locale === 'bg' ? 'Общо артикули' : 'Total Items',
    saved: locale === 'bg' ? 'Запазени' : 'Saved',
    inStock: locale === 'bg' ? 'Налични' : 'In Stock',
    inStockDesc: locale === 'bg' ? 'Готови за покупка' : 'Ready to buy',
    available: locale === 'bg' ? 'Налични' : 'Available',
    outOfStock: locale === 'bg' ? 'Изчерпани' : 'Out of Stock',
    outOfStockDesc: locale === 'bg' ? 'Временно недостъпни' : 'Currently unavailable',
    unavailable: locale === 'bg' ? 'Недостъпни' : 'Unavailable',
    totalValue: locale === 'bg' ? 'Обща стойност' : 'Total Value',
    totalValueDesc: locale === 'bg' ? 'На всички артикули' : 'Of all items',
    wishlistValue: locale === 'bg' ? 'Стойност' : 'Wishlist',
    items: locale === 'bg' ? 'артикула' : 'items',
    ready: locale === 'bg' ? 'налични' : 'ready',
  }

  return (
    <>
      {/* Mobile: Revolut-style stats pills */}
      <div className="flex items-center gap-3 text-sm sm:hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-account-stat-bg border border-account-stat-border">
          <IconHeart className="size-4 text-destructive" />
          <span className="font-semibold text-account-stat-value">{stats.total}</span>
          <span className="text-account-stat-label">{t.items}</span>
        </div>
        {stats.inStock > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.inStock}</span>
            <span className="text-emerald-600/70 dark:text-emerald-400/70">{t.ready}</span>
          </div>
        )}
      </div>

      {/* Desktop: Full stats cards */}
      <div className="hidden sm:grid grid-cols-2 gap-3 @xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <IconHeart className="size-4 shrink-0 text-destructive" />
              <span className="truncate">{t.totalItems}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.total.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-account-info border-account-stat-border bg-account-info-soft">
                {t.saved}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <IconPackage className="size-4 shrink-0" />
              <span className="truncate">{t.inStock}</span>
            </CardDescription>
            <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${stats.inStock > 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
              {stats.inStock.toLocaleString()}
            </CardTitle>
            <CardAction>
              {stats.inStock > 0 ? (
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400">
                  {t.available}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {t.available}
                </Badge>
              )}
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <IconPackageOff className="size-4 shrink-0" />
              <span className="truncate">{t.outOfStock}</span>
            </CardDescription>
            <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${stats.outOfStock > 0 ? 'text-orange-600 dark:text-orange-400' : ''}`}>
              {stats.outOfStock.toLocaleString()}
            </CardTitle>
            <CardAction>
              {stats.outOfStock > 0 ? (
                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-400">
                  {t.unavailable}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {t.unavailable}
                </Badge>
              )}
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <IconCurrencyDollar className="size-4 shrink-0" />
              <span className="truncate">{t.totalValue}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatCurrency(stats.totalValue)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-account-info border-account-stat-border bg-account-info-soft">
                {t.wishlistValue}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}
