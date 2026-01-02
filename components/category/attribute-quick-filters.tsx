"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useRouter, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import type { CategoryAttribute } from "@/lib/data/categories"

interface AttributeQuickFiltersProps {
  attributes: CategoryAttribute[]
  locale: string
}

export function AttributeQuickFilters({ attributes, locale }: AttributeQuickFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Find "Size" attribute (prioritize exact match, then contains)
  const sizeAttribute = React.useMemo(() => {
    return attributes.find(attr => {
      const name = attr.name.toLowerCase()
      return name === 'size' || name === 'размер'
    })
  }, [attributes])

  // Find "Brand" attribute if Size is not available, or as secondary
  // For now, let's just focus on Size as requested by user ("Size S, etc")
  // If no size, maybe we can show Brand or Color?
  // Let's stick to Size for the "circles" UI the user asked for.
  
  const targetAttribute = sizeAttribute

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  React.useEffect(() => {
    checkScroll()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)
      return () => {
        scrollElement.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }

    return
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  if (!targetAttribute) return null

  const options = locale === 'bg' && targetAttribute.options_bg 
    ? targetAttribute.options_bg 
    : targetAttribute.options

  if (!options || options.length === 0) return null

  const paramKey = `attr_${targetAttribute.name}`
  const currentValues = searchParams.getAll(paramKey)

  const toggleValue = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(paramKey)
    
    if (current.includes(value)) {
      params.delete(paramKey)
      current.filter(v => v !== value).forEach(v => params.append(paramKey, v))
    } else {
      params.append(paramKey, value)
    }
    
    // Reset page when filtering
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const attrName = locale === 'bg' && targetAttribute.name_bg ? targetAttribute.name_bg : targetAttribute.name

  return (
    <div className="mb-3">
      <div className="mb-2">
        <span className="text-xs font-semibold text-muted-foreground">{attrName}</span>
      </div>

      <div className="relative group/container">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-2 py-0.5 pb-1 scroll-pl-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {options.map((option) => {
            const isSelected = currentValues.includes(option)
            return (
              <button
                key={option}
                onClick={() => toggleValue(option)}
                className={cn(
                  "flex items-center justify-center shrink-0 snap-start",
                  "h-8 px-3 rounded-full border transition-colors touch-action-manipulation",
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm" 
                    : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <span className="text-xs font-medium">{option}</span>
              </button>
            )
          })}
        </div>

        {/* Left Arrow - Desktop only */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10",
            "size-8 bg-background/90 hover:bg-background rounded-full border border-border shadow-sm",
            "flex items-center justify-center transition-opacity",
            "hidden md:flex",
            !canScrollLeft && "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <CaretLeft size={16} weight="bold" />
        </button>

        {/* Right Arrow - Desktop only */}
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10",
            "size-8 bg-background/90 hover:bg-background rounded-full border border-border shadow-sm",
            "flex items-center justify-center transition-opacity",
            "hidden md:flex",
            !canScrollRight && "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    </div>
  )
}
