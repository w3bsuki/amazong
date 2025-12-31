"use client"

import { Truck, ShieldCheck, ArrowCounterClockwise, Lock } from "@phosphor-icons/react"

const TRUST_ITEMS_EN = [
  { icon: Truck, text: "Free Shipping €50+" },
  { icon: ShieldCheck, text: "Buyer Protection" },
  { icon: ArrowCounterClockwise, text: "30-Day Returns" },
  { icon: Lock, text: "Secure Payment" },
] as const

const TRUST_ITEMS_MOBILE_EN = [
  { icon: ShieldCheck, text: "Buyer Protection" },
  { icon: ArrowCounterClockwise, text: "30-Day Returns" },
  { icon: Lock, text: "Secure Payment" },
] as const

const TRUST_ITEMS_BG = [
  { icon: Truck, text: "Безплатна доставка €50+" },
  { icon: ShieldCheck, text: "Защита на купувача" },
  { icon: ArrowCounterClockwise, text: "30 дни връщане" },
  { icon: Lock, text: "Сигурно плащане" },
] as const

const TRUST_ITEMS_MOBILE_BG = [
  { icon: ShieldCheck, text: "Защита на купувача" },
  { icon: ArrowCounterClockwise, text: "30 дни връщане" },
  { icon: Lock, text: "Сигурно плащане" },
] as const

interface TrustBarProps {
  locale?: string
  className?: string
}

export function TrustBar({ locale = "en", className = "", variant = "auto" }: TrustBarProps & { variant?: "auto" | "mobile" | "desktop" }) {
  const items = locale === "bg" ? TRUST_ITEMS_BG : TRUST_ITEMS_EN
  const mobileItems = locale === "bg" ? TRUST_ITEMS_MOBILE_BG : TRUST_ITEMS_MOBILE_EN

  // Desktop layout
  if (variant === "desktop") {
    return (
      <div className={`w-full bg-muted/50 border-b border-border/50 ${className}`}>
        <div className="flex items-center justify-center gap-8 py-2 container">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5 text-muted-foreground">
              <item.icon size={16} weight="regular" className="shrink-0" />
              <span className="text-xs font-medium whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Mobile layout
  if (variant === "mobile") {
    return (
      <div className={`w-full bg-muted/50 border-b border-border/50 ${className}`}>
        <div className="flex items-center justify-between gap-3 px-(--page-inset) py-2">
          {mobileItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5 text-muted-foreground">
              <item.icon size={14} weight="regular" className="shrink-0" />
              <span className="text-2xs font-medium whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Auto (responsive) - default
  return (
    <div className={`w-full bg-muted/50 border-b border-border/50 ${className}`}>
      {/* Desktop: Centered flex row */}
      <div className="hidden md:flex items-center justify-center gap-8 py-2 container">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 text-muted-foreground">
            <item.icon size={16} weight="regular" className="shrink-0" />
            <span className="text-xs font-medium whitespace-nowrap">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Mobile: 3 items, no scroll */}
      <div className="md:hidden flex items-center justify-between gap-3 px-(--page-inset) py-2">
        {mobileItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 text-muted-foreground">
            <item.icon size={14} weight="regular" className="shrink-0" />
            <span className="text-2xs font-medium whitespace-nowrap">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
