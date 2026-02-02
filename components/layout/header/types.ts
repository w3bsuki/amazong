import type { User } from "@supabase/supabase-js"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UserListingStats } from "@/components/layout/sidebar/sidebar-menu-v2"

// =============================================================================
// Header Types
// =============================================================================

export type HeaderVariant = "default" | "homepage" | "product" | "contextual" | "profile" | "minimal"

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
  /** Title for contextual header (category name) */
  title?: string | undefined
  /** Back href for contextual header */
  backHref?: string | undefined
  /** Back handler for instant navigation */
  onBack?: (() => void) | undefined
  /** Subcategories for contextual circles */
  subcategories?: CategoryTreeNode[] | undefined
  /** Callback when subcategory circle is clicked */
  onSubcategoryClick?: ((cat: CategoryTreeNode) => void) | undefined
  /** Hide search/wishlist/cart actions (for assistant page) */
  hideActions?: boolean | undefined
}

export interface ProfileHeaderProps extends BaseHeaderProps {
  /** Display name for profile header */
  displayName?: string | null | undefined
  /** Username for profile (@ handle) */
  username?: string | null | undefined
  /** Avatar URL for profile */
  avatarUrl?: string | null | undefined
  /** Whether viewing own profile */
  isOwnProfile: boolean
  /** Whether current user is following this profile */
  isFollowing?: boolean | undefined
  /** Seller ID for follow action */
  sellerId?: string | null | undefined
  /** Router for back navigation */
  onBack: () => void
}

export interface MinimalHeaderProps {
  /** Locale for translations */
  locale: string
}
