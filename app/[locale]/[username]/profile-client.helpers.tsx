import {
  Bird as TwitterLogo,
  Facebook as FacebookLogo,
  Globe,
  Instagram as InstagramLogo,
  Music2 as TiktokLogo,
  Star,
  Youtube as YoutubeLogo,
} from "lucide-react"

export const socialIcons: Record<string, React.ReactNode> = {
  facebook: <FacebookLogo className="size-5" />,
  instagram: <InstagramLogo className="size-5" />,
  twitter: <TwitterLogo className="size-5" />,
  tiktok: <TiktokLogo className="size-5" />,
  youtube: <YoutubeLogo className="size-5" />,
}

export const fallbackSocialIcon = <Globe className="size-4" />

export function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number
  count: number
  size?: "sm" | "md"
}) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className={`text-rating ${size === "md" ? "size-5" : "size-4"}`} />)
    } else if (i === fullStars && hasHalf) {
      stars.push(<Star key={i} className={`text-rating ${size === "md" ? "size-5" : "size-4"}`} />)
    } else {
      stars.push(
        <Star key={i} className={`text-rating-empty ${size === "md" ? "size-5" : "size-4"}`} />
      )
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className={`font-medium ${size === "md" ? "text-base" : "text-sm"}`}>
        {rating.toFixed(1)}
      </span>
      <span className={`text-muted-foreground ${size === "md" ? "text-sm" : "text-xs"}`}>({count})</span>
    </div>
  )
}

export function formatTimeAgo(input: string, locale: string): string | null {
  const date = new Date(input)
  const ms = date.getTime()
  if (!Number.isFinite(ms)) return null

  const diffSeconds = Math.round((ms - Date.now()) / 1000)
  const abs = Math.abs(diffSeconds)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" })

  if (abs < 60) return rtf.format(diffSeconds, "second")

  const diffMinutes = Math.round(diffSeconds / 60)
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute")

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour")

  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day")

  const diffWeeks = Math.round(diffDays / 7)
  if (Math.abs(diffWeeks) < 5) return rtf.format(diffWeeks, "week")

  const diffMonths = Math.round(diffDays / 30)
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month")

  const diffYears = Math.round(diffDays / 365)
  return rtf.format(diffYears, "year")
}
