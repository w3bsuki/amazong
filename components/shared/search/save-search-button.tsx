"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Bell, BellRinging, Check } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface SaveSearchButtonProps {
  query?: string | undefined
  category?: string | undefined
  className?: string
}

/**
 * SaveSearchButton - Allows users to save the current search for later
 * Saves to localStorage for MVP, will be enhanced with backend notifications
 */
export function SaveSearchButton({ query, category, className }: SaveSearchButtonProps) {
  const t = useTranslations("SaveSearch")
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isSaved, setIsSaved] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Build search key from current params (exclude pagination/sort).
  const searchKey = useMemo(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category) params.set("category", category)

    // Include other filters
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")
    const deals = searchParams.get("deals")
    const verified = searchParams.get("verified")

    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (minRating) params.set("minRating", minRating)
    if (deals) params.set("deals", deals)
    if (verified) params.set("verified", verified)

    return params.toString()
  }, [query, category, searchParams])

  // Check if already saved after mount (avoid setState during render).
  useEffect(() => {
    if (!searchKey) return

    try {
      const raw = localStorage.getItem("treido-saved-searches")
      const savedSearches = JSON.parse(raw || "[]") as Array<{ key: string }>
      setIsSaved(savedSearches.some((s) => s.key === searchKey))
    } catch {
      setIsSaved(false)
    }
  }, [searchKey])

  const handleSaveSearch = () => {
    const key = searchKey
    if (!key) {
      toast({
        title: t("emptySearchTitle"),
        description: t("emptySearchDescription"),
        variant: "destructive",
      })
      return
    }

    const savedSearches = JSON.parse(localStorage.getItem("treido-saved-searches") || "[]")
    const existingIndex = savedSearches.findIndex((s: { key: string }) => s.key === key)

    if (existingIndex >= 0) {
      // Remove from saved
      savedSearches.splice(existingIndex, 1)
      localStorage.setItem("treido-saved-searches", JSON.stringify(savedSearches))
      setIsSaved(false)
      toast({
        title: t("removedTitle"),
        description: t("removedDescription"),
      })
    } else {
      // Add to saved
      const newSearch = {
        key,
        query: query || null,
        category: category || null,
        filters: {
          minPrice: searchParams.get("minPrice"),
          maxPrice: searchParams.get("maxPrice"),
          minRating: searchParams.get("minRating"),
          deals: searchParams.get("deals"),
          verified: searchParams.get("verified"),
        },
        createdAt: new Date().toISOString(),
      }
      savedSearches.push(newSearch)
      localStorage.setItem("treido-saved-searches", JSON.stringify(savedSearches))
      setIsSaved(true)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
      toast({
        title: t("savedTitle"),
        description: t("savedDescription"),
      })
    }
  }

  // Don't show if no search criteria
  if (!query && !category) return null

  return (
    <Button
      variant={isSaved ? "secondary" : "outline"}
      size="sm"
      onClick={handleSaveSearch}
      className={cn(
        "gap-1.5 transition-all",
        isAnimating && "scale-105",
        className
      )}
    >
      {isSaved ? (
        <>
          <Check size={16} weight="bold" className="text-success" />
          <span className="hidden sm:inline">{t("saved")}</span>
        </>
      ) : (
        <>
          <Bell size={16} />
          <span className="hidden sm:inline">{t("saveSearch")}</span>
        </>
      )}
    </Button>
  )
}
