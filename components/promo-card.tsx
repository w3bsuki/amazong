"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface PromoCardProps {
  bgImage: string
  dealText: string       // "Save up to" | "Up to" | "BOGO"
  highlight: string      // "$200" | "50% off" | "Free"
  subtitle: string       // "Apple devices*" | "select toys*"
  href: string
  badge?: string         // "Deal of the Day" | "Hot Deal"
  variant?: "default" | "wide"
}

export function PromoCard({ 
  bgImage, 
  dealText, 
  highlight, 
  subtitle, 
  href, 
  badge,
  variant = "default"
}: PromoCardProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "group relative block rounded-md overflow-hidden",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "transition-colors",
        variant === "default" && "aspect-4/3",
        variant === "wide" && "aspect-video col-span-2"
      )}
    >
      {/* Background Image with lazy loading */}
      <img 
        src={bgImage} 
        alt="" 
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover" 
      />
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
      
      {/* Badge */}
      {badge && (
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-brand-deal text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
          {badge}
        </span>
      )}
      
      {/* Deal Content */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
        <p className="text-xs sm:text-sm font-medium opacity-90">{dealText}</p>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-none mt-0.5">
          {highlight}
        </p>
        <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 opacity-80 line-clamp-1">{subtitle}</p>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-md transition-colors" />
    </Link>
  )
}
