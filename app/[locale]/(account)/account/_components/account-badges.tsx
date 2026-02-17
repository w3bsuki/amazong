"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CircleCheck as CheckCircle, Crown, Medal, Star, Trophy } from "lucide-react";

import { useBadges } from "@/hooks/use-badges"
import { toast } from "sonner"

interface AccountBadgesProps {
  locale?: "en" | "bg"
}

export function AccountBadges({ locale = "en" }: AccountBadgesProps) {
  const { badges, isLoading, error, toggleFeatured } = useBadges()
  const [updating, setUpdating] = useState<string | null>(null)
  
  const t = {
    title: locale === "bg" ? "Моите значки" : "My Badges",
    noBadges: locale === "bg" ? "Все още нямате значки" : "You don't have any badges yet",
    featured: locale === "bg" ? "Показана" : "Featured",
    feature: locale === "bg" ? "Покажи" : "Feature",
    unfeature: locale === "bg" ? "Скрий" : "Hide",
    maxFeatured: locale === "bg" ? "Максимум 5 показани значки" : "Maximum 5 featured badges",
    earnedOn: locale === "bg" ? "Получена на" : "Earned on",
    verification: locale === "bg" ? "Верификация" : "Verification",
    milestone: locale === "bg" ? "Постижение" : "Milestone",
    sales: locale === "bg" ? "Продажби" : "Sales",
    rating: locale === "bg" ? "Рейтинг" : "Rating",
    special: locale === "bg" ? "Специална" : "Special",
  }
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "verification":
        return <CheckCircle className="size-4" />
      case "seller_milestone_personal":
      case "seller_milestone_business":
      case "buyer_milestone":
        return <Medal className="size-4" />
      case "seller_sales":
        return <Trophy className="size-4" />
      case "seller_rating":
      case "buyer_rating":
        return <Star className="size-4" />
      default:
        return <Crown className="size-4" />
    }
  }
  
  const getCategoryLabel = (category: string) => {
    if (category.includes("verification")) return t.verification
    if (category.includes("milestone")) return t.milestone
    if (category.includes("sales")) return t.sales
    if (category.includes("rating")) return t.rating
    return t.special
  }
  
  const handleToggleFeatured = async (badgeId: string) => {
    setUpdating(badgeId)
    try {
      const newState = await toggleFeatured(badgeId)
      toast.success(newState ? t.feature : t.unfeature)
    } catch (err) {
      const message = err instanceof Error ? err.message : ""
      if (message.includes("Maximum")) {
        toast.error(t.maxFeatured)
      } else {
        toast.error("Failed to update badge")
      }
    } finally {
      setUpdating(null)
    }
  }
  
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr))
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i}
                className="size-12 rounded-full bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return null // Silently fail for non-authenticated users
  }
  
  if (badges.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t.noBadges}</p>
        </CardContent>
      </Card>
    )
  }
  
  // Group badges by category
  const groupedBadges = badges.reduce((acc, badge) => {
    const category = badge.category || "other"
    if (!acc[category]) acc[category] = []
    acc[category].push(badge)
    return acc
  }, {} as Record<string, typeof badges>)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t.title}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {badges.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured badges */}
        {badges.some(b => b.is_featured) && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t.featured}
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.filter(b => b.is_featured).map(badge => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(badge.id)}
                        disabled={updating === badge.id}
                        aria-pressed={badge.is_featured}
                        aria-label={badge.is_featured ? `${t.unfeature}: ${badge.name}` : `${t.feature}: ${badge.name}`}
                        className={cn(
                          "relative flex min-h-11 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          badge.color || "bg-primary text-primary-foreground",
                          updating === badge.id && "opacity-50"
                        )}
                      >
                        <span className="text-base">{badge.icon}</span>
                        <span>{badge.name}</span>
                        {badge.is_featured && (
                          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-rating flex items-center justify-center">
                            <Star className="size-2.5 text-foreground" />
                          </span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.earnedOn}: {formatDate(badge.earned_at)}
                      </p>
                      <p className="text-xs text-rating mt-1">
                        {t.unfeature}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}
        
        {/* All badges by category */}
        {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {getCategoryIcon(category)}
              <span>{getCategoryLabel(category)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryBadges.map(badge => (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(badge.id)}
                        disabled={updating === badge.id}
                        aria-pressed={badge.is_featured}
                        aria-label={badge.is_featured ? `${t.unfeature}: ${badge.name}` : `${t.feature}: ${badge.name}`}
                        className={cn(
                          "relative flex size-11 items-center justify-center rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          badge.color || "bg-muted",
                          updating === badge.id && "opacity-50",
                          !badge.is_featured && "opacity-70 hover:opacity-100"
                        )}
                      >
                        <span className="text-lg">{badge.icon}</span>
                        {badge.is_featured && (
                          <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-rating flex items-center justify-center">
                            <Star className="size-2 text-foreground" />
                          </span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.earnedOn}: {formatDate(badge.earned_at)}
                      </p>
                      <p className="text-xs mt-1">
                        {badge.is_featured ? t.unfeature : t.feature}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
