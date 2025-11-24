"use client"

import { Link } from "@/i18n/routing"
import { Timer, Zap, ArrowRight } from "lucide-react"

interface DailyDealsBannerProps {
  locale?: string
}

export function DailyDealsBanner({ locale = "en" }: DailyDealsBannerProps) {
  const content = {
    bg: {
      title: "🔥 Дневни оферти",
      subtitle: "Невероятни намаления всеки ден",
      cta: "Виж всички оферти",
      badge: "До -70%",
      timer: "Остават само"
    },
    en: {
      title: "🔥 Daily Deals",
      subtitle: "Amazing discounts every day",
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
    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg">
      <div className="relative px-4 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left side - Title and badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-yellow-300" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {t.title}
              </h2>
              <p className="text-white/80 text-sm">{t.subtitle}</p>
            </div>
          </div>
          
          {/* Discount badge */}
          <div className="hidden sm:flex items-center justify-center bg-yellow-400 text-red-600 font-bold text-lg px-4 py-2 rounded-full shadow">
            {t.badge}
          </div>
        </div>

        {/* Center - Timer */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <Timer className="h-5 w-5 text-white" />
          <span className="text-white/80 text-sm mr-2">{t.timer}:</span>
          <div className="flex items-center gap-1">
            <TimeBlock value={hours} label={locale === "bg" ? "ч" : "h"} />
            <span className="text-white text-xl font-bold">:</span>
            <TimeBlock value={minutes} label={locale === "bg" ? "м" : "m"} />
            <span className="text-white text-xl font-bold">:</span>
            <TimeBlock value={seconds} label={locale === "bg" ? "с" : "s"} />
          </div>
        </div>

        {/* Right side - CTA */}
        <Link
          href="/todays-deals"
          className="flex items-center gap-2 bg-white hover:bg-yellow-50 text-red-600 font-bold px-6 py-3 rounded-full shadow border-2 border-transparent hover:border-red-600"
        >
          {t.cta}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-white/30 text-white text-lg md:text-xl font-bold px-2 py-1 rounded min-w-[40px] text-center">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-white/70 text-[10px] uppercase">{label}</span>
    </div>
  )
}
