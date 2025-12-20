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
    <div className={cn("px-3 md:px-4 py-1 md:py-3", className)}>
      <Link
        href="/sell"
        className={cn(
          "group flex items-center gap-3 p-2.5 md:p-4 rounded-xl",
          "bg-link", // Uses the brand blue color
          "ring-1 ring-link/20",
          "transition-all duration-200",
          "hover:brightness-110 hover:shadow-md hover:shadow-link/30",
          "active:scale-[0.98]"
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
    </div>
  )
}
