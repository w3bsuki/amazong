"use client"

import { Crown, Lightning, Package, ChartLine, Headset, Medal, Info } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SubscriptionBenefitsCardProps {
  locale: string
  tier: string
  accountType: "personal" | "business"
  // From subscription_plans
  maxListings: number | null
  boostsIncluded: number
  prioritySupport: boolean
  analyticsAccess: string
  badgeType: string | null
  // Current usage
  activeListings: number
  boostsRemaining: number
  boostsResetAt: string | null
  // Subscription status
  expiresAt: string | null
  isActive: boolean
  isCancelled: boolean
}

export function SubscriptionBenefitsCard({
  locale,
  tier,
  accountType,
  maxListings,
  boostsIncluded,
  prioritySupport,
  analyticsAccess,
  badgeType,
  activeListings,
  boostsRemaining,
  boostsResetAt,
  expiresAt,
  isActive,
  isCancelled,
}: SubscriptionBenefitsCardProps) {
  const t = {
    planBenefits: locale === "bg" ? "Ползи от плана" : "Plan Benefits",
    currentPlan: locale === "bg" ? "Текущ план" : "Current plan",
    freePlan: locale === "bg" ? "Безплатен" : "Free",
    listings: locale === "bg" ? "Обяви" : "Listings",
    boosts: locale === "bg" ? "Промоции" : "Boosts",
    boostsRemaining: locale === "bg" ? "оставащи" : "remaining",
    boostsReset: locale === "bg" ? "Нулират се на" : "Resets on",
    unlimited: locale === "bg" ? "Неограничен" : "Unlimited",
    prioritySupport: locale === "bg" ? "Приоритетна поддръжка" : "Priority support",
    analytics: locale === "bg" ? "Анализи" : "Analytics",
    sellerBadge: locale === "bg" ? "Бадж на продавач" : "Seller badge",
    upgradePlan: locale === "bg" ? "Надградете плана" : "Upgrade Plan",
    managePlan: locale === "bg" ? "Управление на плана" : "Manage Plan",
    expiresOn: locale === "bg" ? "Изтича на" : "Expires on",
    cancelling: locale === "bg" ? "Ще бъде прекратен" : "Cancelling",
  }

  const isPaidPlan = tier !== "free"
  const listingsUsed = maxListings ? Math.min(activeListings, maxListings) : activeListings
  const listingsPercent = maxListings ? (listingsUsed / maxListings) * 100 : 0
  const boostsPercent = boostsIncluded > 0 ? (boostsRemaining / boostsIncluded) * 100 : 0

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getTierDisplayName = (tier: string) => {
    const names: Record<string, { en: string; bg: string }> = {
      free: { en: "Free", bg: "Безплатен" },
      plus: { en: "Plus", bg: "Плюс" },
      pro: { en: "Pro", bg: "Про" },
      professional: { en: "Business Pro", bg: "Бизнес Про" },
      enterprise: { en: "Enterprise", bg: "Ентърпрайз" },
      business: { en: "Business", bg: "Бизнес" },
    }
    return names[tier]?.[locale === "bg" ? "bg" : "en"] || tier
  }

  const getAnalyticsLabel = (access: string) => {
    const labels: Record<string, { en: string; bg: string }> = {
      none: { en: "Not included", bg: "Не е включен" },
      basic: { en: "Basic", bg: "Основен" },
      full: { en: "Full", bg: "Пълен" },
      export: { en: "Full + Export", bg: "Пълен + Експорт" },
    }
    return labels[access]?.[locale === "bg" ? "bg" : "en"] || access
  }

  const getBadgeLabel = (badge: string | null) => {
    if (!badge) return null
    const labels: Record<string, { en: string; bg: string }> = {
      plus: { en: "Plus Seller", bg: "Плюс Продавач" },
      pro: { en: "Pro Seller", bg: "Про Продавач" },
      business: { en: "Business", bg: "Бизнес" },
      business_pro: { en: "Business Pro", bg: "Бизнес Про" },
      enterprise: { en: "Enterprise", bg: "Ентърпрайз" },
    }
    return labels[badge]?.[locale === "bg" ? "bg" : "en"] || badge
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header with plan name */}
        <div className={cn(
          "px-4 py-3 flex items-center justify-between",
          isPaidPlan ? "bg-selected" : "bg-surface-subtle"
        )}>
          <div className="flex items-center gap-2">
            <Crown 
              weight={isPaidPlan ? "fill" : "regular"} 
              className={cn("size-5", isPaidPlan ? "text-primary" : "text-muted-foreground")} 
            />
            <div>
              <span className="text-sm text-muted-foreground">{t.currentPlan}</span>
              <h3 className="font-semibold leading-tight">
                {getTierDisplayName(tier)}
              </h3>
            </div>
          </div>
          {isCancelled && expiresAt && (
            <Badge variant="outline" className="text-warning border-warning/50">
              {t.cancelling}
            </Badge>
          )}
        </div>

        {/* Benefits grid */}
        <div className="p-4 space-y-4">
          {/* Listings usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-muted-foreground" />
                <span>{t.listings}</span>
              </div>
              <span className="font-medium">
                {activeListings} / {maxListings ?? "∞"}
              </span>
            </div>
            {maxListings && (
              <Progress 
                value={listingsPercent} 
                className={cn("h-2", listingsPercent > 90 && "[&>div]:bg-warning")}
              />
            )}
          </div>

          {/* Boosts */}
          {boostsIncluded > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Lightning weight="fill" className="size-4 text-primary" />
                  <span>{t.boosts}</span>
                  {boostsResetAt && (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t.boostsReset}: {formatDate(boostsResetAt)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <span className="font-medium">
                  {boostsRemaining} {t.boostsRemaining}
                </span>
              </div>
              <Progress 
                value={boostsPercent} 
                className="h-2 [&>div]:bg-primary"
              />
            </div>
          )}

          {/* Other benefits - compact list */}
          <div className="pt-2 border-t space-y-2">
            {/* Priority Support */}
            {prioritySupport && (
              <div className="flex items-center gap-2 text-sm">
                <Headset weight="duotone" className="size-4 text-success" />
                <span>{t.prioritySupport}</span>
                <Badge variant="secondary" className="ml-auto text-2xs">✓</Badge>
              </div>
            )}

            {/* Analytics */}
            {analyticsAccess && analyticsAccess !== "none" && (
              <div className="flex items-center gap-2 text-sm">
                <ChartLine weight="duotone" className="size-4 text-info" />
                <span>{t.analytics}</span>
                <Badge variant="secondary" className="ml-auto text-2xs">
                  {getAnalyticsLabel(analyticsAccess)}
                </Badge>
              </div>
            )}

            {/* Seller Badge */}
            {badgeType && (
              <div className="flex items-center gap-2 text-sm">
                <Medal weight="duotone" className="size-4 text-verified" />
                <span>{t.sellerBadge}</span>
                <Badge variant="secondary" className="ml-auto text-2xs">
                  {getBadgeLabel(badgeType)}
                </Badge>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="pt-2">
            <Button asChild variant={isPaidPlan ? "outline" : "default"} className="w-full" size="sm">
              <Link href="/account/plans">
                {isPaidPlan ? t.managePlan : t.upgradePlan}
              </Link>
            </Button>
          </div>

          {/* Expiry notice */}
          {expiresAt && isCancelled && (
            <p className="text-xs text-muted-foreground text-center">
              {t.expiresOn}: {formatDate(expiresAt)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
