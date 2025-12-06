/**
 * MegaMenuBanner Component
 * 
 * Banner CTA section for the mega menu dropdown.
 * Displays promotional content with image, title, subtitle, and call-to-action.
 */

"use client"

import { Link } from "@/i18n/routing"
import { ArrowRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { MegaMenuBanner as MegaMenuBannerType } from "@/config/mega-menu-config"

interface MegaMenuBannerProps {
  banner: MegaMenuBannerType
  locale: string
  columns?: 2 | 3
  onNavigate?: () => void
}

export function MegaMenuBanner({ 
  banner, 
  locale, 
  columns = 2,
  onNavigate 
}: MegaMenuBannerProps) {
  return (
    <Link
      href={banner.href}
      onClick={onNavigate}
      className={cn(
        "relative rounded-xl overflow-hidden group",
        columns === 3 ? "w-2/5" : "w-1/2"
      )}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${banner.image})` }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">
          {locale === "bg" ? banner.titleBg : banner.title}
        </h3>
        <p className="text-white/80 text-sm mb-4 max-w-xs">
          {locale === "bg" ? banner.subtitleBg : banner.subtitle}
        </p>
        <div className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium w-fit group-hover:bg-brand/90 transition-colors">
          {locale === "bg" ? banner.ctaBg : banner.cta}
          <ArrowRight size={16} weight="bold" />
        </div>
      </div>
    </Link>
  )
}
