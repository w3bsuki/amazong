import type { LucideIcon } from "lucide-react"

export interface AccountDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface UserProfile {
  display_name: string | null
  avatar_url: string | null
  business_name: string | null
  username: string | null
}

export interface SellerStats {
  average_rating: number | null
  total_sales: number | null
}

export interface AccountStats {
  pendingOrders: number
  activeListings: number
}

export type MenuBadgeTone = "destructive" | "warning" | "muted"

export interface MenuItem {
  href: string
  icon: LucideIcon
  label: string
  badge?: string | null
  badgeTone?: MenuBadgeTone
}
