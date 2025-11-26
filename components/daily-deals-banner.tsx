"use client"

import { Link } from "@/i18n/routing"
import { ArrowRight } from "lucide-react"

interface DailyDealsBannerProps {
  locale?: string
}

export function DailyDealsBanner({ locale = "en" }: DailyDealsBannerProps) {
  const content = {
    bg: {
      title: "Дневни оферти",
      cta: "Виж всички",
      badge: "До -70%"
    },
    en: {
      title: "Daily Deals",
      cta: "See all",
      badge: "Up to 70% off"
    }
  }

  const t = locale === "bg" ? content.bg : content.en

  // Simulate countdown (in real app, use actual countdown logic)
  const hours = 14
  const minutes = 32
  const seconds = 45

  return (
    <div className="relative w-full overflow-hidden rounded-md bg-red-600">
      <div className="relative px-3 py-2.5 sm:px-6 sm:py-4 md:px-8 md:py-5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side - Title with timer inline on mobile */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Discount badge - desktop only, before title */}
          <div className="hidden md:flex items-center justify-center bg-brand-warning text-brand-deal font-bold text-lg px-4 py-2 rounded-full">
            {t.badge}
          </div>
          
          <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-white whitespace-nowrap">
            {t.title}
          </h2>
          
          {/* Timer - inline with title */}
          <div className="flex items-center gap-0.5 bg-white/20 rounded px-1.5 py-1 sm:px-3 sm:py-1.5">
            <TimeBlock value={hours} />
            <span className="text-white text-xs sm:text-lg font-bold">:</span>
            <TimeBlock value={minutes} />
            <span className="text-white text-xs sm:text-lg font-bold">:</span>
            <TimeBlock value={seconds} />
          </div>
        </div>

        {/* Right side - CTA */}
        <Link
          href="/todays-deals"
          className="flex items-center justify-center gap-1 sm:gap-2 bg-white hover:bg-secondary text-brand-deal font-bold min-h-11 px-4 sm:px-6 rounded-full border border-transparent hover:border-brand-deal text-xs sm:text-base transition-colors whitespace-nowrap touch-action-manipulation active:scale-95"
        >
          {t.cta}
          <ArrowRight className="size-4 sm:size-5" />
        </Link>
      </div>
    </div>
  )
}

function TimeBlock({ value }: { value: number }) {
  return (
    <span className="bg-white/30 text-white text-[10px] sm:text-lg font-bold px-1 sm:px-2 py-0.5 rounded min-w-5 sm:min-w-10 text-center">
      {value.toString().padStart(2, "0")}
    </span>
  )
}
