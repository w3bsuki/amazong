import type { ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UserListingStats } from "@/components/layout/sidebar/sidebar-menu"

// =============================================================================
// Header Types
// =============================================================================

export type HeaderVariant = "default" | "homepage" | "product" | "contextual"

export interface BaseHeaderProps {
  /** Authenticated user */
  user: User | null
  /** Categories for navigation */
  categories?: CategoryTreeNode[] | undefined
  /** User listing stats for hamburger menu footer */
  userStats?: UserListingStats | undefined
  /** Locale for translations */
  locale: string
}

export interface HomepageHeaderProps extends BaseHeaderProps {
  /** Active category slug for homepage pills */
  activeCategory: string
  /** Callback when category pill is selected */
  onCategorySelect?: ((slug: string) => void) | undefined
  /** Callback to open search overlay */
  onSearchOpen?: (() => void) | undefined
  /** Optional context chip label rendered inside the search pill. */
  contextLabel?: string | undefined
}

export interface ProductHeaderProps extends BaseHeaderProps {
  /** Product title for product header */
  productTitle?: string | null | undefined
  /** Seller name for product header */
  sellerName?: string | null | undefined
  /** Seller username for profile link */
  sellerUsername?: string | null | undefined
  /** Seller avatar URL */
  sellerAvatarUrl?: string | null | undefined
  /** Router for back navigation */
  onBack: () => void
  /** Product ID for wishlist */
  productId?: string | null | undefined
  /** Product price for wishlist */
  productPrice?: number | null | undefined
  /** Product image for wishlist */
  productImage?: string | null | undefined
}

export interface ContextualHeaderProps extends BaseHeaderProps {
  /** Title for contextual header */
  title?: ReactNode | undefined
  /** Optional title class override */
  titleClassName?: string | undefined
  /** Active category slug (used for search context). */
  activeSlug?: string | undefined
  /** Back href for contextual header */
  backHref?: string | undefined
  /** Back handler for instant navigation */
  onBack?: (() => void) | undefined
  /** Subcategories for contextual pill rails rendered by route content. */
  subcategories?: CategoryTreeNode[] | undefined
  /** Callback when subcategory pill is clicked */
  onSubcategoryClick?: ((cat: CategoryTreeNode) => void) | undefined
  /** Optional trailing actions (replaces the default search/wishlist/cart cluster). */
  trailingActions?: ReactNode | undefined
  /** Hide the entire trailing actions area. */
  hideActions?: boolean | undefined
}

