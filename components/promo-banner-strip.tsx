"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Storefront, ShoppingBag } from "@phosphor-icons/react"

interface PromoBannerStripProps {
  locale?: string
}

/**
 * Mobile CTA Cards - Launch-ready promotional section
 * Two prominent action cards for new marketplace launch
 */
export function PromoBannerStrip({ locale = "en" }: PromoBannerStripProps) {
  const ctaCards = [
    {
      id: "sell",
      title: locale === "bg" ? "Започни да продаваш" : "Start Selling",
      description: locale === "bg" ? "Листни първия си продукт безплатно" : "List your first product for free",
      link: "/sell",
      icon: Storefront,
      variant: "primary" as const,
    },
    {
      id: "shop",
      title: locale === "bg" ? "Открий продукти" : "Explore Products",
      description: locale === "bg" ? "Нови продукти всеки ден" : "New arrivals every day",
      link: "/search",
      icon: ShoppingBag,
      variant: "secondary" as const,
    },
  ]

  return (
    <div className="w-full px-3 pt-3 pb-2">
      {/* Two CTA Cards - Side by side */}
      <div className="grid grid-cols-2 gap-2.5">
        {ctaCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.id}
              href={card.link}
              className={cn(
                "group flex flex-col items-center text-center",
                "p-4 rounded-xl",
                "border transition-all duration-200",
                card.variant === "primary" 
                  ? "bg-brand text-white border-brand hover:bg-brand-dark"
                  : "bg-card text-foreground border-border hover:border-brand/30 hover:bg-accent/50"
              )}
            >
              <div className={cn(
                "size-10 rounded-full flex items-center justify-center mb-2.5",
                card.variant === "primary"
                  ? "bg-white/15"
                  : "bg-brand/10"
              )}>
                <Icon 
                  size={22} 
                  weight="duotone"
                  className={cn(
                    card.variant === "primary" 
                      ? "text-white" 
                      : "text-brand"
                  )} 
                />
              </div>
              <h3 className={cn(
                "text-sm font-semibold leading-tight",
                card.variant === "primary" ? "text-white" : "text-foreground"
              )}>
                {card.title}
              </h3>
              <p className={cn(
                "text-[11px] mt-1 leading-snug",
                card.variant === "primary" 
                  ? "text-white/80" 
                  : "text-muted-foreground"
              )}>
                {card.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
