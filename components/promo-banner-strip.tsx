"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

interface PromoBanner {
  id: string
  text: string
  highlight?: string
  link: string
}

interface PromoBannerStripProps {
  locale?: string
}

/**
 * Simple Promotional Banner Strip - Clean, no gradients
 * Auto-advances every 4 seconds
 */
export function PromoBannerStrip({ locale = "en" }: PromoBannerStripProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const banners: PromoBanner[] = [
    {
      id: "1",
      text: locale === "bg" ? "Безплатна доставка над" : "Free shipping over",
      highlight: "$35",
      link: "/customer-service",
    },
    {
      id: "2",
      text: locale === "bg" ? "Черен петък – до" : "Black Friday – up to",
      highlight: "50% off",
      link: "/todays-deals",
    },
    {
      id: "3",
      text: locale === "bg" ? "Нови продукти всеки ден" : "New arrivals daily",
      highlight: "",
      link: "/search?sort=newest",
    },
    {
      id: "4",
      text: locale === "bg" ? "Техника – спести до" : "Tech deals – save up to",
      highlight: "$200",
      link: "/search?category=electronics",
    },
  ]

  // Auto-advance banners
  React.useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [banners.length])

  const currentBanner = banners[currentIndex]

  return (
    <div className="w-full px-3 pt-2">
      <Link
        href={currentBanner.link}
        className={cn(
          "flex items-center justify-center gap-1.5 w-full",
          "py-2.5 px-4",
          "text-white text-sm font-medium",
          "rounded-lg",
          "bg-cta-trust-blue hover:bg-cta-trust-blue-hover",
          "transition-colors duration-200"
        )}
      >
        <span>{currentBanner.text}</span>
        {currentBanner.highlight && (
          <span className="font-bold">{currentBanner.highlight}</span>
        )}
        <span className="ml-1">→</span>
      </Link>
      
      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 py-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              idx === currentIndex ? "bg-foreground" : "bg-border"
            )}
            aria-label={`Go to banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
