import { useTranslations } from "next-intl"
import { Briefcase, House, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge"
import { StatCard, StatCardGrid } from "@/components/shared/stat-card"

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
      <StatCardGrid className="hidden sm:grid">
        <StatCard
          label={t("totalAddresses")}
          value={stats.total.toLocaleString()}
          icon={MapPin}
          badge={<Badge variant="outline" className="text-muted-foreground border-border">{t("all")}</Badge>}
        />

        <StatCard
          label={t("defaultAddress")}
          value={stats.defaultCount.toLocaleString()}
          icon={Star}
          valueClassName={stats.defaultCount > 0 ? "text-primary" : undefined}
          badge={
            stats.defaultCount > 0 ? (
              <Badge variant="outline" className="text-primary border-selected-border bg-selected">
                {t("active")}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground border-border">
                {t("active")}
              </Badge>
            )
          }
        />

        <StatCard
          label={t("home")}
          value={stats.homeCount.toLocaleString()}
          icon={House}
          valueClassName="text-success"
          badge={<Badge variant="outline" className="text-success border-success/20 bg-success/10">{t("personal")}</Badge>}
        />

        <StatCard
          label={t("work")}
          value={stats.workCount.toLocaleString()}
          icon={Briefcase}
          badge={<Badge variant="outline" className="text-info border-border-subtle bg-info/10">{t("business")}</Badge>}
        />
      </StatCardGrid>
    </>
  )
}

