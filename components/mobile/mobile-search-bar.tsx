"use client"

import * as React from "react"
import { MagnifyingGlass, Camera } from "@phosphor-icons/react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"

interface MobileSearchBarProps {
  className?: string
}

/**
 * Mobile Sticky Search Bar
 * 
 * A compact, always-visible search bar for mobile that appears below the header.
 * Tapping it opens the full search overlay for a complete search experience.
 * 
 * Inspired by Target's excellent mobile search UX.
 */
export function MobileSearchBar({ className }: MobileSearchBarProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const locale = useLocale()
  
  const placeholder = locale === "bg" 
    ? "Търсене..." 
    : "Search essentials..."

  const handleClick = () => {
    setIsSearchOpen(true)
  }

  return (
    <>
      <div 
        className={cn(
          "sticky top-[44px] z-40 bg-background px-3 py-1.5 md:hidden",
          className
        )}
      >
        <button
          onClick={handleClick}
          className={cn(
            "w-full flex items-center gap-2 h-10 px-3.5 rounded-lg",
            "bg-muted/50",
            "text-muted-foreground/70 text-2xs text-left",
            "active:bg-muted/80",
            "transition-colors duration-200",
            "touch-action-manipulation tap-transparent"
          )}
          aria-label={placeholder}
          aria-haspopup="dialog"
          aria-expanded={isSearchOpen}
        >
          <MagnifyingGlass size={16} weight="regular" className="text-muted-foreground/60 shrink-0" />
          <span className="flex-1 truncate">{placeholder}</span>
          <div className="flex items-center gap-1 shrink-0">
            <Camera size={16} weight="regular" className="text-muted-foreground/40 ml-1" />
          </div>
        </button>
      </div>
      
      {/* Search Overlay - controlled by this component */}
      <MobileSearchOverlay 
        hideDefaultTrigger 
        externalOpen={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
      />
    </>
  )
}
