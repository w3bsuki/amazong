/**
 * Badge Progress Component
 * Shows progress towards earning the next badge
 */

"use client"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BadgeProgress as BadgeProgressType, DisplayBadge } from "@/lib/types/badges"
import { BADGE_COLORS } from "@/lib/badges"

interface BadgeProgressProps {
  progress: BadgeProgressType
  locale?: "en" | "bg"
  className?: string
}

const labels = {
  en: {
    nextBadge: "Next Badge",
    progress: "Progress",
    keepGoing: "Keep going!",
  },
  bg: {
    nextBadge: "Следващ Значка",
    progress: "Прогрес",
    keepGoing: "Продължавай!",
  },
}

export function BadgeProgressCard({ progress, locale = "en", className }: BadgeProgressProps) {
  const t = labels[locale]
  const badge = progress.badge
  const color = badge.color || BADGE_COLORS[badge.code] || "bg-gray-500 text-white"
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t.nextBadge}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full text-2xl",
              color
            )}
          >
            {badge.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {locale === "bg" && badge.name_bg ? badge.name_bg : badge.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {progress.requirement}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Progress value={progress.progress} className="h-2 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">
                {progress.progress}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =====================================================
// Inline Progress (for compact views)
// =====================================================

interface BadgeProgressInlineProps {
  progress: BadgeProgressType
  locale?: "en" | "bg"
  className?: string
}

export function BadgeProgressInline({ progress, locale = "en", className }: BadgeProgressInlineProps) {
  const badge = progress.badge
  const color = badge.color || BADGE_COLORS[badge.code] || "bg-gray-500 text-white"
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full text-sm",
          color
        )}
      >
        {badge.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium truncate">
            {locale === "bg" && badge.name_bg ? badge.name_bg : badge.name}
          </span>
          <span className="text-muted-foreground ml-2">{progress.progress}%</span>
        </div>
        <Progress value={progress.progress} className="h-1 mt-1" />
      </div>
    </div>
  )
}

// =====================================================
// Badge Collection View
// =====================================================

interface BadgeCollectionProps {
  earned: DisplayBadge[]
  available: BadgeProgressType[]
  locale?: "en" | "bg"
  className?: string
}

const collectionLabels = {
  en: {
    earned: "Earned Badges",
    inProgress: "In Progress",
    noBadges: "No badges yet",
    noProgress: "Keep selling to earn badges!",
  },
  bg: {
    earned: "Спечелени Значки",
    inProgress: "В Процес",
    noBadges: "Все още няма значки",
    noProgress: "Продължавай да продаваш за да спечелиш значки!",
  },
}

export function BadgeCollection({ earned, available, locale = "en", className }: BadgeCollectionProps) {
  const t = collectionLabels[locale]
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Earned Badges */}
      <div>
        <h3 className="text-sm font-semibold mb-3">{t.earned}</h3>
        {earned.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {earned.map((badge) => {
              const color = badge.color || BADGE_COLORS[badge.code] || "bg-gray-500 text-white"
              return (
                <div
                  key={badge.code}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                    color
                  )}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.noBadges}</p>
        )}
      </div>
      
      {/* In Progress */}
      <div>
        <h3 className="text-sm font-semibold mb-3">{t.inProgress}</h3>
        {available.length > 0 ? (
          <div className="space-y-3">
            {available.slice(0, 3).map((progress) => (
              <BadgeProgressInline
                key={progress.badge.code}
                progress={progress}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.noProgress}</p>
        )}
      </div>
    </div>
  )
}
