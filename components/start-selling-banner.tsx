"use client"

import { Link } from "@/i18n/routing"
import { Storefront, ArrowRight, ShieldCheck, Wallet, TrendUp } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface StartSellingBannerProps {
  locale?: string
  className?: string
}

export function StartSellingBanner({ locale = "en", className }: StartSellingBannerProps) {
  const isBg = locale === "bg"
  
  return (
    <div className={cn("px-3 md:px-4 py-2 md:py-3", className)}>
      <Link
        href="/sell"
        className={cn(
          "group flex items-center gap-3 p-3 md:p-4 rounded-xl",
          "bg-link", // Uses the brand blue color
          "ring-1 ring-link/20",
          "transition-all duration-200",
          "hover:brightness-110 hover:shadow-md hover:shadow-link/30",
          "active:scale-[0.99]"
        )}
      >
        {/* Icon */}
        <div className="shrink-0 size-10 md:size-12 rounded-full bg-white/20 flex items-center justify-center">
          <Storefront className="size-5 md:size-6 text-white" weight="fill" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-semibold text-white leading-tight">
            {isBg ? "Започни да продаваш" : "Start Selling Today"}
          </h3>
          <p className="text-xs md:text-sm text-white/80 mt-0.5 line-clamp-1">
            {isBg ? "Безплатно • Милиони клиенти • Бърза настройка" : "Free to list • Millions of buyers • Easy setup"}
          </p>
        </div>
        
        {/* Arrow */}
        <div className="shrink-0 size-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRight className="size-4 text-white" weight="bold" />
        </div>
      </Link>
      
      {/* Trust badges - visible on all sizes, compact on small screens */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mt-2 md:mt-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <ShieldCheck className="size-3 sm:size-3.5 text-link" weight="fill" />
          <span className="text-[9px] sm:text-[10px]">{isBg ? "Сигурно" : "Secure"}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Wallet className="size-3 sm:size-3.5 text-link" weight="fill" />
          <span className="text-[9px] sm:text-[10px]">{isBg ? "0% комисион" : "0% fees"}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <TrendUp className="size-3 sm:size-3.5 text-link" weight="fill" />
          <span className="text-[9px] sm:text-[10px]">{isBg ? "Растящ пазар" : "Growing"}</span>
        </div>
      </div>
    </div>
  )
}
