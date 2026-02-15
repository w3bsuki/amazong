import * as React from "react"
import { Link } from "@/i18n/routing"
import { formatDistanceToNow } from "date-fns"
import {
  IconShoppingCart,
  IconBox,
  IconUser,
  IconStar,
  IconArrowRight,
  IconCheck,
} from "@/lib/icons/tabler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type ActivityType = "order" | "product" | "review" | "customer" | "milestone"

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  href?: string
  meta?: {
    amount?: number
    status?: string
    image?: string
    rating?: number
  }
}

interface BusinessActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

const activityIcons: Record<ActivityType, React.ElementType> = {
  order: IconShoppingCart,
  product: IconBox,
  review: IconStar,
  customer: IconUser,
  milestone: IconCheck,
}

const activityColors: Record<ActivityType, string> = {
  order: "bg-info/10 text-info",
  product: "bg-selected text-primary",
  review: "bg-warning/10 text-warning",
  customer: "bg-success/10 text-success",
  milestone: "bg-selected text-primary",
}

const formatCurrencyBGN = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits: 2,
  }).format(value)

export function BusinessActivityFeed({ activities, className }: BusinessActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted mb-2">
              <IconShoppingCart className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No recent activity yet
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/analytics">
              View all
              <IconArrowRight className="ml-1 size-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-0">
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.type]
              const iconColor = activityColors[activity.type]

              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-start gap-3 px-6 py-3 hover:bg-hover active:bg-active transition-colors",
                    index !== activities.length - 1 && "border-b"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "flex size-8 items-center justify-center rounded-full shrink-0 mt-0.5",
                    iconColor
                  )}>
                    <Icon className="size-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      {activity.meta?.amount && (
                        <span className="text-sm font-semibold tabular-nums text-success shrink-0">
                          +{formatCurrencyBGN(activity.meta.amount)}
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {activity.meta?.status && (
                        <Badge variant="outline" className="text-2xs h-5 px-1.5">
                          {activity.meta.status}
                        </Badge>
                      )}
                      {(() => {
                        const rating = activity.meta?.rating
                        if (typeof rating !== "number") return null

                        return (
                          <div className="flex items-center gap-0.5 text-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <IconStar
                                key={i}
                                className={cn(
                                  "size-3",
                                  i < rating ? "fill-current" : "opacity-30"
                                )}
                              />
                            ))}
                          </div>
                        )
                      })()}
                      <span className="text-2xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail if available */}
                  {activity.meta?.image && (
                    <Avatar className="size-10 rounded-md shrink-0">
                      <AvatarImage src={activity.meta.image} className="object-cover" />
                      <AvatarFallback className="rounded-md">
                        <IconBox className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
