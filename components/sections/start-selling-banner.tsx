"use client"

import { Link } from "@/i18n/routing"
import { Storefront, ArrowRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface StartSellingBannerProps {
  locale?: string
  className?: string
}

export function StartSellingBanner({ locale = "en", className }: StartSellingBannerProps) {
  const isBg = locale === "bg"
  
  return (
    <div className={cn("px-3 py-0.5", className)}>
      <Link
        href="/sell"
        className={cn(
          "relative overflow-hidden flex items-center gap-2 p-2 rounded-xl",
          "bg-cta-trust-blue text-cta-trust-blue-text shadow-sm",
          "transition-all duration-200 active:scale-[0.98]",
          "group"
        )}
      >
        {/* Left Icon Circle */}
        <div className="size-8 shrink-0 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
          <Storefront size={16} weight="fill" className="text-white" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold tracking-tight leading-tight">
            {isBg ? "Започни да продаваш" : "Start selling"}
          </h3>
          <p className="text-2xs text-white/90 mt-0.5 font-medium truncate">
            {isBg 
              ? "Безплатно • Милиони клиенти • Бърза продажба" 
              : "Free • Millions of customers • Fast sales"}
          </p>
        </div>
        
        {/* Right Arrow Circle */}
        <div className="size-6 shrink-0 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
          <ArrowRight size={12} weight="bold" className="text-white" />
        </div>
      </Link>
    </div>
  )
}
