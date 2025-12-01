"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Buildings, User, Lightning, SpinnerGap, ArrowUpRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface SubscriptionPlan {
  id: string
  tier: string
  name: string
  price_monthly: number
  price_yearly: number
  commission_rate: number
  features: string[]
  stripe_monthly_price_id: string | null
  stripe_yearly_price_id: string | null
  is_active: boolean
}

interface Seller {
  id: string
  tier: string
  commission_rate: number
  [key: string]: unknown
}

interface Subscription {
  id: string
  seller_id: string
  plan_type: string
  status: string
  stripe_subscription_id: string | null
  [key: string]: unknown
}

interface PlansContentProps {
  locale: string
  plans: SubscriptionPlan[]
  currentTier: string
  seller: Seller | null
  currentSubscription: Subscription | null
}

export function PlansContent({ 
  locale, 
  plans, 
  currentTier, 
  seller,
  currentSubscription 
}: PlansContentProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const searchParams = useSearchParams()

  // Show toast notifications based on URL params (from Stripe redirect)
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success(
        locale === 'bg' 
          ? 'Абонаментът е активиран успешно!' 
          : 'Subscription activated successfully!'
      )
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (searchParams.get('canceled') === 'true') {
      toast.info(
        locale === 'bg' 
          ? 'Плащането беше отменено' 
          : 'Payment was cancelled'
      )
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams, locale])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BGN',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const planIcons: Record<string, React.ReactNode> = {
    basic: <User className="size-6" weight="duotone" />,
    premium: <Crown className="size-6" weight="duotone" />,
    business: <Buildings className="size-6" weight="duotone" />,
  }

  const planColors: Record<string, string> = {
    basic: "border-border",
    premium: "border-primary",
    business: "border-primary",
  }

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.price_monthly === 0) {
      // Can't subscribe to free tier via Stripe
      toast.info(locale === 'bg' ? 'Това е безплатен план' : 'This is a free plan')
      return
    }

    setLoadingPlan(plan.id)
    
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          billingPeriod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(
        locale === 'bg' 
          ? 'Грешка при създаване на плащане. Моля, опитайте отново.' 
          : 'Error creating payment. Please try again.'
      )
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/subscriptions/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open customer portal')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
      toast.error(
        locale === 'bg' 
          ? 'Грешка при отваряне на портала. Моля, опитайте отново.' 
          : 'Error opening portal. Please try again.'
      )
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          {locale === 'bg' ? 'Изберете план за продавач' : 'Choose a Seller Plan'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'bg' 
            ? 'Надградете акаунта си за по-ниски комисиони и повече възможности'
            : 'Upgrade your account for lower commissions and more features'}
        </p>
      </div>

      {/* Current Plan Badge */}
      {seller && (
        <div className="flex flex-col items-center gap-3 mb-6">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {locale === 'bg' ? 'Текущ план: ' : 'Current plan: '}
            <span className="font-semibold capitalize ml-1">{currentTier}</span>
          </Badge>
          
          <div className="flex items-center gap-2">
            {currentTier !== 'business' && (
              <Link href="/account/plans/upgrade">
                <Button size="sm" className="gap-1.5">
                  <ArrowUpRight className="size-4" weight="bold" />
                  {locale === 'bg' ? 'Надгради' : 'Upgrade'}
                </Button>
              </Link>
            )}
            {currentSubscription?.stripe_subscription_id && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManageSubscription}
              >
                {locale === 'bg' ? 'Управление на абонамента' : 'Manage Subscription'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingPeriod === 'monthly' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod('monthly')}
          >
            {locale === 'bg' ? 'Месечно' : 'Monthly'}
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
              billingPeriod === 'yearly' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod('yearly')}
          >
            {locale === 'bg' ? 'Годишно' : 'Yearly'}
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              -17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.tier === currentTier
          const isPopular = plan.tier === 'premium'
          const features = plan.features as string[]
          const isLoading = loadingPlan === plan.id
          const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly

          return (
            <Card 
              key={plan.id} 
              className={cn(
                "relative flex flex-col",
                planColors[plan.tier],
                isPopular && "border-2 border-primary",
                isCurrentPlan && "bg-muted/50"
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    {locale === 'bg' ? 'Популярен' : 'Popular'}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 p-3 rounded-full bg-muted text-foreground">
                  {planIcons[plan.tier]}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="capitalize">{plan.tier}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-semibold">
                      {price === 0 ? (locale === 'bg' ? 'Безплатно' : 'Free') : formatPrice(price)}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground text-sm">
                        /{billingPeriod === 'monthly' 
                          ? (locale === 'bg' ? 'месец' : 'month')
                          : (locale === 'bg' ? 'година' : 'year')
                        }
                      </span>
                    )}
                  </div>
                  {billingPeriod === 'yearly' && plan.price_yearly > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="line-through">{formatPrice(plan.price_monthly * 12)}</span>
                      <span className="text-primary ml-2">
                        {locale === 'bg' ? 'спестяваш' : 'save'} {formatPrice(plan.price_monthly * 12 - plan.price_yearly)}
                      </span>
                    </p>
                  )}
                </div>

                {/* Commission Rate */}
                <div className="bg-muted rounded-md p-3 mb-4 text-center">
                  <span className="text-2xl font-semibold text-foreground">{plan.commission_rate}%</span>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'bg' ? 'комисион на продажба' : 'commission per sale'}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-primary mt-0.5 shrink-0" weight="bold" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "w-full",
                    isCurrentPlan 
                      ? "bg-muted text-muted-foreground cursor-default hover:bg-muted" 
                      : "bg-interactive hover:bg-interactive-hover text-white"
                  )}
                  disabled={isCurrentPlan || isLoading}
                  onClick={() => handleSubscribe(plan)}
                >
                  {isLoading ? (
                    <SpinnerGap className="size-4 animate-spin" />
                  ) : isCurrentPlan ? (
                    locale === 'bg' ? 'Текущ план' : 'Current Plan'
                  ) : plan.tier === 'basic' ? (
                    locale === 'bg' ? 'Понижи плана' : 'Downgrade'
                  ) : (
                    locale === 'bg' ? 'Надгради' : 'Upgrade'
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Boost Section */}
      <div className="mt-10">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                <Lightning className="size-5 text-primary" weight="fill" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {locale === 'bg' ? 'Промотирай обявите си' : 'Boost Your Listings'}
                </CardTitle>
                <CardDescription>
                  {locale === 'bg' 
                    ? 'Плати за да покажеш продуктите си на повече хора'
                    : 'Pay to show your products to more people'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-border rounded-md p-4 text-center">
                <p className="text-2xl font-semibold">2.99 лв</p>
                <p className="text-sm text-muted-foreground">{locale === 'bg' ? '7 дни' : '7 days'}</p>
              </div>
              <div className="border border-primary rounded-md p-4 text-center relative">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                  {locale === 'bg' ? 'Най-добра цена' : 'Best value'}
                </Badge>
                <p className="text-2xl font-semibold">4.99 лв</p>
                <p className="text-sm text-muted-foreground">{locale === 'bg' ? '14 дни' : '14 days'}</p>
              </div>
              <div className="border border-border rounded-md p-4 text-center">
                <p className="text-2xl font-semibold">8.99 лв</p>
                <p className="text-sm text-muted-foreground">{locale === 'bg' ? '30 дни' : '30 days'}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              {locale === 'bg' 
                ? 'Промотираните обяви се показват в секцията "Препоръчани продукти" и имат по-високо позициониране в търсенето.'
                : 'Boosted listings appear in the "Recommended Products" section and rank higher in search results.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ or Help */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {locale === 'bg' ? 'Имате въпроси? ' : 'Have questions? '}
          <a href="/customer-service" className="text-link hover:underline">
            {locale === 'bg' ? 'Свържете се с нас' : 'Contact us'}
          </a>
        </p>
      </div>
    </div>
  )
}
