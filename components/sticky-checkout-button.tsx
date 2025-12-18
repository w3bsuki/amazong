'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Lock, SpinnerGap } from '@phosphor-icons/react'

interface StickyCheckoutButtonProps {
  total: number
  totalItems: number
  isProcessing: boolean
  locale: string
  onCheckout: () => void
}

export function StickyCheckoutButton({ 
  total, 
  totalItems, 
  isProcessing, 
  locale, 
  onCheckout 
}: StickyCheckoutButtonProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40",
        "lg:hidden safe-area-bottom"
      )}
    >
      <div className="container flex items-center gap-3 py-3 px-4">
        {/* Order summary */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">
            {locale === 'bg' ? 'Общо' : 'Total'} ({totalItems} {totalItems === 1 
              ? (locale === 'bg' ? 'артикул' : 'item') 
              : (locale === 'bg' ? 'артикула' : 'items')})
          </p>
          <p className="text-lg font-bold text-brand-deal">
            {formatPrice(total)}
          </p>
        </div>
        
        {/* Checkout button */}
        <Button 
          onClick={onCheckout}
          disabled={isProcessing}
          className="h-12 px-6 font-semibold rounded-full bg-brand-deal hover:bg-brand-deal/90 text-white"
        >
          {isProcessing ? (
            <>
              <SpinnerGap className="size-5 mr-2 animate-spin" />
              {locale === 'bg' ? 'Обработка...' : 'Processing...'}
            </>
          ) : (
            <>
              <Lock className="size-5 mr-2" weight="fill" />
              {locale === 'bg' ? 'Плащане' : 'Checkout'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
