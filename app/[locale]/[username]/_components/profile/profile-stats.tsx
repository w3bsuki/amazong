import { cn } from "@/lib/utils"

interface StatItemProps {
  value: number | string
  label: string
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center min-w-0">
      <p className="text-xl font-bold text-foreground tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-xs text-muted-foreground truncate">{label}</p>
    </div>
  )
}

interface ProfileStatsProps {
  stats: Array<{
    value: number | string
    label: string
  }>
  className?: string
}

/**
 * ProfileStats - Horizontal stats row for mobile profiles
 * 
 * Displays stats in a row with clean card background
 * Pattern: Listings | Sold | Followers | Following
 */
export function ProfileStats({ stats, className }: ProfileStatsProps) {
  return (
    <div className={cn(
      "grid gap-2 p-3.5 bg-card border border-border rounded-xl",
      // Dynamic grid columns based on stat count
      stats.length === 4 && "grid-cols-4",
      stats.length === 3 && "grid-cols-3",
      stats.length === 2 && "grid-cols-2",
      (stats.length < 2 || stats.length > 4) && "grid-cols-4",
      className
    )}>
      {stats.map((stat, index) => (
        <StatItem key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  )
}

