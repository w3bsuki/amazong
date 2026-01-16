import { BadgeCheck, MessageCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn, safeAvatarSrc } from "@/lib/utils"

type Seller = {
  id: string
  username?: string | null
  display_name?: string | null
  avatar_url?: string | null
  verified?: boolean | null
  created_at?: string | null
  last_active?: string | null
}

function formatLastActive(lastActive: string | null | undefined, locale: string): string | null {
  if (!lastActive) return null
  const date = new Date(lastActive)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 5) {
    return locale === "bg" ? "Онлайн" : "Online now"
  }
  if (diffMins < 60) {
    return locale === "bg" ? `Активен преди ${diffMins} мин` : `Active ${diffMins}m ago`
  }
  if (diffHours < 24) {
    return locale === "bg" ? `Активен преди ${diffHours} ч` : `Active ${diffHours}h ago`
  }
  if (diffDays === 1) {
    return locale === "bg" ? "Активен вчера" : "Active yesterday"
  }
  if (diffDays < 7) {
    return locale === "bg" ? `Активен преди ${diffDays} дни` : `Active ${diffDays}d ago`
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return locale === "bg" ? `Активен преди ${weeks} седм.` : `Active ${weeks}w ago`
  }
  return null // Don't show if inactive for over a month
}

type SellerStats = {
  average_rating?: number | null
  total_reviews?: number | null
  positive_feedback_pct?: number | null
  follower_count?: number | null
  total_sales?: number | null
  response_time_hours?: number | null
  active_listings?: number | null
} | null

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p.slice(0, 1).toUpperCase()).join("")
}

export function SellerBanner(props: {
  locale: string
  seller: Seller
  stats: SellerStats
  className?: string
}) {
  const { locale, seller, stats, className } = props

  const displayName = seller.display_name || seller.username || "Seller"
  const year = seller.created_at ? new Date(seller.created_at).getFullYear() : null
  const lastActiveText = formatLastActive(seller.last_active, locale)

  const positive = stats?.positive_feedback_pct != null ? Math.round(Number(stats.positive_feedback_pct)) : null
  const reviews = stats?.total_reviews != null ? Number(stats.total_reviews) : null
  const activeListings = stats?.active_listings != null ? Number(stats.active_listings) : null

  const isOnline = lastActiveText === "Online now" || lastActiveText === "Онлайн"

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border border-seller-card-border bg-seller-card p-4",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <Avatar className="h-11 w-11 border border-border shrink-0">
              <AvatarImage src={safeAvatarSrc(seller.avatar_url)} alt={displayName} />
              <AvatarFallback className="text-xs">{initials(displayName)}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-seller-card" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="font-semibold text-foreground truncate">{displayName}</div>
              {seller.verified ? <BadgeCheck className="h-4 w-4 text-verified shrink-0" /> : null}
            </div>
            <div className="text-xs text-muted-foreground">
              {positive != null ? `${positive}% positive` : ""}
              {positive != null && reviews != null ? " · " : ""}
              {reviews != null ? `${reviews} reviews` : ""}
              {(positive != null || reviews != null) && year ? " · " : ""}
              {year ? (locale === "bg" ? `Член от ${year}` : `Member since ${year}`) : ""}
            </div>
            {lastActiveText && !isOnline && (
              <div className="text-2xs text-muted-foreground/70 mt-0.5">
                {lastActiveText}
              </div>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 px-3 gap-2 rounded-full"
          aria-label="Message seller"
        >
          <MessageCircle className="h-4 w-4" />
          {locale === "bg" ? "Съобщение" : "Message"}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-border/50 pt-3">
        <div className="text-center">
          <div className="text-2xs text-muted-foreground uppercase tracking-wide font-medium">
            {locale === "bg" ? "Отговор" : "Response"}
          </div>
          <div className="text-sm font-medium text-foreground">
            {stats?.response_time_hours != null ? `${Math.round(Number(stats.response_time_hours))}h` : "—"}
          </div>
        </div>
        <div className="text-center border-l border-border/50">
          <div className="text-2xs text-muted-foreground uppercase tracking-wide font-medium">
            {locale === "bg" ? "Продажби" : "Sales"}
          </div>
          <div className="text-sm font-medium text-foreground">{stats?.total_sales != null ? Number(stats.total_sales) : "—"}</div>
        </div>
        <div className="text-center border-l border-border/50">
          <div className="text-2xs text-muted-foreground uppercase tracking-wide font-medium">
            {locale === "bg" ? "Обяви" : "Listings"}
          </div>
          <div className="text-sm font-medium text-foreground">
            {activeListings != null ? activeListings : "—"}
          </div>
        </div>
        <div className="text-center border-l border-border/50">
          <div className="text-2xs text-muted-foreground uppercase tracking-wide font-medium">
            {locale === "bg" ? "Последов." : "Followers"}
          </div>
          <div className="text-sm font-medium text-foreground">
            {stats?.follower_count != null ? Number(stats.follower_count) : "—"}
          </div>
        </div>
      </div>
    </div>
  )
}
