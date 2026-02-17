"use client"

import { useTranslations } from "next-intl"
import { Briefcase, House, MapPin, Star } from "lucide-react";


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
}

export function AccountAddressesStats({ stats }: AddressesStatsProps) {
  const t = useTranslations("Account.addressesPage.stats")

  return (
    <>
      {/* Mobile: Simple inline stats */}
      <div className="flex items-center gap-4 text-sm sm:hidden">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-4 text-muted-foreground" />
          <span className="font-medium">{stats.total}</span>
          <span className="text-muted-foreground">
            {stats.total === 1 ? t("addressSingular") : t("addressPlural")}
          </span>
        </div>
        {stats.defaultCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            <span className="font-medium text-primary">{stats.defaultCount}</span>
            <span className="text-muted-foreground">{t("defaultShort")}</span>
          </div>
        )}
      </div>

      {/* Desktop: Full stats cards */}
      <div className="hidden sm:grid grid-cols-2 gap-3 @xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">{t("totalAddresses")}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.total.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-muted-foreground border-border">
                {t("all")}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Star className="size-4 shrink-0" />
              <span className="truncate">{t("defaultAddress")}</span>
            </CardDescription>
            <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${stats.defaultCount > 0 ? 'text-primary' : ''}`}>
              {stats.defaultCount.toLocaleString()}
            </CardTitle>
            <CardAction>
              {stats.defaultCount > 0 ? (
                <Badge variant="outline" className="text-primary border-selected-border bg-selected">
                  {t("active")}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {t("active")}
                </Badge>
              )}
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <House className="size-4 shrink-0" />
              <span className="truncate">{t("home")}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-success @[250px]/card:text-3xl">
              {stats.homeCount.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-success border-success/20 bg-success/10">
                {t("personal")}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Briefcase className="size-4 shrink-0" />
              <span className="truncate">{t("work")}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.workCount.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-info border-border-subtle bg-info/10">
                {t("business")}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}
