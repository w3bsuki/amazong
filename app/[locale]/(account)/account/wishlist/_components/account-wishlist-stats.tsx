import { DollarSign as IconCurrencyDollar, Heart as IconHeart, Package as IconPackage, PackageX as IconPackageOff } from "lucide-react";


import { Badge } from "@/components/ui/badge"
import { StatCard, StatCardGrid } from "@/components/shared/stat-card"

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
      currency: 'EUR',
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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border-subtle">
          <IconHeart className="size-4 text-destructive" />
          <span className="font-semibold text-foreground">{stats.total}</span>
          <span className="text-muted-foreground">{t.items}</span>
        </div>
        {stats.inStock > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <span className="size-2 rounded-full bg-success" />
            <span className="font-semibold text-success">{stats.inStock}</span>
            <span className="text-success/70">{t.ready}</span>
          </div>
        )}
      </div>

      {/* Desktop: Full stats cards */}
      <StatCardGrid className="hidden sm:grid">
        <StatCard
          icon={IconHeart}
          iconClassName="text-destructive"
          label={t.totalItems}
          value={stats.total.toLocaleString()}
          badge={
            <Badge variant="outline" className="text-info border-border-subtle bg-info/10">
              {t.saved}
            </Badge>
          }
        />

        <StatCard
          icon={IconPackage}
          label={t.inStock}
          value={stats.inStock.toLocaleString()}
          valueClassName={stats.inStock > 0 ? "text-success" : undefined}
          badge={
            <Badge
              variant="outline"
              className={stats.inStock > 0 ? "text-success border-success/20 bg-success/10" : "text-muted-foreground border-border"}
            >
              {t.available}
            </Badge>
          }
        />

        <StatCard
          icon={IconPackageOff}
          label={t.outOfStock}
          value={stats.outOfStock.toLocaleString()}
          valueClassName={stats.outOfStock > 0 ? "text-warning" : undefined}
          badge={
            <Badge
              variant="outline"
              className={stats.outOfStock > 0 ? "text-warning border-warning/20 bg-warning/10" : "text-muted-foreground border-border"}
            >
              {t.unavailable}
            </Badge>
          }
        />

        <StatCard
          icon={IconCurrencyDollar}
          label={t.totalValue}
          value={formatCurrency(stats.totalValue)}
          badge={
            <Badge variant="outline" className="text-info border-border-subtle bg-info/10">
              {t.wishlistValue}
            </Badge>
          }
        />
      </StatCardGrid>
    </>
  )
}

