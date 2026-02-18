import { format } from "date-fns"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  Calendar as CalendarBlank,
  CircleDollarSign as CurrencyCircleDollar,
  Crown,
  Package,
  Sparkles as Sparkle,
  SquareArrowOutUpRight as ArrowSquareOut,
  LoaderCircle as SpinnerGap,
} from "lucide-react"
import type {
  BillingDateLocale,
  BillingText,
  Seller,
  Subscription,
} from "./billing.types"

interface BillingCurrentPlanCardProps {
  seller: Seller
  subscription: Subscription | null
  t: BillingText
  dateLocale: BillingDateLocale
  formatPrice: (price: number) => string
  getPlanName: (tier: string) => string
  withLocale: (path: string) => string
  handleManageSubscription: () => Promise<void>
  isPortalLoading: boolean
}

export function BillingCurrentPlanCard({
  seller,
  subscription,
  t,
  dateLocale,
  formatPrice,
  getPlanName,
  withLocale,
  handleManageSubscription,
  isPortalLoading,
}: BillingCurrentPlanCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="size-5 text-primary" />
            {t.currentPlan}
          </CardTitle>
          {subscription && (
            <Badge
              variant={subscription.status === "active" ? "default" : "secondary"}
              className={cn(subscription.status === "active" && "bg-success")}
            >
              {subscription.status === "active"
                ? t.active
                : subscription.status === "cancelled"
                  ? t.cancelled
                  : subscription.status === "expired"
                    ? t.expired
                    : t.pending}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-content-auto items-center gap-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2.5 rounded-md",
                  seller.tier === "business"
                    ? "bg-selected"
                    : seller.tier === "premium"
                      ? "bg-warning/10"
                      : "bg-muted"
                )}
              >
                {seller.tier === "business" ? (
                  <Sparkle className="size-5 text-primary" />
                ) : seller.tier === "premium" ? (
                  <Crown className="size-5 text-warning" />
                ) : (
                  <Package className="size-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-semibold text-lg capitalize">{getPlanName(seller.tier)}</p>
                <p className="text-sm text-muted-foreground">
                  {t.commission}: {seller.commission_rate}%
                </p>
              </div>
            </div>

            {subscription && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarBlank className="size-4" />
                  <span>{t.nextBilling}:</span>
                  <span className="text-foreground font-medium">
                    {format(new Date(subscription.expires_at), "PP", { locale: dateLocale })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CurrencyCircleDollar className="size-4" />
                  <span>{t.billingPeriod}:</span>
                  <span className="text-foreground font-medium">
                    {subscription.billing_period === "yearly" ? t.yearly : t.monthly}
                    {" • "}
                    {formatPrice(subscription.price_paid)}
                  </span>
                </div>
              </div>
            )}

            {!subscription && seller.tier === "basic" && (
              <p className="text-sm text-muted-foreground">{t.freePlanDescription}</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
            {subscription?.stripe_subscription_id && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isPortalLoading}
                className="gap-1.5"
              >
                {isPortalLoading ? (
                  <SpinnerGap className="size-4 animate-spin" />
                ) : (
                  <ArrowSquareOut className="size-4" />
                )}
                {t.managePlan}
              </Button>
            )}
            {seller.tier !== "business" && (
              <Link href={withLocale("/account/plans")}>
                <Button className="gap-1.5 w-full">
                  <ArrowUpRight className="size-4" />
                  {t.upgradePlan}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
