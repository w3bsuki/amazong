"use client"


import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronRight as CaretRight, CircleCheck as CheckCircle, Clock, Crown, Eye, Zap as Lightning, Rocket, LoaderCircle as SpinnerGap, TrendingUp as TrendUp } from "lucide-react";

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

type PricingOption = {
  days: number
  sku: string
  priceEur: number
  priceBgn: number
  durationKey: string
  currency: string
}

interface Product {
  id: string
  title: string
  is_boosted?: boolean
  boost_expires_at?: string | null
}

interface BoostDialogProps {
  product: Product
  locale: string
  trigger?: React.ReactNode
  onBoostSuccess?: () => void
}

export function BoostDialog({ product, locale, trigger, onBoostSuccess }: BoostDialogProps) {
  const [selectedDays, setSelectedDays] = useState<number>(7)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [pricingStatus, setPricingStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [pricingOptions, setPricingOptions] = useState<PricingOption[] | null>(null)
  const t = useTranslations('Boost')

  const formatPriceEur = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatPriceBgn = (price: number) => {
    return t('priceBgn', { price: price.toFixed(2) })
  }

  useEffect(() => {
    if (!isOpen) return
    if (pricingStatus === "loading" || pricingStatus === "ready") return

    let cancelled = false
    setPricingStatus("loading")

    void (async () => {
      try {
        const response = await fetch("/api/boost/checkout", { method: "GET" })
        const data = (await response.json()) as { options?: PricingOption[] }
        const options = Array.isArray(data.options) ? data.options : []

        if (cancelled) return

        if (!response.ok || options.length === 0) {
          setPricingStatus("error")
          setPricingOptions(null)
          return
        }

        setPricingOptions(options)
        setPricingStatus("ready")

        if (!options.some((opt) => opt.days === selectedDays)) {
          const nextDefault = options.find((opt) => opt.days === 7)?.days ?? options[0]?.days
          if (typeof nextDefault === "number") setSelectedDays(nextDefault)
        }
      } catch {
        if (cancelled) return
        setPricingStatus("error")
        setPricingOptions(null)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isOpen, pricingStatus, selectedDays])

  const handleBoost = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/boost/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          durationDays: selectedDays.toString(),
          locale,
        }),
      })

      const data = (await response.json()) as {
        url?: string | null
        errorKey?: string
        durationKey?: string
      }

      if (!response.ok || data.errorKey) {
        toast.error(t(data.errorKey ?? "errors.internal"))
        return
      }

      if (!data.durationKey) {
        toast.error(t("errors.internal"))
        return
      }

      const url = data.url
      onBoostSuccess?.()

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Boost error:', error)
      toast.error(t('paymentError'))
    } finally {
      setIsLoading(false)
    }
  }

  // Compute boost status using shared logic
  const isCurrentlyBoosted = product.is_boosted && product.boost_expires_at 
    ? new Date(product.boost_expires_at) > new Date() 
    : false
  
  // Calculate time left for active boost
  const getTimeLeft = () => {
    if (!product.boost_expires_at) return null
    const expiresAt = new Date(product.boost_expires_at)
    const now = new Date()
    const diffMs = expiresAt.getTime() - now.getTime()
    if (diffMs <= 0) return null
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return { days, hours }
  }
  
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(locale, { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(new Date(dateStr))
  }
  
  // If boost is currently active, show detailed status badge (not a dialog)
  if (isCurrentlyBoosted && product.boost_expires_at) {
    const timeLeft = getTimeLeft()
    return (
      <div className="flex flex-col gap-1">
        <Badge className="bg-selected text-primary border-0 gap-1">
          <Lightning className="size-3" />
          {timeLeft 
            ? t('timeLeft', { days: timeLeft.days, hours: timeLeft.hours })
            : t('boostActive')
          }
        </Badge>
        <span className="text-2xs text-muted-foreground">
          {t('boostActiveUntil', { date: formatDate(product.boost_expires_at) })}
        </span>
      </div>
    )
  }
  
  // Check if there was a previous boost that expired (allow re-boost)
  const wasBoostExpired = product.is_boosted && product.boost_expires_at 
    ? new Date(product.boost_expires_at) <= new Date() 
    : false

  const selectedPricing = pricingOptions?.find((opt) => opt.days === selectedDays) ?? null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5 text-primary border-selected-border hover:bg-hover hover:text-primary">
            <Lightning className="size-4" />
            {wasBoostExpired ? t('reboost') : t('trigger')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-selected flex items-center justify-center">
              <Rocket className="size-5 text-primary" />
            </div>
            {t('title')}
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Product being boosted */}
          <div className="p-3 bg-surface-subtle rounded-lg">
            <p className="text-sm font-medium truncate">{product.title}</p>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t('selectDuration')}</p>
            {pricingStatus === "loading" ? (
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-lg border border-border bg-surface-subtle animate-pulse"
                  />
                ))}
              </div>
            ) : pricingStatus === "error" || !pricingOptions ? (
              <div className="rounded-lg border border-border bg-surface-subtle p-3 text-xs text-muted-foreground">
                {t("errors.internal")}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {pricingOptions.map((option) => {
                  const isSelected = selectedDays === option.days
                  const isPopular = option.days === 7
                  const isBestValue = option.days === 30
                  const pricePerDayEur = option.priceEur / (option.days === 1 ? 1 : option.days)

                  return (
                    <button
                      key={option.days}
                      onClick={() => setSelectedDays(option.days)}
                      className={cn(
                        "relative flex flex-col items-center p-3 rounded-lg border-2 transition-all",
                        isSelected
                          ? "border-selected-border bg-selected"
                          : "border-border hover:border-hover-border"
                      )}
                    >
                      {isPopular && (
                        <Badge
                          className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xs px-1.5 py-0"
                          variant="default"
                        >
                          {t('popular')}
                        </Badge>
                      )}
                      {isBestValue && (
                        <Badge
                          className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xs px-1.5 py-0 bg-success"
                          variant="default"
                        >
                          {t('bestValue')}
                        </Badge>
                      )}
                      <span className="text-lg font-bold">{option.days === 1 ? '24' : option.days}</span>
                      <span className="text-xs text-muted-foreground">{option.days === 1 ? t('hours') : t('days')}</span>
                      <span className={cn(
                        "text-sm font-semibold mt-1",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {formatPriceEur(option.priceEur)}
                      </span>
                      <span className="text-2xs text-muted-foreground">
                        {formatPriceBgn(option.priceBgn)}
                      </span>
                      {option.days > 1 && (
                        <span className="text-2xs text-muted-foreground mt-0.5">
                          {formatPriceEur(pricePerDayEur)}{t('perDay')}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t('features')}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: TrendUp, text: t('feature1') },
                { icon: Lightning, text: t('feature2') },
                { icon: Eye, text: t('feature3') },
                { icon: Clock, text: t('feature4') },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="size-4 text-success" />
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleBoost}
            disabled={isLoading || pricingStatus !== "ready" || !selectedPricing}
          >
            {isLoading ? (
              <>
                <SpinnerGap className="size-4 animate-spin" />
                {t('processing')}
              </>
            ) : (
              <>
                <Lightning className="size-4" />
                {t('boostNow')} • {formatPriceEur(selectedPricing?.priceEur ?? 0)}
              </>
            )}
          </Button>

          {/* Divider with "or" */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('or')}
              </span>
            </div>
          </div>

          {/* View Plans CTA */}
          <Link
            href="/account/plans"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between w-full p-3 rounded-lg border border-selected-border bg-selected hover:bg-hover transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-selected flex items-center justify-center">
                <Crown className="size-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">
                  {t('upgradePlan')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('upgradeDesc')}
                </p>
              </div>
            </div>
            <CaretRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
