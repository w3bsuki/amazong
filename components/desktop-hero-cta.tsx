"use client"

import { Link } from "@/i18n/routing"
import { Storefront, ShoppingBag, ArrowRight, Users } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface DesktopHeroCTAProps {
  locale?: string
}

/**
 * Desktop Hero CTA Banner - Compact version
 * Clean, focused banner with main message + CTAs
 * Follows best practices: proper a11y, keyboard navigation, semantic HTML
 */
export function DesktopHeroCTA({ locale = "en" }: DesktopHeroCTAProps) {
  const isBg = locale === "bg"

  return (
    <section 
      className="w-full"
      aria-label={isBg ? "Добре дошли в AMZN" : "Welcome to AMZN"}
    >
      {/* Compact CTA Banner - Clean trust-blue solid color */}
      <div className="relative overflow-hidden rounded-xl bg-cta-trust-blue">

        <div className="relative px-6 py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge - social proof */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-3">
                <Users weight="fill" className="size-4" aria-hidden="true" />
                <span>{isBg ? "Присъедини се към 10,000+ потребители" : "Join 10,000+ users"}</span>
              </div>

              {/* Headline */}
              <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight mb-2">
                {isBg 
                  ? "Твоят нов онлайн пазар в България" 
                  : "Your New Marketplace in Bulgaria"}
              </h1>

              {/* Subtitle - lighter weight for visual hierarchy */}
              <p className="text-sm lg:text-base text-white/90 font-normal">
                {isBg 
                  ? "Купувай и продавай лесно. Безплатно публикуване, без комисиони за продавачи." 
                  : "Buy and sell easily. Free listings, no seller fees."}
              </p>
            </div>

            {/* Right - CTAs with proper focus states */}
            <nav className="flex flex-wrap items-center justify-center lg:justify-end gap-3 shrink-0" aria-label={isBg ? "Основни действия" : "Main actions"}>
              <Link
                href="/sell"
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-md",
                  "bg-white text-cta-trust-blue font-semibold text-sm",
                  "hover:bg-white/95 transition-all duration-200 ease-out",
                  "shadow-sm hover:shadow-md",
                  "active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cta-trust-blue"
                )}
              >
                <Storefront weight="fill" className="size-4" aria-hidden="true" />
                {isBg ? "Започни да продаваш" : "Start Selling"}
                <ArrowRight weight="bold" className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/search"
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-md",
                  "bg-white/15 text-white font-semibold text-sm border border-white/25",
                  "hover:bg-white/25 transition-all duration-200 ease-out",
                  "active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cta-trust-blue"
                )}
              >
                <ShoppingBag weight="fill" className="size-4" aria-hidden="true" />
                {isBg ? "Разгледай обяви" : "Browse Listings"}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}
