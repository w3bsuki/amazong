"use client"

import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Lock, ShieldCheck, CreditCard, SpinnerGap } from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface DesktopOrderSummaryProps {
  subtotal: number
  shippingCost: number
  tax: number
  buyerProtectionFee: number
  total: number
  formatPrice: (price: number) => string
  isProcessing: boolean
  isFormValid: () => boolean
  onCheckout: () => void
}

export function DesktopOrderSummary({
  subtotal,
  shippingCost,
  tax,
  buyerProtectionFee,
  total,
  formatPrice,
  isProcessing,
  isFormValid,
  onCheckout,
}: DesktopOrderSummaryProps) {
  const t = useTranslations("CheckoutPage")
  return (
    <Card className="sticky top-24">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">{t("orderSummary") || "Order Summary"}</CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">
        {/* Price breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("shipping")}</span>
            <span className={cn("font-medium", shippingCost === 0 && "text-success")}>
              {shippingCost === 0 ? t("free") : formatPrice(shippingCost)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("tax", { percent: 10 })}</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success" weight="fill" />
              {t("buyerProtection")}
            </span>
            <span className="font-medium">{formatPrice(buyerProtectionFee)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-baseline">
          <span className="text-base font-semibold">{t("total")}</span>
          <span className="text-2xl font-bold">{formatPrice(total)}</span>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onCheckout} 
          disabled={isProcessing || !isFormValid()} 
          size="lg"
          className="w-full h-12 font-semibold text-base"
        >
          {isProcessing ? (
            <>
              <SpinnerGap className="size-5 animate-spin mr-2" />
              {t("processing")}
            </>
          ) : (
            <>
              <Lock className="size-4 mr-2" weight="fill" />
              {t("proceedToPayment")}
            </>
          )}
        </Button>

        {/* Trust indicators */}
        <div className="space-y-4 pt-2">
          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-success" weight="fill" />
              <span>{t("secureCheckout")}</span>
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success" weight="fill" />
              <span>{t("buyerProtection")}</span>
            </div>
          </div>

          {/* Payment method logos */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30">
              <CreditCard className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">
                {t("securePayment") || "Secure Payment"}
              </span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="flex items-center justify-center gap-2 opacity-60">
            <Image src="/icons/visa.svg" alt="Visa" width={32} height={20} className="h-5 w-auto" />
            <Image src="/icons/mastercard.svg" alt="Mastercard" width={32} height={20} className="h-5 w-auto" />
            <Image src="/icons/amex.svg" alt="American Express" width={32} height={20} className="h-5 w-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
