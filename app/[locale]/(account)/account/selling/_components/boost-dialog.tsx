"use client"

import { useState } from "react"
import Link from "next/link"
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
import {
  Lightning,
  SpinnerGap,
  CheckCircle,
  Rocket,
  Eye,
  TrendUp,
  Clock,
  Crown,
  CaretRight,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface BoostOption {
  days: number
  price: number
  label: string
  popular?: boolean
}

// Boost pricing options (must match API)
const BOOST_OPTIONS: BoostOption[] = [
  { days: 7, price: 2.99, label: "7 дни" },
  { days: 14, price: 5.00, label: "14 дни", popular: true },
  { days: 30, price: 9.99, label: "30 дни" },
]

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

export function BoostDialog({ product, locale, trigger, onBoostSuccess: _onBoostSuccess }: BoostDialogProps) {
  const [selectedDays, setSelectedDays] = useState<number>(14)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const t = {
    boostListing: locale === 'bg' ? 'Промотирай обявата' : 'Boost Listing',
    boostDesc: locale === 'bg' 
      ? 'Получете до 10 пъти повече гледания с промотирана обява'
      : 'Get up to 10x more views with a boosted listing',
    selectDuration: locale === 'bg' ? 'Изберете продължителност' : 'Select duration',
    days: locale === 'bg' ? 'дни' : 'days',
    popular: locale === 'bg' ? 'Популярен' : 'Popular',
    features: locale === 'bg' ? 'Какво получавате' : 'What you get',
    feature1: locale === 'bg' ? 'Топ позиция в търсенето' : 'Top position in search',
    feature2: locale === 'bg' ? 'Маркер "Промотирано"' : '"Boosted" badge',
    feature3: locale === 'bg' ? 'До 10x повече гледания' : 'Up to 10x more views',
    feature4: locale === 'bg' ? 'Показване на началната страница' : 'Featured on homepage',
    boostNow: locale === 'bg' ? 'Промотирай сега' : 'Boost Now',
    processing: locale === 'bg' ? 'Обработка...' : 'Processing...',
    alreadyBoosted: locale === 'bg' ? 'Вече е промотирано' : 'Already boosted',
    boostActive: locale === 'bg' ? 'Промоцията е активна' : 'Boost is active',
    expiresIn: locale === 'bg' ? 'Изтича' : 'Expires',
    perDay: locale === 'bg' ? '/ден' : '/day',
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BGN',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const handleBoost = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/boost/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          durationDays: selectedDays.toString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create boost session')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Boost error:', error)
      toast.error(
        locale === 'bg' 
          ? 'Грешка при създаване на плащане. Моля, опитайте отново.'
          : 'Error creating payment. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // If already boosted, show status instead
  if (product.is_boosted && product.boost_expires_at) {
    const expiresAt = new Date(product.boost_expires_at)
    const now = new Date()
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysLeft > 0) {
      return (
        <Badge className="bg-primary/10 text-primary border-0 gap-1">
          <Lightning className="size-3" weight="fill" />
          {t.boostActive} ({daysLeft} {t.days})
        </Badge>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary">
            <Lightning className="size-4" weight="bold" />
            {locale === 'bg' ? 'Промотирай' : 'Boost'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Rocket className="size-5 text-primary" weight="fill" />
            </div>
            {t.boostListing}
          </DialogTitle>
          <DialogDescription>{t.boostDesc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Product being boosted */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium truncate">{product.title}</p>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t.selectDuration}</p>
            <div className="grid grid-cols-3 gap-2">
              {BOOST_OPTIONS.map((option) => {
                const isSelected = selectedDays === option.days
                const pricePerDay = option.price / option.days
                
                return (
                  <button
                    key={option.days}
                    onClick={() => setSelectedDays(option.days)}
                    className={cn(
                      "relative flex flex-col items-center p-3 rounded-lg border-2 transition-all",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {option.popular && (
                      <Badge 
                        className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xs px-1.5 py-0"
                        variant="default"
                      >
                        {t.popular}
                      </Badge>
                    )}
                    <span className="text-lg font-bold">{option.days}</span>
                    <span className="text-xs text-muted-foreground">{t.days}</span>
                    <span className={cn(
                      "text-sm font-semibold mt-1",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {formatPrice(option.price)}
                    </span>
                    <span className="text-2xs text-muted-foreground">
                      {formatPrice(pricePerDay)}{t.perDay}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t.features}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: TrendUp, text: t.feature1 },
                { icon: Lightning, text: t.feature2 },
                { icon: Eye, text: t.feature3 },
                { icon: Clock, text: t.feature4 },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="size-4 text-green-500" weight="fill" />
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <SpinnerGap className="size-4 animate-spin" />
                {t.processing}
              </>
            ) : (
              <>
                <Lightning className="size-4" weight="fill" />
                {t.boostNow} • {formatPrice(BOOST_OPTIONS.find(o => o.days === selectedDays)?.price || 0)}
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
                {locale === 'bg' ? 'или' : 'or'}
              </span>
            </div>
          </div>

          {/* View Plans CTA */}
          <Link 
            href={`/${locale}/account/plans`}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between w-full p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Crown className="size-5 text-primary" weight="fill" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">
                  {locale === 'bg' ? 'Надградете плана си' : 'Upgrade Your Plan'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'bg' 
                    ? 'Вземете 5+ безплатни буста на месец' 
                    : 'Get 5+ free boosts per month'}
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
