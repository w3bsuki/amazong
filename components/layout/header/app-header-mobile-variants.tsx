import type { ReactNode } from "react"
import { MessageCircle as ChatCircle, Settings as Gear, Share as Export } from "lucide-react"
import type { User } from "@supabase/supabase-js"

import { MobileHomepageHeader } from "@/components/layout/header/mobile/homepage-header"
import { MobileProductHeader } from "@/components/layout/header/mobile/product-header"
import { MobileContextualHeader } from "@/components/layout/header/mobile/contextual-header"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import type { UserListingStats } from "@/components/layout/sidebar/sidebar-menu"
import type { HeaderVariant } from "@/components/layout/header/types"

type ProfileLabels = {
  profile: string
  share: string
  settings: string
  message: string
}

type AppHeaderMobileVariantsProps = {
  variant: HeaderVariant
  user: User | null
  categories: CategoryTreeNode[]
  userStats?: UserListingStats | undefined
  locale: string
  homepage: {
    activeCategory: string
    onCategorySelect?: ((slug: string) => void) | undefined
    onSearchOpen: () => void
  }
  product: {
    title?: string | null | undefined
    sellerName?: string | null | undefined
    sellerUsername?: string | null | undefined
    sellerAvatarUrl?: string | null | undefined
    productId?: string | null | undefined
    productPrice?: number | null | undefined
    productImage?: string | null | undefined
  }
  contextual: {
    title?: ReactNode | undefined
    activeSlug?: string | undefined
    backHref?: string | undefined
    onBack?: (() => void) | undefined
    subcategories: CategoryTreeNode[]
    onSubcategoryClick?: ((cat: CategoryTreeNode) => void) | undefined
    trailingActions?: ReactNode | undefined
    hideActions: boolean
    expandTitle: boolean
  }
  profile: {
    usernameFromRoute: string | null
    displayName: string | null
    username: string | null
    isOwnProfile: boolean
    sellerId: string | null
    labels: ProfileLabels
    onShare: () => Promise<void>
  }
  onBack: () => void
}

function ProfileTrailingActions({
  isOwnProfile,
  sellerId,
  labels,
  onShare,
}: {
  isOwnProfile: boolean
  sellerId: string | null
  labels: ProfileLabels
  onShare: () => Promise<void>
}) {
  return (
    <>
      <IconButton
        type="button"
        variant="ghost"
        className="text-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active"
        aria-label={labels.share}
        onClick={onShare}
      >
        <Export className="size-icon-sm" />
      </IconButton>

      {isOwnProfile ? (
        <IconButton
          asChild
          variant="ghost"
          className="text-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active"
          aria-label={labels.settings}
        >
          <Link href="/account">
            <Gear className="size-icon-sm" />
          </Link>
        </IconButton>
      ) : sellerId ? (
        <IconButton
          asChild
          variant="ghost"
          className="text-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active"
          aria-label={labels.message}
        >
          <Link href={`/chat?to=${sellerId}`}>
            <ChatCircle className="size-icon-sm" />
          </Link>
        </IconButton>
      ) : null}
    </>
  )
}

export function AppHeaderMobileVariants({
  variant,
  user,
  categories,
  userStats,
  locale,
  homepage,
  product,
  contextual,
  profile,
  onBack,
}: AppHeaderMobileVariantsProps) {
  const homepageMobileHeader = (
    <MobileHomepageHeader
      user={user}
      userStats={userStats}
      activeCategory={homepage.activeCategory}
      onCategorySelect={homepage.onCategorySelect}
      onSearchOpen={homepage.onSearchOpen}
      locale={locale}
    />
  )

  switch (variant) {
    case "homepage":
      return homepageMobileHeader
    case "product":
      return (
        <MobileProductHeader
          user={user}
          categories={categories}
          userStats={userStats}
          productTitle={product.title}
          sellerName={product.sellerName}
          sellerUsername={product.sellerUsername}
          sellerAvatarUrl={product.sellerAvatarUrl}
          productId={product.productId}
          productPrice={product.productPrice}
          productImage={product.productImage}
          onBack={onBack}
          locale={locale}
        />
      )
    case "contextual": {
      const isProfileHeader = Boolean(profile.usernameFromRoute)
      const title = isProfileHeader
        ? profile.displayName ?? profile.username ?? profile.usernameFromRoute ?? profile.labels.profile
        : contextual.title

      return (
        <MobileContextualHeader
          user={user}
          categories={categories}
          userStats={userStats}
          title={title}
          activeSlug={contextual.activeSlug}
          backHref={isProfileHeader ? "/" : contextual.backHref}
          onBack={isProfileHeader ? onBack : contextual.onBack}
          subcategories={contextual.subcategories}
          onSubcategoryClick={contextual.onSubcategoryClick}
          trailingActions={
            isProfileHeader ? (
              <ProfileTrailingActions
                isOwnProfile={profile.isOwnProfile}
                sellerId={profile.sellerId}
                labels={profile.labels}
                onShare={profile.onShare}
              />
            ) : (
              contextual.trailingActions
            )
          }
          hideActions={contextual.hideActions}
          expandTitle={contextual.expandTitle}
          locale={locale}
        />
      )
    }
    default:
      return homepageMobileHeader
  }
}
