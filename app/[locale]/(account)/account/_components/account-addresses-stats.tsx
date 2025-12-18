"use client"

import { MapPin, House, Briefcase, Star } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AddressesStatsProps {
  stats: {
    total: number
    defaultCount: number
    homeCount: number
    workCount: number
  }
  locale: string
}

export function AccountAddressesStats({ stats, locale }: AddressesStatsProps) {
  const t = {
    totalAddresses: locale === 'bg' ? 'Общо адреси' : 'Total Addresses',
    savedLocations: locale === 'bg' ? 'Запазени места' : 'Saved locations',
    defaultAddress: locale === 'bg' ? 'По подразбиране' : 'Default',
    forDelivery: locale === 'bg' ? 'За доставка' : 'For delivery',
    active: locale === 'bg' ? 'Активен' : 'Active',
    home: locale === 'bg' ? 'Дом' : 'Home',
    homeAddresses: locale === 'bg' ? 'Домашни адреси' : 'Home addresses',
    personal: locale === 'bg' ? 'Лични' : 'Personal',
    work: locale === 'bg' ? 'Работа' : 'Work',
    workAddresses: locale === 'bg' ? 'Работни адреси' : 'Work addresses',
    business: locale === 'bg' ? 'Бизнес' : 'Business',
    all: locale === 'bg' ? 'Всички' : 'All',
    addresses: locale === 'bg' ? 'адреса' : 'addresses',
    address: locale === 'bg' ? 'адрес' : 'address',
    default: locale === 'bg' ? 'по подразбиране' : 'default',
  }

  return (
    <>
      {/* Mobile: Simple inline stats */}
      <div className="flex items-center gap-4 text-sm sm:hidden">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-4 text-muted-foreground" weight="duotone" />
          <span className="font-medium">{stats.total}</span>
          <span className="text-muted-foreground">{stats.total === 1 ? t.address : t.addresses}</span>
        </div>
        {stats.defaultCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-brand" />
            <span className="font-medium text-brand">{stats.defaultCount}</span>
            <span className="text-muted-foreground">{t.default}</span>
          </div>
        )}
      </div>

      {/* Desktop: Full stats cards */}
      <div className="hidden sm:grid grid-cols-2 gap-3 @xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" weight="duotone" />
              <span className="truncate">{t.totalAddresses}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.total.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-muted-foreground border-border">
                {t.all}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Star className="size-4 shrink-0" weight="duotone" />
              <span className="truncate">{t.defaultAddress}</span>
            </CardDescription>
            <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${stats.defaultCount > 0 ? 'text-brand' : ''}`}>
              {stats.defaultCount.toLocaleString()}
            </CardTitle>
            <CardAction>
              {stats.defaultCount > 0 ? (
                <Badge variant="outline" className="text-brand border-brand/30 bg-brand/10">
                  {t.active}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {t.active}
                </Badge>
              )}
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <House className="size-4 shrink-0" weight="duotone" />
              <span className="truncate">{t.home}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 @[250px]/card:text-3xl">
              {stats.homeCount.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400">
                {t.personal}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Briefcase className="size-4 shrink-0" weight="duotone" />
              <span className="truncate">{t.work}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.workCount.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-account-info border-account-stat-border bg-account-info-soft">
                {t.business}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}
