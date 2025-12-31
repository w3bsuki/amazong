"use client"

import { Link } from "@/i18n/routing"
import { Storefront, ArrowRight, ShieldCheck, ArrowCounterClockwise, Lock } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface StartSellingBannerProps {
  locale?: string
  className?: string
  /** Full-bleed variant for hero placement above filters */
  variant?: "default" | "full-bleed"
  /** When using full-bleed, optionally render trust items inside the banner */
  showTrustRow?: boolean
}

export function StartSellingBanner({ 
  locale = "en", 
  className,
  variant = "default",
  showTrustRow = false
}: StartSellingBannerProps) {
  const isBg = locale === "bg"

  const trustItems = isBg
    ? [
        { icon: ShieldCheck, text: "Защита на купувача" },
        { icon: ArrowCounterClockwise, text: "30 дни връщане" },
        { icon: Lock, text: "Сигурно плащане" },
      ]
    : [
        { icon: ShieldCheck, text: "Buyer Protection" },
        { icon: ArrowCounterClockwise, text: "30-Day Returns" },
        { icon: Lock, text: "Secure Payment" },
      ]
  
  // Full-bleed: edge-to-edge professional banner (like eBay/OLX seller CTAs)
  if (variant === "full-bleed") {
    return (
      <div className={cn("w-full", className)}>
        {/* Main CTA Banner */}
        <Link
          href="/sell"
          className={cn(
            "block w-full",
            "bg-gradient-to-r from-brand via-brand to-brand-dark",
            "text-white",
            "px-(--page-inset) py-3",
            "hover:from-brand-dark hover:to-brand-dark",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            "transition-all duration-150"
          )}
        >
          <div className="flex items-center justify-between w-full gap-3">
            {/* Left: Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">
                {isBg ? "Регистрирай се, за да продаваш" : "Sign up to start selling"}
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                {isBg
                  ? "Създай обява за минути. Достигни купувачи."
                  : "List in minutes. Reach buyers faster."}
              </p>
            </div>

            {/* Right: Arrow pill */}
            <span
              className="size-8 shrink-0 rounded-full bg-white/20 flex items-center justify-center"
              aria-hidden="true"
            >
              <ArrowRight size={16} weight="bold" />
            </span>
          </div>
        </Link>

        {/* Trust Row - separate strip below */}
        {showTrustRow && (
          <div className="w-full bg-secondary/80 border-b border-border/50 px-(--page-inset) py-2">
            <div className="flex items-center justify-between gap-2">
              {trustItems.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 text-muted-foreground">
                  <item.icon size={14} weight="duotone" className="shrink-0 text-brand/70" />
                  <span className="text-2xs font-medium whitespace-nowrap">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // Default: compact inline variant for use within filter areas
  return (
    <Link
      href="/sell"
      className={cn(
        "flex items-center justify-between w-full gap-3",
        "border border-brand/30 bg-brand/5 text-foreground",
        "px-3 py-2.5 rounded-md",
        "hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors duration-100",
        className
      )}
    >
      {/* Left Icon Block */}
      <span 
        className="size-9 shrink-0 rounded-md border border-brand/20 bg-brand/10 text-brand flex items-center justify-center" 
        aria-hidden="true"
      >
        <Storefront size={16} weight="fill" />
      </span>

      {/* Content */}
      <span className="flex-1 min-w-0 text-left space-y-0.5">
        <span className="block text-sm font-semibold leading-tight">
          {isBg ? "Регистрирай се, за да продаваш" : "Sign up to start selling"}
        </span>
        <span className="block text-xs text-muted-foreground font-medium truncate">
          {isBg
            ? "Създай обява за минути. Достигни купувачи."
            : "List in minutes. Reach buyers faster."}
        </span>
      </span>

      {/* Right Arrow */}
      <span 
        className="size-8 shrink-0 rounded-md border border-brand/20 bg-brand/10 text-brand flex items-center justify-center" 
        aria-hidden="true"
      >
        <ArrowRight size={14} weight="bold" />
      </span>
    </Link>
  )
}
