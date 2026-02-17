"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2 as Buildings, Check, Crown, LoaderCircle as SpinnerGap, User } from "lucide-react";

import { cn } from "@/lib/utils"
import { toast } from "sonner"

export type UpgradeContentServerActions = {
  createSubscriptionCheckoutSession: (args: {
    planId: string
    billingPeriod: "monthly" | "yearly"
    locale?: "en" | "bg"
  }) => Promise<{ url?: string; error?: string }>
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

interface SubscriptionPlan {
  id: string
  tier: string
  name: string
  price_monthly: number
  price_yearly: number
  commission_rate: number
  features: Json // Database returns Json type
  stripe_monthly_price_id?: string | null
  stripe_yearly_price_id?: string | null
  is_active: boolean
  // Optional fields from database
  account_type?: string | null
  analytics_access?: string | null
  badge_type?: string | null
  boosts_included?: number | null
  created_at?: string | null
  currency?: string | null
  [key: string]: unknown
}

interface Seller {
  id: string
  tier: string | null
  commission_rate: number | null
  [key: string]: unknown
}

interface UpgradeContentProps {
  locale: string
  plans: SubscriptionPlan[]
  currentTier: string
  seller: Seller | null
  actions: UpgradeContentServerActions
}

export function UpgradeContent({
  locale,
  plans,
  currentTier,
  seller,
  actions,
}: UpgradeContentProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')
  void seller

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const planIcons: Record<string, React.ReactNode> = {
    basic: <User className="size-5" />,
    premium: <Crown className="size-5" />,
    business: <Buildings className="size-5" />,
  }

  // Filter to only show upgrade options (plans higher than current)
  const tierOrder = ['basic', 'premium', 'business']
  const currentIndex = tierOrder.indexOf(currentTier)
  const upgradePlans = plans.filter(plan => {
    const planIndex = tierOrder.indexOf(plan.tier)
    return planIndex > currentIndex
  })

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.price_monthly === 0) {
      toast.info(locale === 'bg' ? 'Това е безплатен план' : 'This is a free plan')
      return
    }

    setLoadingPlan(plan.id)
    
    try {
      const { url, error } = await actions.createSubscriptionCheckoutSession({
        planId: plan.id,
        billingPeriod,
        locale: locale === 'bg' ? 'bg' : 'en',
      })

      if (error) {
        throw new Error(error)
      }

      if (url) {
        window.location.href = url
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

  if (upgradePlans.length === 0) {
    return (
      <div className="text-center py-8">
        <Crown className="size-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">
          {locale === 'bg' ? 'Вие сте на най-високия план!' : "You're on the highest plan!"}
        </h3>
        <p className="text-muted-foreground">
          {locale === 'bg' 
            ? 'Вече се възползвате от всички предимства.'
            : "You're already enjoying all the benefits."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Info */}
      <div className="flex items-center justify-center gap-3 p-3 bg-surface-subtle rounded-lg">
        <span className="text-sm text-muted-foreground">
          {locale === 'bg' ? 'Текущ план:' : 'Current plan:'}
        </span>
        <Badge variant="secondary" className="capitalize">
          {planIcons[currentTier]}
          <span className="ml-1.5">{currentTier}</span>
        </Badge>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 bg-muted rounded-lg p-1">
          <button
            type="button"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingPeriod === 'monthly' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod('monthly')}
            aria-pressed={billingPeriod === "monthly"}
          >
            {locale === 'bg' ? 'Месечно' : 'Monthly'}
          </button>
          <button
            type="button"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
              billingPeriod === 'yearly' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod('yearly')}
            aria-pressed={billingPeriod === "yearly"}
          >
            {locale === 'bg' ? 'Годишно' : 'Yearly'}
            <Badge variant="secondary" className="text-xs bg-selected text-primary">
              -17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Upgrade Plans */}
      <div className={cn(
        "grid gap-4",
        upgradePlans.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2"
      )}>
        {upgradePlans.map((plan) => {
          const features = plan.features as string[]
          const isLoading = loadingPlan === plan.id
          const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly
          const isRecommended = plan.tier === 'premium'

          return (
            <Card 
              key={plan.id} 
              className={cn(
                "relative",
                isRecommended && "border-2 border-primary"
              )}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    {locale === 'bg' ? 'Препоръчано' : 'Recommended'}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 p-2.5 rounded-full bg-muted text-foreground">
                  {planIcons[plan.tier]}
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-semibold">{formatPrice(price)}</span>
                    <span className="text-muted-foreground text-sm">
                      /{billingPeriod === 'monthly' 
                        ? (locale === 'bg' ? 'месец' : 'mo')
                        : (locale === 'bg' ? 'година' : 'yr')
                      }
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="line-through">{formatPrice(plan.price_monthly * 12)}</span>
                      <span className="text-primary ml-1">
                        {locale === 'bg' ? 'спестяваш' : 'save'} {formatPrice(plan.price_monthly * 12 - plan.price_yearly)}
                      </span>
                    </p>
                  )}
                </div>

                {/* Commission Rate */}
                <div className="bg-muted rounded-md p-2.5 text-center">
                  <span className="text-xl font-semibold text-foreground">{plan.commission_rate}%</span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    {locale === 'bg' ? 'комисион' : 'commission'}
                  </span>
                </div>

                {/* Features (condensed) */}
                <ul className="space-y-1.5">
                  {features.slice(0, 4).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-primary mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                  {features.length > 4 && (
                    <li className="text-xs text-muted-foreground text-center pt-1">
                      +{features.length - 4} {locale === 'bg' ? 'още' : 'more'}
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full bg-primary hover:bg-interactive-hover"
                  disabled={isLoading}
                  onClick={() => handleSubscribe(plan)}
                >
                  {isLoading ? (
                    <SpinnerGap className="size-4 animate-spin" />
                  ) : (
                    locale === 'bg' ? 'Надгради сега' : 'Upgrade Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
