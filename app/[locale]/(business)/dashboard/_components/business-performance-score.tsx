"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconChartBar,
  IconArrowRight,
  IconInfoCircle,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface PerformanceMetric {
  id: string
  label: string
  value: number
  target: number
  unit?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: number
  description?: string
}

interface BusinessPerformanceScoreProps {
  overallScore: number
  metrics: PerformanceMetric[]
  className?: string
}

const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return IconTrendingUp
    case "down":
      return IconTrendingDown
    default:
      return IconMinus
  }
}

const getTrendColor = (trend?: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return "text-emerald-600"
    case "down":
      return "text-red-600"
    default:
      return "text-muted-foreground"
  }
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

const getScoreLabel = (score: number) => {
  if (score >= 90) return "Excellent"
  if (score >= 80) return "Great"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  return "Needs Work"
}

export function BusinessPerformanceScore({
  overallScore,
  metrics,
  className,
}: BusinessPerformanceScoreProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <IconChartBar className="size-4" />
              Store Performance
            </CardTitle>
            <CardDescription className="mt-0.5">
              How your store is performing
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/analytics">
              Details
              <IconArrowRight className="ml-1 size-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Score Circle */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <svg className="size-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${overallScore * 2.64} 264`}
                strokeLinecap="round"
                className={getScoreColor(overallScore)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-2xl font-bold", getScoreColor(overallScore))}>
                {overallScore}
              </span>
              <span className="text-2xs text-muted-foreground uppercase">
                Score
              </span>
            </div>
          </div>
          <div>
            <Badge 
              variant="outline" 
              className={cn(
                "mb-1",
                overallScore >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                overallScore >= 60 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                "bg-red-50 text-red-700 border-red-200"
              )}
            >
              {getScoreLabel(overallScore)}
            </Badge>
            <p className="text-sm text-muted-foreground max-w-[180px]">
              {overallScore >= 80 
                ? "Your store is performing well! Keep it up."
                : overallScore >= 60
                ? "Your store is doing okay. Room for improvement."
                : "Focus on improving these metrics."
              }
            </p>
          </div>
        </div>
        
        {/* Individual Metrics */}
        <div className="space-y-4">
          {metrics.map((metric) => {
            const progress = Math.min((metric.value / metric.target) * 100, 100)
            const TrendIcon = getTrendIcon(metric.trend)
            
            return (
              <div key={metric.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{metric.label}</span>
                    {metric.description && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IconInfoCircle className="size-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[200px] text-xs">{metric.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">
                      {metric.value}{metric.unit}
                    </span>
                    {metric.trend && metric.trendValue !== undefined && (
                      <span className={cn("flex items-center text-xs", getTrendColor(metric.trend))}>
                        <TrendIcon className="size-3" />
                        {metric.trendValue > 0 ? "+" : ""}{metric.trendValue}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={progress} 
                    className="h-1.5 flex-1"
                  />
                  <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">
                    /{metric.target}{metric.unit}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Calculate performance score from metrics
export function calculatePerformanceScore(stats: {
  orders: number
  products: number
  views: number
  rating: number
  revenue: number
}) {
  const metrics: PerformanceMetric[] = [
    {
      id: "conversion",
      label: "Conversion Rate",
      value: stats.orders > 0 && stats.views > 0 
        ? Number(((stats.orders / stats.views) * 100).toFixed(1))
        : 0,
      target: 3,
      unit: "%",
      trend: "up",
      trendValue: 12,
      description: "Percentage of visitors who made a purchase",
    },
    {
      id: "rating",
      label: "Customer Rating",
      value: stats.rating || 0,
      target: 5,
      trend: "neutral",
      description: "Average rating from customer reviews",
    },
    {
      id: "listings",
      label: "Active Listings",
      value: stats.products,
      target: 20,
      trend: "up",
      trendValue: 5,
      description: "Number of products listed in your store",
    },
    {
      id: "orders",
      label: "Orders (30d)",
      value: stats.orders,
      target: 50,
      trend: stats.orders > 10 ? "up" : "neutral",
      trendValue: stats.orders > 10 ? 8 : 0,
      description: "Number of orders in the last 30 days",
    },
  ]
  
  // Calculate overall score (weighted average)
  const weights = { conversion: 30, rating: 25, listings: 20, orders: 25 }
  let totalScore = 0
  
  for (const metric of metrics) {
    const progress = Math.min((metric.value / metric.target) * 100, 100)
    const weight = weights[metric.id as keyof typeof weights] || 25
    totalScore += (progress * weight) / 100
  }
  
  return {
    overallScore: Math.round(totalScore),
    metrics,
  }
}
