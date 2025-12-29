"use client"

import type { ReactNode } from "react"
import { Link } from "@/i18n/routing"
import { Storefront, ShoppingBag, ArrowRight, Users } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DesktopHeroCTAProps {
  locale?: string
  bottomSlot?: ReactNode
}

/**
 * Desktop Hero CTA Banner - Compact version
 * Clean, focused banner with main message + CTAs
 * Follows best practices: proper a11y, keyboard navigation, semantic HTML
 */
export function DesktopHeroCTA({ locale = "en", bottomSlot }: DesktopHeroCTAProps) {
  const isBg = locale === "bg"

  return (
    <section 
      className="w-full"
      aria-label={isBg ? "Добре дошли в Treido" : "Welcome to Treido"}
    >
      {/* Compact CTA Banner - Clean trust-blue solid color */}
      <div className="relative overflow-hidden rounded-xl bg-cta-trust-blue">

        <div className="relative px-6 py-5 lg:px-8 lg:py-7">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge - social proof */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-cta-trust-blue-text/12 px-3 py-1 text-tiny font-medium text-cta-trust-blue-text/95 mb-3">
                <Users weight="fill" className="size-3.5" aria-hidden="true" />
                <span>{isBg ? "10,000+ потребители" : "10,000+ users"}</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl lg:text-4xl font-bold text-cta-trust-blue-text tracking-tight mb-2 text-balance">
                {isBg 
                  ? "Твоят нов онлайн пазар в България" 
                  : "Your New Marketplace in Bulgaria"}
              </h1>

              {/* Subtitle - lighter weight for visual hierarchy */}
              <p className="text-sm lg:text-base text-cta-trust-blue-text/90 font-normal max-w-[54ch] mx-auto lg:mx-0 text-pretty">
                {isBg 
                  ? "Купувай и продавай лесно. Безплатно публикуване, без такси." 
                  : "Buy and sell easily. Free listings, no fees."}
              </p>
            </div>

            {/* Right - CTAs with proper focus states */}
            <nav className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 shrink-0" aria-label={isBg ? "Основни действия" : "Main actions"}>
              <Button
                asChild
                size="lg"
                className={cn(
                  "bg-cta-secondary text-cta-secondary-text hover:bg-cta-secondary-hover",
                  "shadow-xs"
                )}
              >
                <Link href="/sell">
                  <Storefront weight="fill" className="size-4" aria-hidden="true" />
                  {isBg ? "Започни да продаваш" : "Start Selling"}
                  <ArrowRight weight="bold" className="size-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className={cn(
                  "border-cta-trust-blue-text/25 bg-cta-trust-blue-text/10 text-cta-trust-blue-text hover:bg-cta-trust-blue-text/15 hover:text-cta-trust-blue-text",
                  "shadow-none"
                )}
              >
                <Link href="/search">
                  <ShoppingBag weight="fill" className="size-4" aria-hidden="true" />
                  {isBg ? "Разгледай обяви" : "Browse Listings"}
                </Link>
              </Button>
            </nav>
          </div>

        </div>
      </div>

      {/* Optional bottom slot (e.g., categories) - outside the blue hero, like the reference */}
      {typeof bottomSlot !== "undefined" && bottomSlot !== null ? (
        <div className="mt-4 rounded-xl border border-border bg-card px-4 py-3 shadow-xs">
          {bottomSlot}
        </div>
      ) : null}
    </section>
  )
}
