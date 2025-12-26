"use client"

import { Link } from "@/i18n/routing"
import { Storefront, ArrowRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StartSellingBannerProps {
  locale?: string
  className?: string
}

export function StartSellingBanner({ locale = "en", className }: StartSellingBannerProps) {
  const isBg = locale === "bg"
  
  return (
    <div className={cn("px-3 py-0.5", className)}>
      <Button
        asChild
        variant="default"
        className={cn(
          "w-full justify-start gap-2 rounded-xl p-2 h-auto",
          "bg-cta-trust-blue text-cta-trust-blue-text hover:bg-cta-trust-blue-hover",
          "shadow-xs",
          "group"
        )}
      >
        <Link href="/sell" className="relative overflow-hidden flex items-center gap-2">
          {/* Left Icon Circle */}
          <span className="size-8 shrink-0 rounded-full bg-white/20 flex items-center justify-center shadow-inner" aria-hidden="true">
            <Storefront size={16} weight="fill" className="text-white" />
          </span>

          {/* Content */}
          <span className="flex-1 min-w-0 text-left">
            <span className="block text-sm font-semibold leading-tight">
              {isBg ? "Започни да продаваш" : "Start selling"}
            </span>
            <span className="block text-xs text-white/90 mt-0.5 font-medium truncate">
              {isBg
                ? "Безплатно • Милиони клиенти • Бърза продажба"
                : "Free • Millions of customers • Fast sales"}
            </span>
          </span>

          {/* Right Arrow Circle */}
          <span className="size-7 shrink-0 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <ArrowRight size={14} weight="bold" className="text-white" />
          </span>
        </Link>
      </Button>
    </div>
  )
}
