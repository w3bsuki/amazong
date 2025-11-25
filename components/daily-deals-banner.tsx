"use client"

import { Link } from "@/i18n/routing"
import { Timer, ArrowRight } from "lucide-react"

interface DailyDealsBannerProps {
  locale?: string
}

export function DailyDealsBanner({ locale = "en" }: DailyDealsBannerProps) {
  const content = {
    bg: {
      title: "🔥 Дневни оферти",
      cta: "Виж всички оферти",
      badge: "До -70%",
      timer: "Остават само"
    },
    en: {
      title: "🔥 Daily Deals",
      cta: "See all deals",
      badge: "Up to 70% off",
      timer: "Time left"
    }
  }

  const t = locale === "bg" ? content.bg : content.en

  // Simulate countdown (in real app, use actual countdown logic)
  const hours = 14
  const minutes = 32
  const seconds = 45

  return (
    <div className="relative w-full overflow-hidden rounded bg-red-600">
      <div className="relative px-3 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left side - Title and badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white">
            {t.title}
          </h2>
          
          {/* Discount badge */}
          <div className="hidden sm:flex items-center justify-center bg-yellow-400 text-red-600 font-bold text-lg px-4 py-2 rounded-full shadow">
            {t.badge}
          </div>
        </div>

        {/* Center - Timer */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2">
          <Timer className="size-4 sm:size-5 text-white" />
          <span className="text-white/80 text-xs sm:text-sm mr-1 sm:mr-2">{t.timer}:</span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <TimeBlock value={hours} />
            <span className="text-white text-base sm:text-xl font-bold">:</span>
            <TimeBlock value={minutes} />
            <span className="text-white text-base sm:text-xl font-bold">:</span>
            <TimeBlock value={seconds} />
          </div>
        </div>

        {/* Right side - CTA */}
        <Link
          href="/todays-deals"
          className="flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-yellow-50 text-red-600 font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow border-2 border-transparent hover:border-red-600 text-sm sm:text-base transition-colors"
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
    <span className="bg-white/30 text-white text-sm sm:text-lg md:text-xl font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded min-w-7 sm:min-w-10 text-center">
      {value.toString().padStart(2, "0")}
    </span>
  )
}
