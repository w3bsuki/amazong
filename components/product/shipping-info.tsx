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
    <div className="mt-4 space-y-4">
      <div className="border-t border-b py-3 text-sm space-y-2.5">
        <div className="flex gap-3">
          <span className="text-xs font-medium text-muted-foreground shrink-0 w-20">{t.shipping}</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="font-semibold text-success">
                {shippingCost === 'free' ? t.freeShipping : `€${shippingCost.toFixed(2)}`}
              </span>
              <span className="font-medium text-xs">Standard Shipping</span>
              <button className="text-primary hover:underline text-xs font-medium">{t.seeDetails}</button>
            </div>
            <div className="text-muted-foreground text-xs mt-0.5">{t.locatedIn} <span className="text-foreground/80">{location}</span></div>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-xs font-medium text-muted-foreground shrink-0 w-20">{t.deliveryLabel}</span>
          <div className="flex-1">
            <span className="text-muted-foreground text-xs">{t.estimatedDelivery}</span>
            <span className="font-medium text-foreground ml-1">{deliveryDate}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-xs font-medium text-muted-foreground shrink-0 w-20">{t.returnsLabel}</span>
          <div className="flex-1">
            <span className="font-medium text-xs">{t.returns30Days}</span>
            <button className="text-primary hover:underline ml-2 text-xs font-medium">{t.seeDetails}</button>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-xs font-medium text-muted-foreground shrink-0 w-20">{t.payments}</span>
          <div className="flex items-center gap-1.5">
            <div className="h-5 px-1.5 bg-[#003087] text-white text-[9px] font-bold flex items-center rounded-md">PAYPAL</div>
            <div className="h-5 px-1.5 bg-white border border-border text-[9px] font-bold flex items-center rounded-md text-[#1A1F71]">VISA</div>
            <div className="h-5 px-1.5 bg-white border border-border text-[9px] font-bold flex items-center rounded-md text-[#EB001B]">MC</div>
          </div>
        </div>
      </div>

      {/* Guarantee - Flat & Clean */}
      <div className="flex items-start gap-2.5 py-1">
        <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" weight="fill" />
        <p className="text-xs leading-relaxed">
          <span className="font-semibold text-foreground">{t.moneyBackGuarantee}</span>
          <span className="text-muted-foreground"> {t.getItemOrMoneyBack}</span>
          <Link href={`/${locale}/help/buyer-protection`} className="text-primary font-medium text-xs hover:underline ml-1">{t.learnMore}</Link>
        </p>
      </div>
    </div>
  )
}
