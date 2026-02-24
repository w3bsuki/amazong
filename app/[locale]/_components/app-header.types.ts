import type { User } from "@supabase/supabase-js"

import type { HeaderVariant } from "@/components/layout/header/types"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import type { UserListingStats } from "@/components/layout/sidebar/sidebar-menu"

export interface AppHeaderProps {
  variant?: HeaderVariant
  user: User | null
  categories?: CategoryTreeNode[]
  userStats?: UserListingStats

  activeCategory?: string
  onCategorySelect?: (slug: string) => void
  onSearchOpen?: () => void

  productTitle?: string | null
  sellerName?: string | null
  sellerUsername?: string | null
  sellerAvatarUrl?: string | null
  productId?: string | null
  productPrice?: number | null
  productImage?: string | null

  contextualTitle?: string
  contextualActiveSlug?: string
  contextualBackHref?: string
  onContextualBack?: () => void
  contextualSubcategories?: CategoryTreeNode[]
  onSubcategoryClick?: (cat: CategoryTreeNode) => void

  hideSubheader?: boolean
  hideOnMobile?: boolean
  hideOnDesktop?: boolean
}
