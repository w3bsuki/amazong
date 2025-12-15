"use client"

import { IconTrendingUp, IconTrendingDown, IconMinus, IconSparkles } from "@tabler/icons-react"

interface AccountHeroCardProps {
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
  userName?: string
}

export function AccountHeroCard({ totals, locale, userName }: AccountHeroCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
      maximumFractionDigits: 2,
    }).format(value)
  }

  const t = {
    greeting: locale === 'bg' ? 'Здравей' : 'Hello',
    totalRevenue: locale === 'bg' ? 'Общ приход' : 'Total Revenue',
    thisMonth: locale === 'bg' ? 'Този месец' : 'This month',
    pendingOrders: locale === 'bg' ? 'Чакащи поръчки' : 'Pending orders',
    activeListing: locale === 'bg' ? 'Активни обяви' : 'Active listings',
    newMessages: locale === 'bg' ? 'Нови съобщения' : 'New messages',
  }

  // Determine trend (mock - in production would compare to previous period)
  const trend = totals.revenue > 0 ? 'up' : totals.revenue < 0 ? 'down' : 'neutral'
  const trendPercent = totals.revenue > 0 ? '+12.5%' : '0%'

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (locale === 'bg') {
      if (hour < 12) return 'Добро утро'
      if (hour < 18) return 'Добър ден'
      return 'Добър вечер'
    }
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-5 sm:p-6 text-background">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-background/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Greeting */}
        <div className="flex items-center gap-2 mb-4">
          <IconSparkles className="size-4 text-background/70" />
          <span className="text-sm font-medium text-background/80">
            {getGreeting()}{userName ? `, ${userName}` : ''}
          </span>
        </div>

        {/* Main stat - Revenue */}
        <div className="mb-5">
          <p className="text-xs text-background/60 uppercase tracking-wider mb-1">{t.totalRevenue}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight">
              {formatCurrency(totals.revenue)}
            </span>
            {totals.revenue > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/15 text-xs font-medium">
                {trend === 'up' && <IconTrendingUp className="size-3" />}
                {trend === 'down' && <IconTrendingDown className="size-3" />}
                {trend === 'neutral' && <IconMinus className="size-3" />}
                <span>{trendPercent}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-background/10">
          <div>
            <p className="text-lg sm:text-xl font-bold">{totals.pendingOrders}</p>
            <p className="text-xs text-background/60">{t.pendingOrders}</p>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold">{totals.products}</p>
            <p className="text-xs text-background/60">{t.activeListing}</p>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold">{totals.messages}</p>
            <p className="text-xs text-background/60">{t.newMessages}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
