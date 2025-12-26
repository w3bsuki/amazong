"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
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
        "group relative block rounded-xl overflow-hidden",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "transition-all duration-300",
        variant === "default" && "aspect-4/3",
        variant === "wide" && "aspect-video col-span-2"
      )}
    >
      {/* Background Image */}
      <Image 
        src={bgImage} 
        alt={subtitle} 
        fill
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" 
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/35 to-transparent" />
      
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 rounded-md border border-border bg-background/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
          {badge}
        </span>
      )}
      
      {/* Deal Content */}
      <div className="absolute bottom-3 left-3 right-3 text-foreground">
        <p className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-muted-foreground">{dealText}</p>
        <p className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-none">
          {highlight}
        </p>
        <p className="mt-0.5 text-xs font-medium text-foreground/90 line-clamp-1">{subtitle}</p>
      </div>
      
      {/* Hover indicator - subtle border */}
      <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 rounded-xl transition-colors" />
    </Link>
  )
}
