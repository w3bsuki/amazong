"use client"

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { MagnifyingGlass, MapPin, CaretDown, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { BULGARIAN_CITIES, type BulgarianCity } from "@/lib/bulgarian-cities"
import { cn } from "@/lib/utils"

// Top cities for quick selection (by population)
const TOP_CITIES = BULGARIAN_CITIES.slice(0, 10)
const ALL_CITIES = BULGARIAN_CITIES.filter(c => c.value !== "other")

interface HeroSearchProps {
  className?: string
  /** Initial location from cookie/preference */
  initialLocation?: string | null
}

/**
 * HeroSearch - OLX/Bazar-style prominent search bar with location picker
 * 
 * Features:
 * - Full-width search input
 * - Location dropdown (Bulgarian cities)
 * - Category pre-filter (optional)
 * - Persists location preference in cookie
 */
export function HeroSearch({ className, initialLocation }: HeroSearchProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("HeroSearch")
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState<string>(initialLocation || "all")
  
  const isBg = locale === "bg"

  // Persist location preference in cookie
  const handleLocationChange = useCallback((value: string) => {
    setLocation(value)
    // Set cookie for 1 year
    document.cookie = `user-location=${value}; path=/; max-age=31536000; SameSite=Lax`
  }, [])

  // Read location from cookie on mount
  useEffect(() => {
    if (!initialLocation) {
      const match = document.cookie.match(/user-location=([^;]+)/)
      if (match?.[1]) {
        setLocation(match[1])
      }
    }
  }, [initialLocation])

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = query.trim()
    
    // Build search URL with query and location params
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (location && location !== "all") params.set("location", location)
    
    const searchPath = params.toString() ? `/search?${params.toString()}` : "/search"
    router.push(searchPath)
  }, [query, location, router])

  const handleClear = useCallback(() => {
    setQuery("")
    inputRef.current?.focus()
  }, [])

  const getCityLabel = (city: BulgarianCity) => {
    return isBg ? city.labelBg : city.label
  }

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSearch} className="w-full">
        {/* Search Container - OLX-style rounded bar */}
        <div className="flex items-stretch rounded-lg border border-border bg-background shadow-sm overflow-hidden">
          {/* Location Selector */}
          <div className="hidden sm:flex items-center border-r border-border bg-muted/30">
            <Select value={location} onValueChange={handleLocationChange}>
              <SelectTrigger 
                className="h-12 w-44 lg:w-52 border-0 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0 gap-2 px-4"
                aria-label={t("selectLocation")}
              >
                <MapPin size={18} weight="regular" className="text-muted-foreground shrink-0" />
                <SelectValue placeholder={t("allBulgaria")} />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {/* All Bulgaria option */}
                <SelectItem value="all" className="font-medium">
                  <span className="flex items-center gap-2">
                    {t("allBulgaria")}
                  </span>
                </SelectItem>
                
                {/* Separator */}
                <div className="my-1 h-px bg-border" />
                
                {/* Popular cities section */}
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("popularCities")}
                </div>
                {TOP_CITIES.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {getCityLabel(city)}
                  </SelectItem>
                ))}
                
                {/* All cities section */}
                <div className="my-1 h-px bg-border" />
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("allCities")}
                </div>
                {ALL_CITIES.slice(10).map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {getCityLabel(city)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="flex-1 relative flex items-center">
            <MagnifyingGlass 
              size={20} 
              weight="regular" 
              className="absolute left-4 text-muted-foreground pointer-events-none" 
            />
            <Input
              ref={inputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              name="q"
              placeholder={t("placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full border-0 bg-transparent pl-12 pr-10 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 p-1 text-muted-foreground hover:text-foreground rounded-full"
                aria-label={t("clear")}
              >
                <X size={16} weight="regular" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <Button 
            type="submit" 
            size="lg"
            className="h-12 px-6 lg:px-8 rounded-none font-semibold"
          >
            <MagnifyingGlass size={20} weight="bold" className="sm:mr-2" />
            <span className="hidden sm:inline">{t("search")}</span>
          </Button>
        </div>

        {/* Mobile Location Selector - Below search on small screens */}
        <div className="sm:hidden mt-2">
          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger 
              className="h-10 w-full bg-muted/30"
              aria-label={t("selectLocation")}
            >
              <MapPin size={16} weight="regular" className="text-muted-foreground shrink-0 mr-2" />
              <SelectValue placeholder={t("allBulgaria")} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all" className="font-medium">
                {t("allBulgaria")}
              </SelectItem>
              <div className="my-1 h-px bg-border" />
              {ALL_CITIES.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {getCityLabel(city)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  )
}
