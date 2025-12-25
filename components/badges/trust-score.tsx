/**
 * Trust Score Component
 * Displays a visual trust score indicator
 */

"use client"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, Shield } from "@phosphor-icons/react"
import type { TrustScoreBreakdown } from "@/lib/types/badges"

interface TrustScoreProps {
  score: number
  breakdown?: TrustScoreBreakdown
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  showTooltip?: boolean
  locale?: "en" | "bg"
  className?: string
}

const labels = {
  en: {
    trustScore: "Trust Score",
    verification: "Verification",
    performance: "Performance",
    low: "New",
    medium: "Trusted",
    high: "Highly Trusted",
    excellent: "Excellent",
  },
  bg: {
    trustScore: "Оценка на Доверие",
    verification: "Верификация",
    performance: "Представяне",
    low: "Нов",
    medium: "Доверен",
    high: "Високо Доверен",
    excellent: "Отличен",
  },
}

function getTrustLevel(score: number): "low" | "medium" | "high" | "excellent" {
  if (score >= 80) return "excellent"
  if (score >= 60) return "high"
  if (score >= 30) return "medium"
  return "low"
}

const levelColors = {
  low: "text-gray-500",
  medium: "text-blue-500",
  high: "text-emerald-500",
  excellent: "text-amber-500",
}

const levelBgColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-emerald-500",
  excellent: "bg-amber-500",
}

const levelIcons = {
  low: Shield,
  medium: Shield,
  high: ShieldCheck,
  excellent: ShieldCheck,
}

export function TrustScore({
  score,
  breakdown,
  size = "md",
  showLabel = true,
  showTooltip = true,
  locale = "en",
  className,
}: TrustScoreProps) {
  const level = getTrustLevel(score)
  const Icon = levelIcons[level]
  const t = labels[locale]
  
  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
    lg: "text-base gap-2",
  }
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }
  
  const content = (
    <div className={cn("flex items-center", sizeClasses[size], className)}>
      <Icon className={cn(iconSizes[size], levelColors[level])} weight="fill" />
      {showLabel && (
        <span className={cn("font-medium", levelColors[level])}>
          {score}/100
        </span>
      )}
    </div>
  )
  
  if (!showTooltip) {
    return content
  }
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="top" className="w-48 p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{t.trustScore}</span>
              <span className={cn("font-bold", levelColors[level])}>
                {score}/100
              </span>
            </div>
            <Progress value={score} className="h-2" />
            <p className={cn("text-xs font-medium text-center", levelColors[level])}>
              {t[level]}
            </p>
            {breakdown && (
              <div className="pt-2 border-t space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.verification}</span>
                  <span>{breakdown.verification} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.performance}</span>
                  <span>{breakdown.performance} pts</span>
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// =====================================================
// Trust Score Bar (Full width version)
// =====================================================

interface TrustScoreBarProps {
  score: number
  breakdown?: TrustScoreBreakdown
  showBreakdown?: boolean
  locale?: "en" | "bg"
  className?: string
}

export function TrustScoreBar({
  score,
  breakdown,
  showBreakdown = true,
  locale = "en",
  className,
}: TrustScoreBarProps) {
  const level = getTrustLevel(score)
  const t = labels[locale]
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{t.trustScore}</span>
        <span className={cn("font-bold", levelColors[level])}>
          {score}/100 · {t[level]}
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", levelBgColors[level])}
          style={{ width: `${score}%` }}
        />
      </div>
      {showBreakdown && breakdown && (
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>{t.verification}: {breakdown.verification} pts</span>
          <span>{t.performance}: {breakdown.performance} pts</span>
        </div>
      )}
    </div>
  )
}

// =====================================================
// Compact Trust Indicator (for lists)
// =====================================================

interface TrustIndicatorProps {
  score: number
  className?: string
}

export function TrustIndicator({ score, className }: TrustIndicatorProps) {
  const level = getTrustLevel(score)
  const Icon = levelIcons[level]
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full",
              level === "excellent" && "bg-amber-100 dark:bg-amber-900/30",
              level === "high" && "bg-emerald-100 dark:bg-emerald-900/30",
              level === "medium" && "bg-blue-100 dark:bg-blue-900/30",
              level === "low" && "bg-gray-100 dark:bg-gray-800",
              className
            )}
          >
            <Icon className={cn("w-4 h-4", levelColors[level])} weight="fill" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Trust Score: {score}/100</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
