import { ChartLine, Crown, Headset, Info, Zap as Lightning, Medal, Package } from "lucide-react";

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
import { useTranslations } from "next-intl"

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
  const t = useTranslations("Account")

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
    return t("subscriptionBenefitsCard.tierName", { tier })
  }

  const getAnalyticsLabel = (access: string) => {
    return t("subscriptionBenefitsCard.analyticsAccessLabel", { access })
  }

  const getBadgeLabel = (badge: string | null) => {
    if (!badge) return null
    return t("subscriptionBenefitsCard.badgeLabel", { badge })
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
              className={cn("size-5", isPaidPlan ? "text-primary" : "text-muted-foreground")} 
            />
            <div>
              <span className="text-sm text-muted-foreground">{t("subscriptionBenefitsCard.currentPlanLabel")}</span>
              <h3 className="font-semibold leading-tight">
                {getTierDisplayName(tier)}
              </h3>
            </div>
          </div>
          {isCancelled && expiresAt && (
            <Badge variant="outline" className="text-warning border-warning/50">
              {t("subscriptionBenefitsCard.cancellingBadge")}
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
                  <span>{t("subscriptionBenefitsCard.listingsLabel")}</span>
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
                  <Lightning className="size-4 text-primary" />
                  <span>{t("subscriptionBenefitsCard.boostsLabel")}</span>
                  {boostsResetAt && (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("subscriptionBenefitsCard.boostsResetLabel")}: {formatDate(boostsResetAt)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <span className="font-medium">
                  {boostsRemaining} {t("subscriptionBenefitsCard.boostsRemainingSuffix")}
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
                <Headset className="size-4 text-success" />
                <span>{t("subscriptionBenefitsCard.prioritySupportLabel")}</span>
                <Badge variant="secondary" className="ml-auto text-2xs">✓</Badge>
              </div>
            )}

            {/* Analytics */}
            {analyticsAccess && analyticsAccess !== "none" && (
              <div className="flex items-center gap-2 text-sm">
                <ChartLine className="size-4 text-info" />
                <span>{t("subscriptionBenefitsCard.analyticsLabel")}</span>
                <Badge variant="secondary" className="ml-auto text-2xs">
                  {getAnalyticsLabel(analyticsAccess)}
                </Badge>
              </div>
            )}

            {/* Seller Badge */}
            {badgeType && (
              <div className="flex items-center gap-2 text-sm">
                <Medal className="size-4 text-verified" />
                <span>{t("subscriptionBenefitsCard.sellerBadgeLabel")}</span>
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
                {isPaidPlan ? t("subscriptionBenefitsCard.managePlanCta") : t("subscriptionBenefitsCard.upgradePlanCta")}
              </Link>
            </Button>
          </div>

          {/* Expiry notice */}
          {expiresAt && isCancelled && (
            <p className="text-xs text-muted-foreground text-center">
              {t("subscriptionBenefitsCard.expiresOnLabel")}: {formatDate(expiresAt)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

