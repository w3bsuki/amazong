"use client"

import Link from "next/link"
import { ShieldCheck } from "@phosphor-icons/react"

interface ShippingInfoProps {
  shippingCost: number | 'free'
  location: string
  deliveryDate: string
  returnDays?: number
  locale: string
  t: {
    shipping: string
    freeShipping: string
    seeDetails: string
    locatedIn: string
    deliveryLabel: string
    estimatedDelivery: string
    returnsLabel: string
    returns30Days: string
    payments: string
    moneyBackGuarantee: string
    getItemOrMoneyBack: string
    learnMore: string
  }
}

export function ShippingInfo({
  shippingCost,
  location,
  deliveryDate,
  returnDays = 30,
  locale,
  t,
}: ShippingInfoProps) {
  return (
    <>
      <div className="border-t border-b py-2.5 text-sm space-y-2 mt-2">
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{t.shipping}</span>
          <div className="flex-1">
            <span className="font-semibold text-shipping-free">
              {shippingCost === 'free' ? t.freeShipping : `€${shippingCost.toFixed(2)}`}
            </span>
            <span> Standard Shipping </span>
            <button className="text-primary hover:underline">{t.seeDetails}</button>
            <div className="text-muted-foreground text-xs mt-0.5">{t.locatedIn} {location}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{t.deliveryLabel}</span>
          <span>{t.estimatedDelivery} <span className="font-semibold">{deliveryDate}</span></span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{t.returnsLabel}</span>
          <span>{t.returns30Days} <button className="text-primary hover:underline">{t.seeDetails}</button></span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-muted-foreground shrink-0 w-18 sm:w-20">{t.payments}</span>
          <div className="flex items-center gap-1">
            <div className="h-5 px-1.5 bg-brand-dark text-white text-xs font-bold flex items-center rounded-sm">PayPal</div>
            <div className="h-5 px-1.5 bg-background border text-xs font-bold flex items-center rounded-sm text-muted-foreground">Visa</div>
            <div className="h-5 px-1.5 bg-background border text-xs font-bold flex items-center rounded-sm text-muted-foreground">MC</div>
          </div>
        </div>
      </div>

      {/* Guarantee */}
      <div className="flex items-start gap-1.5 py-1.5">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm">
          <span className="font-medium">{t.moneyBackGuarantee}</span>
          <span className="text-muted-foreground"> {t.getItemOrMoneyBack}</span>
          <Link href={`/${locale}/help/buyer-protection`} className="text-primary hover:underline ml-1">{t.learnMore}</Link>
        </p>
      </div>
    </>
  )
}
